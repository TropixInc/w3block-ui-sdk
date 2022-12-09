/* eslint-disable prettier/prettier */
import { ReactNode, useMemo, useState } from 'react';
import { useBoolean } from 'react-use';

import { format, compareAsc } from 'date-fns';
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
import useGetPassBenefits from '../../hooks/useGetPassBenefits';
import useGetPassById from '../../hooks/useGetPassById';
import usePostBenefitRegisterUse from '../../hooks/usePostBenefitRegisterUse';
import { BaseTemplate } from '../BaseTemplate';

interface TableRow {
  id: string;
  name: string;
  local: string;
  period?: string;
  status?: string;
  action: ReactNode;
}


export const PassesDetail = () => {
  const user = useSessionUser();
  const isMobile = useIsMobile();
  const router = useRouter();
  const tokenPassId = String(router.query.passId) || '';

  const [showScan, setOpenScan] = useBoolean(false);
  const [showSuccess, setShowSuccess] = useBoolean(false);
  const [showError, setShowError] = useBoolean(false);
  const [error, setError] = useState<TypeError>(TypeError.read);
  const [benefitSelectedId, setBenefitSelected] = useState('');
  const { pass } = useFlags();

  console.log(pass);
  const { mutate: registerUse } = usePostBenefitRegisterUse();
  const { data: benefits, isLoading: isLoadingBenefits } = useGetPassBenefits({ tokenId: tokenPassId });
  const { data: tokenPass } = useGetPassById(tokenPassId);

  const formatedData = useMemo(() => {
    const data = benefits?.data.items.map((benefit) => {
      const period =
        format(new Date(benefit.eventStartsAt), 'dd.MM.yyyy') +
        ' - ' +
        format(new Date(benefit.eventEndsAt), 'dd.MM.yyyy');

      const handleAction = () => {
        setBenefitSelected(benefit.tokenPassId)
        setOpenScan()
      }

      const action = compareAsc(new Date(benefit.eventEndsAt), new Date()) ?
        <Button variant='primary' onClick={() => handleAction()}> Validar</Button>
        : <Button variant='secondary' onClick={() => handleAction()}> Relatório</Button>

      const formatted: TableRow = {
        id: benefit.id,
        name: benefit.name,
        local: benefit.name,
        period,
        status: benefit.type,
        action,
      };

      const formmatedMobile: TableRow = {
        id: benefit.id,
        name: benefit.name,
        local: 'Praça da Tijuca Rio de Janeiro, RJ - Brasil',
        action,
      }

      return isMobile ? formmatedMobile : formatted;
    });

    return data || [];
  }, [benefits, isMobile]);

  const headers: ColumnType<TableRow, keyof TableRow>[] = useMemo(() => isMobile ? [
    { key: 'name', header: 'Benefício' },
    { key: 'local', header: 'Local' },
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
        benefitId: benefitSelectedId,
        userId: user?.id ?? '',
        tokenId: benefitSelectedId,
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
            returnValue={(e) => validatePassToken(e)}/>
          <QrCodeValidated
            hasOpen={showSuccess}
            onClose={() => setShowSuccess(false)}
            collectionId={tokenPassId}/>
          <QrCodeError
            hasOpen={showError}
            onClose={() => setShowError(false)}
            type={error}/>
        </> 
        : null}
    </BaseTemplate>
  ) : null;
};
