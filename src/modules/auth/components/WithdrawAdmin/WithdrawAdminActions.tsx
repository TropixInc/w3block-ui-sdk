/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { DocumentDto } from '@w3block/sdk-id';
import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';

import { useRouterConnect } from '../../../shared';
import InputImage from '../../../shared/components/SmartInputs/InputImage/InputImage';
import { Spinner } from '../../../shared/components/Spinner';
import { useLocale } from '../../../shared/hooks/useLocale';
import { OffpixButtonBase } from '../../../tokens/components/DisplayCards/OffpixButtonBase';
import {
  useConcludeWithdraw,
  useEscrowWithdraw,
  useGetSpecificWithdraw,
  useRefuseWithdraw,
} from '../../hooks/useRequestWithdraw';

enum Steps {
  DEFAULT = 1,
  REFUSE,
  ESCROW,
  CONCLUDE,
}

type Status =
  | 'pending'
  | 'escrowing_resources'
  | 'ready_to_transfer_funds'
  | 'concluded'
  | 'failed'
  | 'refused';

const statusMapping = {
  pending: 'Pendente',
  escrowing_resources: 'Retendo fundos',
  ready_to_transfer_funds: 'Pronto para transferir',
  concluded: 'Concluído',
  failed: 'Falha',
  refused: 'Recusado',
};

const WithdrawAdminActions = ({ id }: { id: string }) => {
  const router = useRouterConnect();
  const locale = useLocale();
  const [step, setStep] = useState<Steps>(1);
  const [reason, setReason] = useState('');
  const [_, setUploadingImage] = useState(false);
  const { data, isLoading, refetch } = useGetSpecificWithdraw(id);
  const { mutate: refuseWithdraw } = useRefuseWithdraw();
  const { mutate: concludeWithdraw } = useConcludeWithdraw();
  const { mutate: escrowWithdraw } = useEscrowWithdraw();

  const dynamicMethods = useForm<DocumentDto>({
    shouldUnregister: false,
    mode: 'onChange',
  });
  const assetId = (dynamicMethods.getValues() as any)?.imageInput?.assetId;

  const concludeAction = () => {
    if (step === Steps.REFUSE)
      return (
        <div>
          <div className="pw-text-black pw-flex pw-flex-col pw-justify-between pw-mt-4">
            <p>Por favor informe o motivo da recusa:</p>
            <textarea
              onChange={(evt) => setReason(evt.target.value)}
              className="pw-p-[12px_20px] pw-h-[150px] pw-border-[2px] pw-border-[#ccc] pw-border-solid pw-rounded-md pw-bg-[#f8f8f8] pw-text-base pw-resize-none pw-w-full"
            />
          </div>
          <div className="pw-flex pw-justify-center pw-gap-20 pw-mt-8">
            <OffpixButtonBase
              className="pw-max-w-[160px] pw-h-[45px] pw-w-full !pw-text-base !pw-py-2"
              variant="outlined"
              onClick={() => setStep(1)}
            >
              Cancelar
            </OffpixButtonBase>
            <OffpixButtonBase
              className="pw-max-w-[160px] pw-w-full !pw-text-base !pw-py-2"
              variant="filled"
              disabled={reason === ''}
              onClick={() => {
                if (reason !== '') {
                  refuseWithdraw(
                    { id, reason },
                    {
                      onSuccess() {
                        setStep(1);
                        refetch();
                      },
                    }
                  );
                }
              }}
            >
              Confirmar
            </OffpixButtonBase>
          </div>
        </div>
      );
    else if (step === Steps.ESCROW)
      return (
        <div>
          <div className="pw-text-black pw-flex pw-flex-col pw-justify-between pw-mt-4">
            <p>Deseja reter os fundos para seguir com a transferência?</p>
          </div>
          <div className="pw-flex pw-justify-center pw-gap-20 pw-mt-8">
            <OffpixButtonBase
              className="pw-max-w-[160px] pw-h-[45px] pw-w-full !pw-text-base !pw-py-2"
              variant="outlined"
              onClick={() => setStep(1)}
            >
              Cancelar
            </OffpixButtonBase>
            <OffpixButtonBase
              className="pw-max-w-[160px] pw-w-full !pw-text-base !pw-py-2"
              variant="filled"
              onClick={() => {
                escrowWithdraw(
                  { id },
                  {
                    onSuccess() {
                      setStep(1);
                      refetch();
                    },
                  }
                );
              }}
            >
              Confirmar
            </OffpixButtonBase>
          </div>
        </div>
      );
    else if (step === Steps.CONCLUDE)
      return (
        <div>
          <div className="pw-text-black pw-flex pw-flex-col pw-justify-between pw-mt-4">
            <p>
              Por favor anexe o comprovante de transferência para concluir o
              processo:
            </p>
            <FormProvider {...dynamicMethods}>
              <InputImage
                title={''}
                name="imageInput"
                onChangeUploadProgess={setUploadingImage}
                textTitle="Enviar comprovante"
              />
            </FormProvider>
          </div>
          <div className="pw-flex pw-justify-center pw-gap-20 pw-mt-8">
            <OffpixButtonBase
              className="pw-max-w-[160px] pw-h-[45px] pw-w-full !pw-text-base !pw-py-2"
              variant="outlined"
              onClick={() => {
                setStep(1);
                (dynamicMethods as any).setValue('imageInput', undefined);
              }}
            >
              Cancelar
            </OffpixButtonBase>
            <OffpixButtonBase
              className="pw-max-w-[160px] pw-w-full !pw-text-base !pw-py-2"
              variant="filled"
              disabled={!assetId}
              onClick={() => {
                if (assetId) {
                  concludeWithdraw(
                    { id, receiptAssetId: assetId },
                    {
                      onSuccess() {
                        setStep(1);
                        refetch();
                      },
                    }
                  );
                }
              }}
            >
              Confirmar
            </OffpixButtonBase>
          </div>
        </div>
      );
  };

  const handleContinue = () => {
    if (data?.data?.status === 'pending') {
      setStep(3);
    }
    if (data?.data?.status === 'ready_to_transfer_funds') {
      setStep(4);
    }
  };

  const handleText = () => {
    if (data?.data?.status === 'pending') {
      return 'Reter fundos';
    }
    if (data?.data?.status === 'ready_to_transfer_funds') {
      return 'Concluir tranferência';
    }
  };

  return (
    <div className="pw-px-[40px]">
      <>
        <button
          className="pw-max-w-[120px] pw-h-[30px] pw-w-full !pw-text-base !pw-py-0 pw-text-black pw-text-start"
          onClick={() => router.push('/withdraws/admin')}
        >
          {`<`} Voltar
        </button>
        {isLoading ? (
          <div className="pw-mt-20 pw-w-full pw-flex pw-items-center pw-justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="pw-text-black pw-flex pw-flex-col pw-justify-between pw-gap-4 pw-mt-4">
              <div>
                <p className="pw-font-semibold">Usuário</p>
                <p>{data?.data?.user?.name ?? data?.data?.user?.email}</p>
              </div>
              <div>
                <p className="pw-font-semibold">Pedido realizado em</p>
                <p>
                  {format(
                    new Date(data?.data?.createdAt ?? Date.now()),
                    'PPpp',
                    {
                      locale: locale === 'pt-BR' ? ptBR : enUS,
                    }
                  )}
                </p>
              </div>
              <div>
                <p className="pw-font-semibold">Valor</p>
                <p>R${parseFloat(data?.data?.amount).toFixed(2)}</p>
              </div>
              <div>
                <p className="pw-font-semibold">Status</p>
                <p>{statusMapping[data?.data?.status as Status]}</p>
              </div>
              {data?.data?.status === 'refused' ? (
                <div>
                  <p className="pw-font-semibold">Motivo:</p>
                  <p>{data?.data?.reason}</p>
                </div>
              ) : null}
            </div>
            {step === Steps.DEFAULT ? (
              data?.data?.status === 'failed' ||
              data?.data?.status === 'refused' ||
              data?.data?.status === 'concluded' ||
              data?.data?.status === 'escrowing_resources' ? null : (
                <div className="pw-flex pw-justify-center pw-gap-20 pw-mt-8">
                  <OffpixButtonBase
                    className="pw-max-w-[160px] pw-h-[45px] pw-w-full !pw-text-base !pw-py-2"
                    variant="outlined"
                    onClick={() => setStep(2)}
                  >
                    Recusar
                  </OffpixButtonBase>
                  <OffpixButtonBase
                    className="pw-max-w-[160px] pw-w-full !pw-text-base !pw-py-2"
                    variant="filled"
                    onClick={handleContinue}
                  >
                    {handleText()}
                  </OffpixButtonBase>
                </div>
              )
            ) : (
              concludeAction()
            )}
            {data?.data?.status === 'escrowing_resources' ? (
              <div className="pw-flex pw-justify-center pw-items-center pw-text-black pw-mt-5">
                <p className="pw-font-semibold">
                  Retendo recursos, por favor aguarde para realizar a
                  transferência...
                </p>
              </div>
            ) : null}
          </>
        )}
      </>
    </div>
  );
};

export default WithdrawAdminActions;
