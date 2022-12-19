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
import useIsMobile from '../../../shared/hooks/useIsMobile/useIsMobile';
import useRouter from '../../../shared/hooks/useRouter';
import { useSessionUser } from '../../../shared/hooks/useSessionUser';
import { Button } from '../../../tokens/components/Button';
import GenericTable, {
  ColumnType,
} from '../../../tokens/components/GenericTable/GenericTable';
import StatusTag, { statusMobile } from '../../../tokens/components/StatusTag/StatusTag';
import useGetPassBenefits from '../../hooks/useGetPassBenefits';
import useGetPassById from '../../hooks/useGetPassById';
import usePostBenefitUse from '../../hooks/usePostBenefitUse';
import { PassBenefitDTO, TokenPassBenefitType } from '../../interfaces/PassBenefitDTO';
import { BaseTemplate } from '../BaseTemplate';

interface TableRow {
  name: string;
  local: string;
  period?: string;
  status?: ReactNode;
  action: ReactNode;
}

interface formatAddressProps {
  type: TokenPassBenefitType;
  benefit: PassBenefitDTO;
}

export const PassesDetail = () => {
  const user = useSessionUser();
  const isMobile = useIsMobile();
  const router = useRouter();
  const tokenPassId = String(router.query.tokenPassId) || '';

  const [showScan, setOpenScan] = useBoolean(false);
  const [showSuccess, setShowSuccess] = useBoolean(false);
  const [showError, setShowError] = useBoolean(false);
  const [error, setError] = useState<TypeError>(TypeError.read);
  const { pass } = useFlags();

  const { data: tokenPass } = useGetPassById(tokenPassId);

  const { mutate: registerUse } = usePostBenefitUse();
  const { data: benefits, isLoading: isLoadingBenefits } = useGetPassBenefits({});



  const formatedData = useMemo(() => {
    const data = benefits?.data?.items?.map((benefit) => {
      const period = benefit?.eventEndsAt ?
        format(new Date(benefit.eventStartsAt), 'dd.MM.yyyy') + ' - ' +
        format(new Date(benefit.eventEndsAt), 'dd.MM.yyyy') : format(new Date(benefit.eventStartsAt), 'dd.MM.yyyy');

      const handleAction = () => {
        setOpenScan()
      }

      const formatAddress = ({ type, benefit }: formatAddressProps) => {
        if (type == TokenPassBenefitType.PHYSICAL && benefit?.tokenPassBenefitAddresses) {
          return `${benefit?.tokenPassBenefitAddresses[0]?.street}-${benefit?.tokenPassBenefitAddresses[0]?.city}`
        } else {
          return 'Online'
        }
      }

      const action = compareAsc(new Date(benefit.eventEndsAt), new Date()) ?
        <Button variant='primary' onClick={() => handleAction()}>Validar</Button>
        : <Button variant='secondary' onClick={() => handleAction()}> Relatório</Button>

      const formatted: TableRow = {
        name: benefit.name,
        local: formatAddress({ type: benefit?.type, benefit: benefit }),
        period,
        status: <StatusTag status={benefit.status} />,
        action,
      };

      const formmatedMobile: TableRow = {
        name: benefit.name,
        local: formatAddress({ type: benefit?.type, benefit: benefit }),
        status: statusMobile({ status: benefit?.status }),
        action,
      }

      return isMobile ? formmatedMobile : formatted;
    });

    return data || [];
  }, [benefits, isMobile]);

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

  const validatePassToken = (secret: string) => {

    registerUse(
      {
        secret,
        userId: user?.id ?? '',
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
        },
        onError: (error) => {
          console.error('Register Use: ', error)
          if (error instanceof Error) {
            if (error?.message === "ERR_BAD_REQUEST") {
              setError(TypeError.use)
            }
          }
          setShowError()
        },
      }
    );
  };

  return pass ? (
    <BaseTemplate title="Token Pass">
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

        {isLoadingBenefits ? <>Carregando...</> :
          <GenericTable
            columns={headers}
            data={formatedData}
            showPagination={true}
          />
        }
      </div>


      {pass ?
        <>
          <QrCodeReader
            hasOpen={showScan}
            setHasOpen={() => setOpenScan()}
            returnValue={(e) => validatePassToken(e)} />
          <QrCodeValidated
            hasOpen={showSuccess}
            onClose={() => setShowSuccess(false)}
            collectionId={tokenPassId} />
          <QrCodeError
            hasOpen={showError}
            onClose={() => setShowError(false)}
            type={error} />
        </>
        : null}
    </BaseTemplate>
  ) : null;
};
