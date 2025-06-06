/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { DocumentDto } from '@w3block/sdk-id';
import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Alert } from '../../shared/components/Alert';
import { Spinner } from '../../shared/components/Spinner';
import { useLocale } from '../../shared/hooks/useLocale';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { useUserWallet } from '../../shared/hooks/useUserWallet/useUserWallet';
import { useGetSpecificWithdrawAdmin, useRefuseWithdraw, useConcludeWithdraw, useEscrowWithdraw } from '../hooks/useRequestWithdraw';
import { BaseButton } from '../../shared/components/Buttons';
import InputWithdrawCommerce from './InputWithdrawCommerce';

enum Steps {
  DEFAULT = 1,
  REFUSE,
  ESCROW,
  CONCLUDE,
  ERROR,
  SUCCESS,
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
  const [translate] = useTranslation();
  const [step, setStep] = useState<Steps>(1);
  const [reason, setReason] = useState('');
  const [_, setUploadingImage] = useState(false);
  const { data, isLoading, refetch } = useGetSpecificWithdrawAdmin(id);
  const { mutate: refuseWithdraw, isLoading: isLoadingRefuse } =
    useRefuseWithdraw();
  const { mutate: concludeWithdraw, isLoading: isLoadingConclude } =
    useConcludeWithdraw();
  const { mutate: escrowWithdraw, isLoading: isLoadingEscrow } =
    useEscrowWithdraw();
  const { loyaltyWallet } = useUserWallet();
  const dynamicMethods = useForm<DocumentDto>({
    shouldUnregister: false,
    mode: 'onChange',
  });
  const assetId = (dynamicMethods.getValues() as any)?.imageInput?.assetId;
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const concludeAction = () => {
    if (step === Steps.REFUSE)
      return (
        <div>
          <div className="pw-text-black pw-flex pw-flex-col pw-justify-between pw-mt-4">
            <p>{translate('auth>withdrawAdminActions>infoRefuse')}</p>
            <textarea
              onChange={(evt) => setReason(evt.target.value)}
              className="pw-p-[12px_20px] pw-h-[150px] pw-border-[2px] pw-border-[#ccc] pw-border-solid pw-rounded-md pw-bg-[#f8f8f8] pw-text-base pw-resize-none pw-w-full"
            />
          </div>
          <div className="pw-flex pw-justify-center pw-gap-20 pw-mt-8">
            <BaseButton
              className="pw-max-w-[160px] pw-h-[45px] pw-w-full !pw-text-base !pw-py-2"
              variant="outlined"
              onClick={() => setStep(1)}
            >
              {translate('components>cancelMessage>cancel')}
            </BaseButton>
            <BaseButton
              className="pw-max-w-[160px] pw-w-full !pw-text-base !pw-py-2"
              variant="filled"
              disabled={reason === ''}
              onClick={() => {
                if (reason !== '') {
                  refuseWithdraw(
                    { id, reason },
                    {
                      onSuccess() {
                        setStep(6);
                        setSuccess('Pedido de saque recusado com sucesso.');
                        refetch();
                      },
                      onError() {
                        setStep(5);
                        setError('Erro ao recusar o pedido de saque.');
                      },
                    }
                  );
                }
              }}
            >
              {translate('shared>myProfile>confirm')}
            </BaseButton>
          </div>
        </div>
      );
    else if (step === Steps.ESCROW)
      return (
        <div>
          <div className="pw-text-black pw-flex pw-flex-col pw-justify-between pw-mt-4">
            <p>{translate('auth>withdrawAdminActions>holdFounds')}</p>
          </div>
          <div className="pw-flex pw-justify-center pw-gap-20 pw-mt-8">
            <BaseButton
              className="pw-max-w-[160px] pw-h-[45px] pw-w-full !pw-text-base !pw-py-2"
              variant="outlined"
              onClick={() => setStep(1)}
            >
              {translate('components>cancelMessage>cancel')}
            </BaseButton>
            <BaseButton
              className="pw-max-w-[160px] pw-w-full !pw-text-base !pw-py-2"
              variant="filled"
              onClick={() => {
                escrowWithdraw(
                  { id },
                  {
                    onSuccess() {
                      setStep(6);
                      setSuccess(
                        'Recursos retidos com sucesso, aguarde para realizar a transferência.'
                      );
                      refetch();
                    },
                    onError() {
                      setStep(5);
                      setError(
                        'Erro ao reter recursos para o pedido de saque.'
                      );
                    },
                  }
                );
              }}
            >
              {translate('shared>myProfile>confirm')}
            </BaseButton>
          </div>
        </div>
      );
    else if (step === Steps.CONCLUDE)
      return (
        <div>
          <div className="pw-text-black pw-flex pw-flex-col pw-justify-between pw-mt-4">
            <p>{translate('auth>withdrawAdminActions>proofTransfer')}</p>
            <FormProvider {...dynamicMethods}>
              <InputWithdrawCommerce
                name="imageInput"
                onChangeUploadProgess={setUploadingImage}
                textTitle="Enviar comprovante"
              />
            </FormProvider>
          </div>
          <div className="pw-flex pw-justify-center pw-gap-20 pw-mt-4">
            <BaseButton
              className="pw-max-w-[160px] pw-h-[45px] pw-w-full !pw-text-base !pw-py-2"
              variant="outlined"
              onClick={() => {
                setStep(1);
                (dynamicMethods as any).setValue('imageInput', undefined);
              }}
            >
              {translate('components>cancelMessage>cancel')}
            </BaseButton>
            <BaseButton
              className="pw-max-w-[160px] pw-w-full !pw-text-base !pw-py-2"
              variant="filled"
              disabled={!assetId}
              onClick={() => {
                if (assetId) {
                  concludeWithdraw(
                    { id, receiptAssetId: assetId },
                    {
                      onSuccess() {
                        setStep(6);
                        setSuccess('Pedido de saque concluído com sucesso!');
                        refetch();
                      },
                      onError() {
                        setStep(5);
                        setError('Erro ao concluir o pedido de saque.');
                      },
                    }
                  );
                }
              }}
            >
              {translate('shared>myProfile>confirm')}
            </BaseButton>
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

  if (step === Steps.ERROR) {
    return (
      <div className="pw-px-[40px]">
        <button
          className="pw-max-w-[120px] pw-h-[30px] pw-w-full !pw-text-base !pw-py-0 pw-text-black pw-text-start"
          onClick={() => router.push('/withdraws/admin')}
        >
          {`<`} {translate('shared>back')}
        </button>
        <Alert variant="error" className="pw-text-base">
          {error}
        </Alert>
      </div>
    );
  } else if (step === Steps.SUCCESS) {
    return (
      <div className="pw-px-[40px]">
        <button
          className="pw-max-w-[120px] pw-h-[30px] pw-w-full !pw-text-base !pw-py-0 pw-text-black pw-text-start"
          onClick={() => router.push('/withdraws/admin')}
        >
          {`<`} {translate('shared>back')}
        </button>
        <Alert variant="success" className="pw-text-base">
          {success}
        </Alert>
      </div>
    );
  } else
    return (
      <div className="pw-px-[40px]">
        <>
          <button
            className="pw-max-w-[120px] pw-h-[30px] pw-w-full !pw-text-base !pw-py-0 pw-text-black pw-text-start"
            onClick={() => router.push('/withdraws/admin')}
          >
            {`<`} {translate('shared>back')}
          </button>
          {isLoading ||
          isLoadingConclude ||
          isLoadingEscrow ||
          isLoadingRefuse ? (
            <div className="pw-mt-20 pw-w-full pw-flex pw-items-center pw-justify-center">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="pw-text-black pw-flex pw-flex-col pw-justify-between pw-gap-4 pw-mt-4">
                <div>
                  <p className="pw-font-semibold">
                    {translate('token>pass>user')}
                  </p>
                  <p>{data?.data?.user?.name ?? data?.data?.user?.email}</p>
                </div>
                <div>
                  <p className="pw-font-semibold">
                    {translate('auth>withdrawAdminActions>requestMade')}
                  </p>
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
                  <p className="pw-font-semibold">
                    {translate('pass>sharedOrder>value')}
                  </p>
                  <p>
                    {parseFloat(data?.data?.amount).toFixed(2)}{' '}
                    {loyaltyWallet?.[0]?.currency}
                  </p>
                </div>
                <div>
                  <p className="pw-font-semibold">
                    {translate('token>pass>status')}
                  </p>
                  <p>{statusMapping[data?.data?.status as Status]}</p>
                </div>
                {data?.data?.status === 'refused' ? (
                  <div>
                    <p className="pw-font-semibold">
                      {translate('key>kycActionsModal>resons')}:
                    </p>
                    <p>{data?.data?.reason}</p>
                  </div>
                ) : null}
                {data?.data?.receiptAsset?.directLink ? (
                  <div>
                    <a
                      href={data?.data?.receiptAsset?.directLink}
                      target="_blank"
                      rel="noreferrer"
                      className="pw-font-semibold pw-underline"
                    >
                      {translate('auth>withdrawAdminActions>proof')}
                    </a>
                  </div>
                ) : null}
              </div>
              {step === Steps.DEFAULT ? (
                data?.data?.status === 'failed' ||
                data?.data?.status === 'refused' ||
                data?.data?.status === 'concluded' ||
                data?.data?.status === 'escrowing_resources' ? null : (
                  <div className="pw-flex pw-justify-center pw-gap-20 pw-mt-8">
                    {data?.data?.status === 'ready_to_transfer_funds' ? null : (
                      <BaseButton
                        className="pw-max-w-[160px] pw-h-[45px] pw-w-full !pw-text-base !pw-py-2"
                        variant="outlined"
                        onClick={() => setStep(2)}
                      >
                        {translate('auth>withdrawAdminActions>refuse')}
                      </BaseButton>
                    )}
                    <BaseButton
                      className="pw-max-w-[200px] pw-w-full !pw-text-base !pw-py-2"
                      variant="filled"
                      onClick={handleContinue}
                    >
                      {handleText()}
                    </BaseButton>
                  </div>
                )
              ) : (
                concludeAction()
              )}
              {data?.data?.status === 'escrowing_resources' ? (
                <div className="pw-flex pw-justify-center pw-items-center pw-text-black pw-mt-5">
                  <p className="pw-font-semibold">
                    {translate('auth>withdrawAdminActions>pleaseWaitHoldFunds')}
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
