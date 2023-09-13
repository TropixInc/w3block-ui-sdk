/* eslint-disable prettier/prettier */
import { ReactNode, useMemo, useState } from 'react';
import { useBoolean } from 'react-use';

import { compareAsc, format } from 'date-fns';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { QrCodeReader } from '../../../shared/components/QrCodeReader';
import {
  QrCodeError,
  TypeError,
} from '../../../shared/components/QrCodeReader/QrCodeError';
import { QrCodeValidated } from '../../../shared/components/QrCodeReader/QrCodeValidated';
import { Spinner } from '../../../shared/components/Spinner';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import useIsMobile from '../../../shared/hooks/useIsMobile/useIsMobile';
import useRouter from '../../../shared/hooks/useRouter';
import { useSessionUser } from '../../../shared/hooks/useSessionUser';
import useTranslation from '../../../shared/hooks/useTranslation';
import { Button } from '../../../tokens/components/Button';
import GenericTable, {
  ColumnType,
} from '../../../tokens/components/GenericTable/GenericTable';
import StatusTag, { statusMobile } from '../../../tokens/components/StatusTag/StatusTag';
import { BenefitStatus } from '../../enums/BenefitStatus';
import useGetPassBenefits from '../../hooks/useGetPassBenefits';
import useGetPassById from '../../hooks/useGetPassById';
import usePostBenefitRegisterUse from '../../hooks/usePostBenefitRegisterUse';
import useVerifyBenefit from '../../hooks/useVerifyBenefit';
import { TokenPassBenefits, TokenPassBenefitType } from '../../interfaces/PassBenefitDTO';
import { BaseTemplate } from '../BaseTemplate';
import { VerifyBenefit } from '../VerifyBenefit';

interface TableRow {
  name: ReactNode;
  local: string;
  period?: string;
  status?: ReactNode;
  action: ReactNode;
}

interface formatAddressProps {
  type: TokenPassBenefitType;
  benefit: TokenPassBenefits;
}

export const PassesDetail = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const tokenPassId = String(router.query.tokenPassId) || '';
  const chainId = String(router.query.chainId) || '';
  const contractAddress = String(router.query.contractAddress) || ''
  const [translate] = useTranslation();
  const [showScan, setOpenScan] = useBoolean(false);
  const [showSuccess, setShowSuccess] = useBoolean(false);
  const [showError, setShowError] = useBoolean(false);
  const [error, setError] = useState('');
  const [showVerify, setShowVerify] = useBoolean(false);
  const [errorType, setErrorType] = useState<TypeError>(TypeError.read);
  const [benefitId, setBenefitId] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const { pass } = useFlags();

  const [editionNumber, userId, secret, benefitIdQR] = qrCodeData.split(',');
  const { data: verifyBenefit, isLoading: verifyLoading, isError: verifyError } = useVerifyBenefit({
    benefitId: benefitIdQR,
    secret,
    userId,
    editionNumber,
    enabled: secret !== '',
  })

  const { data: tokenPass } = useGetPassById(tokenPassId);
  const user = useSessionUser();

  const { mutate: registerUse, isLoading: registerLoading } = usePostBenefitRegisterUse();
  const { data: benefits, isLoading: isLoadingBenefits } = useGetPassBenefits({ tokenPassId, chainId, contractAddress });
  const filteredBenefit = benefits?.data.items.find(({ id }) => id === benefitId);

  const formatedData = useMemo(() => {
    const filteredBenefits = tokenPass?.data?.tokenPassBenefits?.filter(benefit => {
      const isOperatorForBenefit = benefit.tokenPassBenefitOperators?.some(operator => operator.userId === user?.id);
      return isOperatorForBenefit;
    })

    const benefitStatus = benefits?.data?.items?.map((benefit) => ({
      id: benefit?.id,
      status: benefit?.status,
    }));


    const data = filteredBenefits?.map((benefit) => {
      const period = Date.parse(benefit?.eventEndsAt) ?
        format(new Date(benefit.eventStartsAt), 'dd.MM.yyyy') + ' - ' +
        format(new Date(benefit.eventEndsAt), 'dd.MM.yyyy') : format(new Date(benefit.eventStartsAt), 'dd.MM.yyyy');

      const handleAction = () => {
        setBenefitId(benefit?.id);
        setOpenScan()
      }

      const status = benefitStatus?.find((value) => value.id === benefit.id)?.status

      const formatAddress = ({ type, benefit }: formatAddressProps) => {
        if (type == TokenPassBenefitType.PHYSICAL && benefit?.tokenPassBenefitAddresses) {
          return `${benefit?.tokenPassBenefitAddresses[0]?.street}-${benefit?.tokenPassBenefitAddresses[0]?.city}`
        } else {
          return 'Online'
        }
      }

      const action = compareAsc(new Date(benefit.eventEndsAt), new Date()) ?
        <Button variant='primary' onClick={() => handleAction()}>Validar</Button>
        : null

      const BenefitName = () => {
        return <a href={PixwayAppRoutes.BENEFIT_DETAILS.replace('{benefitId}', benefit.id)}>
          {benefit.name}
        </a>
      }

      const formatted: TableRow = {
        name: <BenefitName />,
        local: formatAddress({ type: benefit?.type, benefit: benefit }),
        period,
        status: <StatusTag status={status ?? BenefitStatus.unavailable} />,
        action,
      };

      const formmatedMobile: TableRow = {
        name: <BenefitName />,
        local: formatAddress({ type: benefit?.type, benefit: benefit }),
        status: statusMobile({ status: status ?? BenefitStatus.unavailable }),
        action,
      }

      return isMobile ? formmatedMobile : formatted;
    });

    return data || [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benefits, tokenPass, isMobile]);

  const headers: ColumnType<TableRow, keyof TableRow>[] = useMemo(() => isMobile ? [
    { key: 'name', header: 'Benefício' },
    { key: 'local', header: 'Local' },
    { key: 'status', header: '' },
    { key: 'action', header: '' },
  ] : [
    { key: 'name', header: 'Benefício' },
    { key: 'local', header: 'Local' },
    { key: 'period', header: 'Período' },
    { key: 'status', header: 'Status' },
    { key: 'action', header: '' },
  ], [isMobile])

  const verifyBenefitUse = (qrCodeData: string) => {
    const [editionNumber, userId, secret, benefitIdQR] = qrCodeData.split(',');
    setOpenScan(false);

    if (!editionNumber || !userId || !secret || !benefitIdQR || verifyError) {
      setError(
        translate('token>pass>invalidFormat')
      );
      setErrorType(TypeError.read);
      setShowError(true);
    } else if (benefitId !== benefitIdQR) {
      setError('');
      setErrorType(TypeError.invalid)
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
        {
          benefitId: benefitIdQR,
          secret,
          userId,
          editionNumber,
        },
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
      setErrorType(TypeError.invalid)
      setShowError(true);
      setShowVerify(false);
      setOpenScan(false);
    }
  };

  return pass ? (
    <BaseTemplate title="Token Pass" classes={{ modal: 'pw-mx-[22px] sm:pw-mx-0' }}>
      <div className="pw-flex pw-flex-col pw-gap-8">
        <div className="pw-flex pw-items-center pw-justify-start pw-p-4 pw-gap-4 pw-border pw-border-[#E6E8EC] pw-rounded-2xl">
          <img
            className="pw-w-[216px] pw-h-[175px] pw-rounded-[20px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)]"
            src={tokenPass?.data.imageUrl}
          />

          <div className="pw-w-[1px] pw-h-[175px] pw-bg-[#DCDCDC]" />

          <div className="pw-flex pw-flex-col pw-items-start pw-justify-center pw-gap-3">
            <h3 className="w-w-full pw-font-bold pw-text-lg pw-leading-[23px] pw-text-[#295BA6]">
              {tokenPass?.data.name}
            </h3>
            <p className="pw-w-full pw-font-normal pw-text-[15px] pw-leading-[22.5px] pw-text-[#353945]">
              <span className="pw-font-bold">Descrição:</span> {tokenPass?.data.description}
            </p>
          </div>
        </div>

        {isLoadingBenefits ?
          <div className="pw-w-full pw-h-full pw-flex pw-justify-center pw-items-center">
            <Spinner />
          </div> :
          <GenericTable
            columns={headers}
            data={formatedData}
            showPagination={true}
            limitRowsNumber={isMobile ? 3 : 5}
            itensPerPage={isMobile ? 3 : 5}
          />
        }
      </div>


      {pass ?
        <>
          <QrCodeReader
            hasOpen={showScan}
            returnValue={(e) => verifyBenefitUse(e)}
            onClose={() => setOpenScan(false)}
          />
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
          <QrCodeError
            hasOpen={showError}
            onClose={() => setShowError(false)}
            validateAgain={() => setOpenScan()}
            type={errorType}
            error={error}
          />
          <VerifyBenefit
            hasOpen={showVerify}
            error={verifyError}
            isLoading={registerLoading}
            isLoadingInfo={verifyLoading}
            onClose={() => setShowVerify(false)}
            useBenefit={() => validateBenefitUse(qrCodeData)}
            data={verifyBenefit?.data}
            tokenPassBenefitAddresses={filteredBenefit?.tokenPassBenefitAddresses}
          />
        </>
        : null}
    </BaseTemplate>
  ) : null;
};
