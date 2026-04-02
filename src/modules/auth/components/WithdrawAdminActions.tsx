/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { DocumentDto } from '@w3block/sdk-id';
import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';

import ChevronLeft from '../../shared/assets/icons/chevronLeftFilled.svg';
import { Alert } from '../../shared/components/Alert';
import { BaseButton } from '../../shared/components/Buttons';
import { Spinner } from '../../shared/components/Spinner';
import { useLocale } from '../../shared/hooks/useLocale';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import useTranslation from '../../shared/hooks/useTranslation';
import {
  useGetSpecificWithdrawAdmin,
  useRefuseWithdraw,
  useConcludeWithdraw,
  useEscrowWithdraw,
} from '../hooks/useRequestWithdraw';
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

const statusStyleMap: Record<Status, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pendente', bg: 'pw-bg-yellow-100', text: 'pw-text-yellow-800' },
  escrowing_resources: { label: 'Retendo fundos', bg: 'pw-bg-blue-100', text: 'pw-text-blue-800' },
  ready_to_transfer_funds: { label: 'Pronto para transferir', bg: 'pw-bg-indigo-100', text: 'pw-text-indigo-800' },
  concluded: { label: 'Concluído', bg: 'pw-bg-green-100', text: 'pw-text-green-800' },
  failed: { label: 'Falha', bg: 'pw-bg-red-100', text: 'pw-text-red-800' },
  refused: { label: 'Recusado', bg: 'pw-bg-red-100', text: 'pw-text-red-800' },
};

const StatusBadge = ({ status }: { status: Status }) => {
  const style = statusStyleMap[status] ?? statusStyleMap.pending;
  return (
    <span className={`pw-inline-flex pw-items-center pw-px-3 pw-py-1 pw-rounded-full pw-text-xs pw-font-medium ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
};

const BackButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button
    className="pw-flex pw-items-center pw-gap-1 pw-text-sm pw-text-[#555] hover:pw-text-black pw-mb-4 pw-transition-colors"
    onClick={onClick}
  >
    <ChevronLeft className="pw-w-4 pw-h-4 pw-fill-current" /> {label}
  </button>
);

const DetailField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="pw-flex pw-flex-col pw-gap-1">
    <p className="pw-text-xs pw-font-semibold pw-text-[#777] pw-uppercase pw-tracking-wide">
      {label}
    </p>
    <div className="pw-text-sm pw-text-black">{children}</div>
  </div>
);

const WithdrawAdminActions = ({ id }: { id: string }) => {
  const router = useRouterConnect();
  const locale = useLocale();
  const [translate] = useTranslation();
  const [step, setStep] = useState<Steps>(1);
  const [reason, setReason] = useState('');
  const [_, setUploadingImage] = useState(false);
  const { data, isFetching, refetch } = useGetSpecificWithdrawAdmin(id);
  const { mutate: refuseWithdraw, isPending: isLoadingRefuse } =
    useRefuseWithdraw();
  const { mutate: concludeWithdraw, isPending: isLoadingConclude } =
    useConcludeWithdraw();
  const { mutate: escrowWithdraw, isPending: isLoadingEscrow } =
    useEscrowWithdraw();
  const dynamicMethods = useForm<DocumentDto>({
    shouldUnregister: false,
    mode: 'onChange',
  });
  const assetId = (dynamicMethods.getValues() as any)?.imageInput?.assetId;
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const goBack = () => router.push('/withdraws/admin');

  const concludeAction = () => {
    if (step === Steps.REFUSE)
      return (
        <div className="pw-mt-6 pw-border-t pw-border-[#eee] pw-pt-6">
          <div className="pw-text-black pw-flex pw-flex-col pw-gap-3">
            <p className="pw-text-sm pw-font-medium">{translate('auth>withdrawAdminActions>infoRefuse')}</p>
            <textarea
              onChange={(evt) => setReason(evt.target.value)}
              className="pw-p-3 pw-h-[120px] pw-border pw-border-[#ddd] pw-rounded-lg pw-bg-[#fafafa] pw-text-sm pw-resize-none pw-w-full focus:pw-border-[#0050FF] focus:pw-outline-none pw-transition-colors"
              placeholder={translate('auth>withdrawAdminActions>infoRefuse')}
            />
          </div>
          <div className="pw-flex pw-justify-end pw-gap-3 pw-mt-6">
            <BaseButton variant="outlined" onClick={() => setStep(1)}>
              {translate('components>cancelMessage>cancel')}
            </BaseButton>
            <BaseButton
              disabled={reason === ''}
              onClick={() => {
                if (reason !== '') {
                  refuseWithdraw(
                    { id, reason },
                    {
                      onSuccess() {
                        setStep(6);
                        setSuccess(translate('auth>withdrawAdminActions>refuseSuccess'));
                        refetch();
                      },
                      onError() {
                        setStep(5);
                        setError(translate('auth>withdrawAdminActions>refuseError'));
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
        <div className="pw-mt-6 pw-border-t pw-border-[#eee] pw-pt-6">
          <div className="pw-text-black">
            <p className="pw-text-sm pw-font-medium">{translate('auth>withdrawAdminActions>holdFounds')}</p>
          </div>
          <div className="pw-flex pw-justify-end pw-gap-3 pw-mt-6">
            <BaseButton variant="outlined" onClick={() => setStep(1)}>
              {translate('components>cancelMessage>cancel')}
            </BaseButton>
            <BaseButton
              onClick={() => {
                escrowWithdraw(
                  { id },
                  {
                    onSuccess() {
                      setStep(6);
                      setSuccess(translate('auth>withdrawAdminActions>escrowSuccess'));
                      refetch();
                    },
                    onError() {
                      setStep(5);
                      setError(translate('auth>withdrawAdminActions>escrowError'));
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
        <div className="pw-mt-6 pw-border-t pw-border-[#eee] pw-pt-6">
          <div className="pw-text-black pw-flex pw-flex-col pw-gap-3">
            <p className="pw-text-sm pw-font-medium">{translate('auth>withdrawAdminActions>proofTransfer')}</p>
            <FormProvider {...dynamicMethods}>
              <InputWithdrawCommerce
                name="imageInput"
                onChangeUploadProgess={setUploadingImage}
                textTitle={translate('auth>withdrawAdminActions>sendReceipt')}
              />
            </FormProvider>
          </div>
          <div className="pw-flex pw-justify-end pw-gap-3 pw-mt-4">
            <BaseButton
              variant="outlined"
              onClick={() => {
                setStep(1);
                (dynamicMethods as any).setValue('imageInput', undefined);
              }}
            >
              {translate('components>cancelMessage>cancel')}
            </BaseButton>
            <BaseButton
              variant="filled"
              disabled={!assetId}
              onClick={() => {
                if (assetId) {
                  concludeWithdraw(
                    { id, receiptAssetId: assetId },
                    {
                      onSuccess() {
                        setStep(6);
                        setSuccess(translate('auth>withdrawAdminActions>concludeSuccess'));
                        refetch();
                      },
                      onError() {
                        setStep(5);
                        setError(translate('auth>withdrawAdminActions>concludeError'));
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
    return null;
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
      return translate('withdraw>actions>withholdFunds');
    }
    if (data?.data?.status === 'ready_to_transfer_funds') {
      return translate('withdraw>actions>concludeTransfer');
    }
  };

  const isTerminalStatus =
    data?.data?.status === 'failed' ||
    data?.data?.status === 'refused' ||
    data?.data?.status === 'concluded' ||
    data?.data?.status === 'escrowing_resources';

  if (step === Steps.ERROR) {
    return (
      <div>
        <BackButton onClick={goBack} label={translate('shared>back')} />
        <Alert variant="error" className="pw-text-sm">
          {error}
        </Alert>
      </div>
    );
  }

  if (step === Steps.SUCCESS) {
    return (
      <div>
        <BackButton onClick={goBack} label={translate('shared>back')} />
        <Alert variant="success" className="pw-text-sm">
          {success}
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <BackButton onClick={goBack} label={translate('shared>back')} />
      {isFetching ||
      isLoadingConclude ||
      isLoadingEscrow ||
      isLoadingRefuse ? (
        <div className="pw-mt-20 pw-w-full pw-flex pw-items-center pw-justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="pw-grid pw-grid-cols-1 sm:pw-grid-cols-2 pw-gap-5 pw-mt-2">
            <DetailField label={translate('token>pass>user')}>
              <p>{data?.data?.user?.name ?? data?.data?.user?.email}</p>
              {data?.data?.user?.name && data?.data?.user?.email ? (
                <p className="pw-text-xs pw-text-[#999]">{data?.data?.user?.email}</p>
              ) : null}
            </DetailField>
            <DetailField label={translate('auth>withdrawAdminActions>requestMade')}>
              <p>
                {format(
                  new Date(data?.data?.createdAt ?? Date.now()),
                  'PPpp',
                  { locale: locale === 'pt-BR' ? ptBR : enUS }
                )}
              </p>
            </DetailField>
            <DetailField label={translate('pass>sharedOrder>value')}>
              <p className="pw-text-base pw-font-semibold">
                {parseFloat(data?.data?.amount).toFixed(2)}{' '}
                {data?.data?.currency ?? ''}
              </p>
            </DetailField>
            <DetailField label={translate('token>pass>status')}>
              <StatusBadge status={data?.data?.status as Status} />
            </DetailField>
            {data?.data?.status === 'refused' && data?.data?.reason ? (
              <div className="sm:pw-col-span-2">
                <DetailField label={translate('key>kycActionsModal>resons')}>
                  <p className="pw-text-red-600">{data?.data?.reason}</p>
                </DetailField>
              </div>
            ) : null}
            {data?.data?.receiptAsset?.directLink ? (
              <div className="sm:pw-col-span-2">
                <DetailField label={translate('auth>withdrawAdminActions>proof')}>
                  <a
                    href={data?.data?.receiptAsset?.directLink}
                    target="_blank"
                    rel="noreferrer"
                    className="pw-text-[#0050FF] pw-underline hover:pw-text-[#0034A3] pw-transition-colors"
                  >
                    {translate('auth>withdrawAdminActions>viewReceipt')}
                  </a>
                </DetailField>
              </div>
            ) : null}
          </div>

          {step === Steps.DEFAULT ? (
            isTerminalStatus ? null : (
              <div className="pw-flex pw-justify-end pw-gap-3 pw-mt-8 pw-border-t pw-border-[#eee] pw-pt-6">
                <BaseButton variant="outlined" onClick={() => setStep(2)}>
                  {translate('auth>withdrawAdminActions>refuse')}
                </BaseButton>
                <BaseButton onClick={handleContinue}>
                  {handleText()}
                </BaseButton>
              </div>
            )
          ) : (
            concludeAction()
          )}

          {data?.data?.status === 'escrowing_resources' ? (
            <div className="pw-flex pw-justify-center pw-items-center pw-text-black pw-mt-6 pw-p-4 pw-bg-blue-50 pw-rounded-lg">
              <p className="pw-text-sm pw-font-medium pw-text-blue-700">
                {translate('auth>withdrawAdminActions>pleaseWaitHoldFunds')}
              </p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default WithdrawAdminActions;
