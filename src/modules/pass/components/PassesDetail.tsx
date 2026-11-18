/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { useBoolean } from 'react-use';

import classNames from 'classnames';
import { compareAsc, format } from 'date-fns';

import { BaseButton } from '../../shared/components/Buttons';
import { ErrorBox } from '../../shared/components/ErrorBox';
import { Pagination } from '../../shared/components/Pagination';
import { QrCodeReader } from '../../shared/components/QrCodeReader';
import {
  QrCodeError,
  TypeError,
} from '../../shared/components/QrCodeReader/QrCodeError';
import { QrCodeValidated } from '../../shared/components/QrCodeReader/QrCodeValidated';
import {
  DataTable,
  DataTableColumn,
} from '../../shared/components/ui/DataTable';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { SectionCard } from '../../shared/components/ui/SectionCard';
import { StatusPill } from '../../shared/components/ui/StatusPill';
import { Tone, UI } from '../../shared/components/ui/tokens';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { useSessionUser } from '../../shared/hooks/useSessionUser';
import useTranslation from '../../shared/hooks/useTranslation';
import { BenefitStatus } from '../enums/BenefitStatus';
import useGetPassBenefits from '../hooks/useGetPassBenefits';
import useGetPassById from '../hooks/useGetPassById';
import usePostBenefitRegisterUse from '../hooks/usePostBenefitRegisterUse';
import useVerifyBenefit from '../hooks/useVerifyBenefit';
import {
  TokenPassBenefitType,
  TokenPassBenefits,
} from '../interfaces/PassBenefitDTO';
import { BaseTemplate } from './BaseTemplate';
import { VerifyBenefit } from './VerifyBenefit';

interface BenefitRow {
  id: string;
  name: string;
  local: string;
  period: string;
  status: BenefitStatus;
  canValidate: boolean;
}

const PAGE_SIZE = 5;

const statusTone = (status: BenefitStatus): Tone =>
  status === BenefitStatus.active
    ? 'ok'
    : status === BenefitStatus.inactive
    ? 'bad'
    : 'grey';
const statusKey = (status: BenefitStatus) =>
  status === BenefitStatus.active
    ? 'tokens>StatusTag>active'
    : status === BenefitStatus.inactive
    ? 'tokens>StatusTag>inactive'
    : 'tokens>StatusTag>unavailable';

/**
 * One pass as the operator sees it: header card and the benefits this
 * operator is allowed to validate (same filter as before), with "Validar"
 * while the event is still running.
 */
export const PassesDetail = () => {
  const router = useRouterConnect();
  const tokenPassId = String(router.query.tokenPassId) || '';
  const chainId = String(router.query.chainId) || '';
  const contractAddress = String(router.query.contractAddress) || '';
  const [translate] = useTranslation();
  const [showScan, setOpenScan] = useBoolean(false);
  const [showSuccess, setShowSuccess] = useBoolean(false);
  const [showError, setShowError] = useBoolean(false);
  const [error, setError] = useState('');
  const [showVerify, setShowVerify] = useBoolean(false);
  const [errorType, setErrorType] = useState<TypeError>(TypeError.read);
  const [benefitId, setBenefitId] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [page, setPage] = useState(1);

  const [editionNumber, userId, secret, benefitIdQR] = qrCodeData.split(',');
  const {
    data: verifyBenefit,
    isFetching: verifyLoading,
    isError: verifyError,
    error: errorVerifyBenefit,
  } = useVerifyBenefit({
    benefitId: benefitIdQR,
    secret,
    userId,
    editionNumber,
    enabled: secret !== '',
  });

  const { data: tokenPass, error: errorToken } = useGetPassById(tokenPassId);
  const user = useSessionUser();

  const {
    mutate: registerUse,
    isPending: registerLoading,
    error: errorRegisterUse,
  } = usePostBenefitRegisterUse();
  const { data: benefits, isFetching: isLoadingBenefits } = useGetPassBenefits({
    tokenPassId,
    chainId,
    contractAddress,
  });
  const filteredBenefit = benefits?.data?.items?.find(
    ({ id }) => id === benefitId
  );

  const formatAddress = (
    type: TokenPassBenefitType,
    benefit: TokenPassBenefits
  ) => {
    if (
      type == TokenPassBenefitType.PHYSICAL &&
      benefit?.tokenPassBenefitAddresses?.length
    ) {
      const address = benefit.tokenPassBenefitAddresses[0];
      return [address?.street, address?.city].filter(Boolean).join(' · ');
    }
    return translate('token>pass>online');
  };

  const rows = useMemo<BenefitRow[]>(() => {
    const operated = tokenPass?.data?.tokenPassBenefits?.filter(
      (benefit: { tokenPassBenefitOperators: any[] }) =>
        benefit.tokenPassBenefitOperators?.some(
          (operator) => operator.userId === user?.id
        )
    );
    const statusById = new Map(
      (benefits?.data?.items ?? []).map((benefit) => [
        benefit?.id,
        benefit?.status,
      ])
    );
    return (operated ?? []).map((benefit: any) => {
      const start = benefit?.eventStartsAt
        ? format(new Date(benefit.eventStartsAt), 'dd/MM/yyyy')
        : '';
      const end = Date.parse(benefit?.eventEndsAt)
        ? format(new Date(benefit.eventEndsAt), 'dd/MM/yyyy')
        : '';
      return {
        id: benefit.id,
        name: benefit.name,
        local: formatAddress(benefit?.type, benefit),
        period: end ? `${start} – ${end}` : start,
        status:
          (statusById.get(benefit.id) as BenefitStatus) ??
          BenefitStatus.unavailable,
        canValidate: compareAsc(new Date(benefit.eventEndsAt), new Date()) > 0,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benefits, tokenPass, user?.id]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const startValidation = (id: string) => {
    setBenefitId(id);
    setOpenScan(true);
  };

  const columns = useMemo<DataTableColumn<BenefitRow>[]>(
    () => [
      {
        key: 'name',
        header: translate('token>pass>benefict'),
        card: 'title',
        render: (row) => (
          <a
            href={router.routerToHref(
              PixwayAppRoutes.BENEFIT_DETAILS.replace('{benefitId}', row.id)
            )}
            className={classNames(
              'pw-font-semibold pw-no-underline hover:pw-underline',
              UI.text
            )}
          >
            {row.name}
          </a>
        ),
      },
      {
        key: 'local',
        header: translate('pass>PassesDetail>local'),
        render: (row) => row.local,
      },
      {
        key: 'period',
        header: translate('pass>PassesDetail>period'),
        render: (row) => row.period || '—',
      },
      {
        key: 'status',
        header: translate('token>pass>status'),
        card: 'badge',
        render: (row) => (
          <StatusPill tone={statusTone(row.status)} size="sm">
            {translate(statusKey(row.status))}
          </StatusPill>
        ),
      },
      {
        key: 'action',
        header: '',
        align: 'right',
        card: 'action',
        render: (row) =>
          row.canValidate ? (
            <BaseButton onClick={() => startValidation(row.id)}>
              {translate('pass>PassesDetail>valid')}
            </BaseButton>
          ) : null,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate]
  );

  const verifyBenefitUse = (qrCodeData: string) => {
    const [editionNumber, userId, secret, benefitIdQR] = qrCodeData.split(',');
    setOpenScan(false);

    if (!editionNumber || !userId || !secret || !benefitIdQR || verifyError) {
      setError(translate('token>pass>invalidFormat'));
      setErrorType(TypeError.read);
      setShowError(true);
    } else if (benefitId !== benefitIdQR) {
      setError('');
      setErrorType(TypeError.invalid);
      setShowError(true);
    } else if (benefitId === benefitIdQR) {
      setQrCodeData(qrCodeData);
      setShowVerify(true);
    }
  };

  const validateBenefitUse = (qrCodeData: string) => {
    const [editionNumber, userId, secret, benefitIdQR] = qrCodeData.split(',');

    if (benefitId === benefitIdQR) {
      registerUse(
        { benefitId: benefitIdQR, secret, userId, editionNumber },
        {
          onSuccess: () => {
            setShowSuccess(true);
            setShowVerify(false);
            setOpenScan(false);
          },
          onError: (error) => {
            console.error('Register Use: ', error);
            if (error instanceof Error) {
              if (error?.message === 'ERR_BAD_REQUEST') {
                setErrorType(TypeError.use);
              }
            }
            setError('');
            setShowError(true);
            setShowVerify(false);
            setOpenScan(false);
          },
        }
      );
    } else {
      setError('');
      setErrorType(TypeError.invalid);
      setShowError(true);
      setShowVerify(false);
      setOpenScan(false);
    }
  };

  const pass = tokenPass?.data;

  return (
    <BaseTemplate title={translate('components>menu>tokenPass')}>
      {errorToken ? (
        <ErrorBox customError={errorToken} />
      ) : (
        <>
          <SectionCard>
            <a
              href={router.routerToHref(PixwayAppRoutes.TOKENPASS)}
              className="pw-inline-flex pw-items-center pw-gap-1 pw-text-[12px] pw-font-medium pw-text-[#4A5567] hover:pw-text-[#0F1729] pw-no-underline pw-mb-3"
            >
              <span aria-hidden>‹</span>{' '}
              {translate('components>menu>tokenPass')}
            </a>
            <div className="pw-flex pw-flex-col sm:pw-flex-row pw-gap-4 pw-items-start">
              {pass?.imageUrl ? (
                <img
                  className="pw-w-full sm:pw-w-[180px] pw-h-[140px] pw-object-cover pw-rounded-[10px] pw-shrink-0"
                  src={pass.imageUrl}
                  alt={pass?.name}
                />
              ) : null}
              <div className="pw-min-w-0 pw-flex-1">
                <h2
                  className={classNames(
                    'pw-text-[18px] pw-font-semibold pw-m-0',
                    UI.text
                  )}
                >
                  {pass?.name}
                </h2>
                <div
                  className={classNames(
                    'pw-text-[13px] pw-mt-1 [&_p]:pw-m-0',
                    UI.textSecondary
                  )}
                  dangerouslySetInnerHTML={{ __html: pass?.description ?? '' }}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title={translate('token>pass>benefitsOperated')} flush>
            <DataTable<BenefitRow>
              bare
              columns={columns}
              rows={pageRows}
              rowKey={(row) => row.id}
              loading={isLoadingBenefits && !benefits}
              emptyState={
                <EmptyState
                  bare
                  title={translate('token>pass>noBenefits')}
                  className="pw-py-6"
                />
              }
              className="pw-px-2 pw-pb-2"
              footer={
                totalPages > 1 ? (
                  <>
                    <span />
                    <Pagination
                      pagesQuantity={totalPages}
                      currentPage={page}
                      onChangePage={setPage}
                    />
                  </>
                ) : undefined
              }
            />
          </SectionCard>
        </>
      )}

      <QrCodeReader
        hasOpen={showScan}
        returnValue={(e) => verifyBenefitUse(e)}
        onClose={() => setOpenScan(false)}
      />
      {errorVerifyBenefit ? null : (
        <QrCodeValidated
          hasOpen={showSuccess}
          onClose={() => setShowSuccess(false)}
          validateAgain={() => setOpenScan()}
          name={filteredBenefit?.name}
          type={filteredBenefit?.type}
          tokenPassBenefitAddresses={filteredBenefit?.tokenPassBenefitAddresses}
          userEmail={verifyBenefit?.data?.user?.email}
          userName={verifyBenefit?.data?.user?.name}
        />
      )}
      <QrCodeError
        hasOpen={showError}
        onClose={() => setShowError(false)}
        validateAgain={() => setOpenScan()}
        type={errorType}
        error={error}
      />
      {errorVerifyBenefit ? null : (
        <VerifyBenefit
          hasOpen={showVerify}
          error={verifyError}
          isLoading={registerLoading}
          isLoadingInfo={verifyLoading}
          onClose={() => setShowVerify(false)}
          useBenefit={() => validateBenefitUse(qrCodeData)}
          data={verifyBenefit?.data}
          tokenPassBenefitAddresses={filteredBenefit?.tokenPassBenefitAddresses}
          errorUseBenefit={errorRegisterUse}
        />
      )}
    </BaseTemplate>
  );
};
