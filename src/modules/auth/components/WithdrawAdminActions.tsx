/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { DocumentDto } from '@w3block/sdk-id';
import classNames from 'classnames';
import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';

import { Alert } from '../../shared/components/Alert';
import { BaseButton } from '../../shared/components/Buttons';
import Skeleton from '../../shared/components/Skeleton';
import { DefinitionList } from '../../shared/components/ui/DefinitionList';
import { StatusPill } from '../../shared/components/ui/StatusPill';
import { TONE_CLASSES, UI } from '../../shared/components/ui/tokens';
import { useLocale } from '../../shared/hooks/useLocale';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import useTranslation from '../../shared/hooks/useTranslation';
import { useUserWallet } from '../../shared/hooks/useUserWallet/useUserWallet';
import { formatAmount } from '../../shared/utils/formatAmount';
import {
  WithdrawStatus,
  withdrawStatusLabelKey,
  withdrawStatusTone,
} from '../../shared/utils/withdrawStatus';
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

const BackButton = ({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) => (
  <button
    type="button"
    className="pw-inline-flex pw-items-center pw-gap-1 pw-text-[12.5px] pw-font-medium pw-text-[#4A5567] hover:pw-text-[#0F1729]"
    onClick={onClick}
  >
    <span aria-hidden>‹</span> {label}
  </button>
);

const Hint = ({
  tone,
  children,
}: {
  tone: 'warn' | 'bad' | 'info';
  children: React.ReactNode;
}) => (
  <div
    className={classNames(
      'pw-rounded-lg pw-px-3 pw-py-2.5 pw-text-[12.5px]',
      TONE_CLASSES[tone]
    )}
  >
    {children}
  </div>
);

/** Panel under the detail with the confirmation of one admin action. */
const ActionPanel = ({
  title,
  children,
  onCancel,
  onConfirm,
  confirmDisabled,
  cancelLabel,
  confirmLabel,
}: {
  title: string;
  children?: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  cancelLabel: string;
  confirmLabel: string;
}) => (
  <div
    className={classNames(
      'pw-border-t pw-pt-4 pw-flex pw-flex-col pw-gap-3',
      UI.line
    )}
  >
    <p
      className={classNames('pw-text-[13.5px] pw-font-medium pw-m-0', UI.text)}
    >
      {title}
    </p>
    {children}
    <div className="pw-flex pw-flex-wrap pw-justify-end pw-gap-2">
      <BaseButton variant="outlined" onClick={onCancel}>
        {cancelLabel}
      </BaseButton>
      <BaseButton disabled={confirmDisabled} onClick={onConfirm}>
        {confirmLabel}
      </BaseButton>
    </div>
  </div>
);

const WithdrawAdminActions = ({ id }: { id: string }) => {
  const router = useRouterConnect();
  const locale = useLocale();
  const [translate] = useTranslation();
  const { loyaltyWallet } = useUserWallet();
  const precision = loyaltyWallet?.[0]?.pointsPrecision;
  const fallbackCurrency = loyaltyWallet?.[0]?.currency ?? '';

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

  const withdraw = data?.data ?? {};
  const status = withdraw.status as WithdrawStatus | undefined;
  const dateLocale = locale === 'pt-BR' ? ptBR : enUS;
  const amount = `${formatAmount(withdraw.amount, locale, precision)} ${
    withdraw.currency ?? fallbackCurrency
  }`.trim();
  const cancelLabel = translate('components>cancelMessage>cancel');
  const confirmLabel = translate('shared>myProfile>confirm');

  const goBack = () => router.push('/withdraws/admin');

  const concludeAction = () => {
    if (step === Steps.REFUSE)
      return (
        <ActionPanel
          title={translate('auth>withdrawAdminActions>infoRefuse')}
          onCancel={() => setStep(1)}
          confirmDisabled={reason === ''}
          cancelLabel={cancelLabel}
          confirmLabel={confirmLabel}
          onConfirm={() => {
            if (reason !== '') {
              refuseWithdraw(
                { id, reason },
                {
                  onSuccess() {
                    setStep(6);
                    setSuccess(
                      translate('auth>withdrawAdminActions>refuseSuccess')
                    );
                    refetch();
                  },
                  onError() {
                    setStep(5);
                    setError(
                      translate('auth>withdrawAdminActions>refuseError')
                    );
                  },
                }
              );
            }
          }}
        >
          <textarea
            onChange={(evt) => setReason(evt.target.value)}
            className={classNames(
              'pw-p-3 pw-h-[110px] pw-border pw-rounded-lg pw-bg-white pw-text-[13px] pw-resize-none pw-w-full',
              UI.line,
              UI.focusRing
            )}
            placeholder={translate('withdraws>actions>refuseReason')}
          />
        </ActionPanel>
      );
    else if (step === Steps.ESCROW)
      return (
        <ActionPanel
          title={translate('auth>withdrawAdminActions>holdFounds')}
          onCancel={() => setStep(1)}
          cancelLabel={cancelLabel}
          confirmLabel={confirmLabel}
          onConfirm={() => {
            escrowWithdraw(
              { id },
              {
                onSuccess() {
                  setStep(6);
                  setSuccess(
                    translate('auth>withdrawAdminActions>escrowSuccess')
                  );
                  refetch();
                },
                onError() {
                  setStep(5);
                  setError(translate('auth>withdrawAdminActions>escrowError'));
                },
              }
            );
          }}
        />
      );
    else if (step === Steps.CONCLUDE)
      return (
        <ActionPanel
          title={translate('auth>withdrawAdminActions>proofTransfer')}
          onCancel={() => {
            setStep(1);
            (dynamicMethods as any).setValue('imageInput', undefined);
          }}
          confirmDisabled={!assetId}
          cancelLabel={cancelLabel}
          confirmLabel={confirmLabel}
          onConfirm={() => {
            if (assetId) {
              concludeWithdraw(
                { id, receiptAssetId: assetId },
                {
                  onSuccess() {
                    setStep(6);
                    setSuccess(
                      translate('auth>withdrawAdminActions>concludeSuccess')
                    );
                    refetch();
                  },
                  onError() {
                    setStep(5);
                    setError(
                      translate('auth>withdrawAdminActions>concludeError')
                    );
                  },
                }
              );
            }
          }}
        >
          <FormProvider {...dynamicMethods}>
            <InputWithdrawCommerce
              name="imageInput"
              onChangeUploadProgess={setUploadingImage}
              textTitle={translate('auth>withdrawAdminActions>sendReceipt')}
            />
          </FormProvider>
        </ActionPanel>
      );
    return null;
  };

  const handleContinue = () => {
    if (status === 'pending') setStep(3);
    if (status === 'ready_to_transfer_funds') setStep(4);
  };

  const primaryActionLabel =
    status === 'pending'
      ? translate('withdraw>actions>withholdFunds')
      : status === 'ready_to_transfer_funds'
      ? translate('withdraw>actions>concludeTransfer')
      : undefined;

  const nextStepHint =
    status === 'pending'
      ? translate('auth>withdrawsAdmin>nextStepHold')
      : status === 'ready_to_transfer_funds'
      ? translate('auth>withdrawsAdmin>nextStepConclude')
      : status === 'escrowing_resources' || status === 'transferring_funds'
      ? translate('auth>withdrawAdminActions>pleaseWaitHoldFunds')
      : undefined;

  const isTerminalStatus =
    status === 'failed' ||
    status === 'refused' ||
    status === 'concluded' ||
    status === 'escrowing_resources' ||
    status === 'transferring_funds';

  if (step === Steps.ERROR || step === Steps.SUCCESS) {
    return (
      <div className="pw-flex pw-flex-col pw-gap-4">
        <BackButton onClick={goBack} label={translate('shared>back')} />
        <Alert
          variant={step === Steps.ERROR ? 'error' : 'success'}
          className="pw-text-sm"
        >
          {step === Steps.ERROR ? error : success}
        </Alert>
      </div>
    );
  }

  const busy =
    (isFetching && !data) ||
    isLoadingConclude ||
    isLoadingEscrow ||
    isLoadingRefuse;

  const items = [
    {
      term: translate('token>pass>user'),
      value: (
        <span className="pw-grid">
          <span>{withdraw.user?.name ?? withdraw.user?.email ?? '—'}</span>
          {withdraw.user?.name && withdraw.user?.email ? (
            <span
              className={classNames(
                'pw-text-[11.5px] pw-font-normal',
                UI.textMuted
              )}
            >
              {withdraw.user.email}
            </span>
          ) : null}
        </span>
      ),
    },
    {
      term: translate('auth>withdrawAdminActions>requestMade'),
      value: withdraw.createdAt
        ? format(new Date(withdraw.createdAt), 'PPpp', { locale: dateLocale })
        : '—',
    },
    { term: translate('pass>sharedOrder>value'), value: amount },
    {
      term: translate('token>pass>status'),
      value: (
        <StatusPill tone={withdrawStatusTone(status)}>
          {translate(withdrawStatusLabelKey(status, 'admin'))}
        </StatusPill>
      ),
    },
    ...(status === 'refused' && withdraw.reason
      ? [
          {
            term: translate('withdraws>actions>refuseReason'),
            value: <span className="pw-text-[#C92A2D]">{withdraw.reason}</span>,
            wide: true,
          },
        ]
      : []),
    {
      term: translate('auth>withdrawAdminActions>proof'),
      value: withdraw.receiptAsset?.directLink ? (
        <a
          href={withdraw.receiptAsset.directLink}
          target="_blank"
          rel="noreferrer"
          className={UI.link}
        >
          {translate('auth>withdrawAdminActions>viewReceipt')}
        </a>
      ) : (
        translate('auth>withdraws>receiptWhenConcluded')
      ),
      muted: !withdraw.receiptAsset?.directLink,
    },
  ];

  return (
    <div className="pw-flex pw-flex-col pw-gap-4">
      <div className="pw-flex pw-flex-wrap pw-items-center pw-justify-between pw-gap-2">
        <BackButton onClick={goBack} label={translate('shared>back')} />
        {step === Steps.DEFAULT && !isTerminalStatus && !busy ? (
          <div className="pw-flex pw-flex-wrap pw-gap-2">
            <BaseButton variant="outlined" onClick={() => setStep(2)}>
              {translate('auth>withdrawAdminActions>refuse')}
            </BaseButton>
            {primaryActionLabel ? (
              <BaseButton onClick={handleContinue}>
                {primaryActionLabel}
              </BaseButton>
            ) : null}
          </div>
        ) : null}
      </div>

      {busy ? (
        <div className="pw-grid pw-gap-3">
          <Skeleton className="pw-h-5 pw-w-1/3 pw-rounded" />
          <Skeleton className="pw-h-4 pw-w-1/2 pw-rounded" />
          <Skeleton className="pw-h-4 pw-w-1/4 pw-rounded" />
        </div>
      ) : (
        <>
          <h2
            className={classNames(
              'pw-text-[18px] pw-font-semibold pw-m-0',
              UI.text
            )}
          >
            {translate('auth>withdraws>detailTitle', { amount })}
          </h2>
          <DefinitionList items={items} />
          {nextStepHint ? (
            <Hint
              tone={
                status === 'pending' || status === 'ready_to_transfer_funds'
                  ? 'info'
                  : 'warn'
              }
            >
              {nextStepHint}
            </Hint>
          ) : null}
          {status === 'failed' ? (
            <Hint tone="bad">
              {translate('auth>withdrawsAdmin>failedHint')}
            </Hint>
          ) : null}
          {step !== Steps.DEFAULT ? concludeAction() : null}
        </>
      )}
    </div>
  );
};

export default WithdrawAdminActions;
