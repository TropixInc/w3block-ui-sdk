/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Withdraw,
  WithdrawAutomationDecision,
  WithdrawAutomationDeclineReason,
  WithdrawFailureStage,
  WithdrawOrigin,
  WithdrawPresentation,
  WithdrawProviderTransfer,
  WithdrawProviderTransferStatus,
  WithdrawStatus,
  WithdrawTimelineEvent,
  WITHDRAW_PROCESSING_STATUSES,
} from '../interfaces';

export type TranslateFn = (path: string, obj?: any) => string;

// Único mapa rótulo/cor de status de saque. Offpix e Connect usam estas
// funções (o Offpix renderiza com o StatusPill dele; o SDK com
// WithdrawStatusBadge).

export const WITHDRAW_STATUS_LABEL_KEYS: Record<WithdrawStatus, string> = {
  [WithdrawStatus.PENDING]: 'withdraws>status>pending',
  [WithdrawStatus.ESCROWING_RESOURCES]: 'withdraws>status>escrowingResources',
  [WithdrawStatus.READY_TO_TRANSFER_FUNDS]: 'withdraws>status>readyToTransfer',
  [WithdrawStatus.TRANSFERRING_FUNDS]: 'withdraws>status>transferringFunds',
  [WithdrawStatus.CONCLUDED]: 'withdraws>status>concluded',
  [WithdrawStatus.FAILED]: 'withdraws>status>failed',
  [WithdrawStatus.REFUSED]: 'withdraws>status>refused',
};

export const WITHDRAW_ORIGIN_LABEL_KEYS: Record<WithdrawOrigin, string> = {
  [WithdrawOrigin.USER]: 'withdraws>origin>user',
  [WithdrawOrigin.ON_BEHALF]: 'withdraws>origin>onBehalf',
  [WithdrawOrigin.AUTOMATIC]: 'withdraws>origin>automatic',
};

export const WITHDRAW_DECLINE_REASON_KEYS: Record<
  WithdrawAutomationDeclineReason,
  string
> = {
  [WithdrawAutomationDeclineReason.TRANSFER_DISABLED]:
    'withdraws>declineReason>transferDisabled',
  [WithdrawAutomationDeclineReason.PROVIDER_NOT_CONFIGURED]:
    'withdraws>declineReason>providerNotConfigured',
  [WithdrawAutomationDeclineReason.CONTRACT_NOT_ENABLED]:
    'withdraws>declineReason>contractNotEnabled',
  [WithdrawAutomationDeclineReason.NOT_MAIN_WALLET]:
    'withdraws>declineReason>notMainWallet',
  [WithdrawAutomationDeclineReason.WITHDRAW_ACCOUNT_NOT_FOUND]:
    'withdraws>declineReason>withdrawAccountNotFound',
  [WithdrawAutomationDeclineReason.UNSUPPORTED_ACCOUNT_TYPE]:
    'withdraws>declineReason>unsupportedAccountType',
  [WithdrawAutomationDeclineReason.UNRESOLVABLE_PIX_KEY]:
    'withdraws>declineReason>unresolvablePixKey',
  [WithdrawAutomationDeclineReason.AMOUNT_ABOVE_LIMIT]:
    'withdraws>declineReason>amountAboveLimit',
};

export const WITHDRAW_TRANSFER_STATUS_KEYS: Record<
  WithdrawProviderTransferStatus,
  string
> = {
  [WithdrawProviderTransferStatus.CREATED]: 'withdraws>transferStatus>created',
  [WithdrawProviderTransferStatus.PENDING_VALIDATION]:
    'withdraws>transferStatus>pendingValidation',
  [WithdrawProviderTransferStatus.READY_TO_PAY]:
    'withdraws>transferStatus>readyToPay',
  [WithdrawProviderTransferStatus.PENDING_CONFIRMATION]:
    'withdraws>transferStatus>pendingConfirmation',
  [WithdrawProviderTransferStatus.PAID]: 'withdraws>transferStatus>paid',
  [WithdrawProviderTransferStatus.REJECTED]:
    'withdraws>transferStatus>rejected',
  [WithdrawProviderTransferStatus.UNKNOWN]: 'withdraws>transferStatus>unknown',
};

export const getWithdrawStatusLabel = (
  status: WithdrawStatus,
  t: TranslateFn
) =>
  WITHDRAW_STATUS_LABEL_KEYS[status]
    ? t(WITHDRAW_STATUS_LABEL_KEYS[status])
    : status;

export const getWithdrawOriginLabel = (
  origin: WithdrawOrigin | undefined,
  t: TranslateFn
) =>
  origin && WITHDRAW_ORIGIN_LABEL_KEYS[origin]
    ? t(WITHDRAW_ORIGIN_LABEL_KEYS[origin])
    : '—';

export const getWithdrawDeclineReasonLabel = (
  reason: WithdrawAutomationDeclineReason | string,
  t: TranslateFn
) => {
  const key =
    WITHDRAW_DECLINE_REASON_KEYS[reason as WithdrawAutomationDeclineReason];
  return key ? t(key) : reason;
};

export const getLastProviderTransfer = (
  withdraw: Pick<Withdraw, 'providerTransfers'>
): WithdrawProviderTransfer | undefined => {
  const list = withdraw.providerTransfers ?? [];
  if (!list.length) return undefined;
  return [...list].sort((a, b) =>
    (a.createdAt ?? '').localeCompare(b.createdAt ?? '')
  )[list.length - 1];
};

export const isWithdrawFinal = (withdraw: Pick<Withdraw, 'status'>) =>
  withdraw.status === WithdrawStatus.CONCLUDED ||
  withdraw.status === WithdrawStatus.REFUSED;

export const isWithdrawProcessing = (withdraw: Pick<Withdraw, 'status'>) =>
  WITHDRAW_PROCESSING_STATUSES.includes(withdraw.status);

/**
 * "Aguardando ação": o admin precisa decidir. Falhou, ou a rodada automática
 * parou o Pix (transferState = declined) e o saque ainda está aberto.
 */
export const isWithdrawAwaitingAction = (
  withdraw: Pick<Withdraw, 'status' | 'automaticTransferState' | 'origin'>
) => {
  if (withdraw.status === WithdrawStatus.FAILED) return true;
  if (isWithdrawFinal(withdraw)) return false;
  if (withdraw.status === WithdrawStatus.TRANSFERRING_FUNDS) return false;
  return (
    withdraw.automaticTransferState === WithdrawAutomationDecision.DECLINED ||
    (withdraw.origin !== WithdrawOrigin.AUTOMATIC &&
      withdraw.status === WithdrawStatus.READY_TO_TRANSFER_FUNDS)
  );
};

const declineDetail = (withdraw: Withdraw, t: TranslateFn) => {
  const reasons = withdraw.automationReasons?.transfer?.reasons ?? [];
  if (reasons.includes(WithdrawAutomationDeclineReason.AMOUNT_ABOVE_LIMIT)) {
    return t('withdraws>statusDetail>pixLimit');
  }
  if (reasons.length) return getWithdrawDeclineReasonLabel(reasons[0], t);
  return undefined;
};

export const getWithdrawStatusPresentation = (
  withdraw: Withdraw,
  t: TranslateFn
): WithdrawPresentation => {
  const label = getWithdrawStatusLabel(withdraw.status, t);
  switch (withdraw.status) {
    case WithdrawStatus.CONCLUDED:
      return { label, color: 'green' };
    case WithdrawStatus.REFUSED:
      return { label, color: 'gray' };
    case WithdrawStatus.FAILED: {
      const transfer = getLastProviderTransfer(withdraw);
      const detail =
        withdraw.failureStage === WithdrawFailureStage.TRANSFER
          ? transfer?.duplicatePaymentSuspected
            ? t('withdraws>statusDetail>duplicateSuspected')
            : t('withdraws>statusDetail>pixRejected')
          : withdraw.failureStage === WithdrawFailureStage.ESCROW
          ? t('withdraws>statusDetail>escrowFailed')
          : undefined;
      return { label, detail, color: 'red' };
    }
    case WithdrawStatus.TRANSFERRING_FUNDS:
      return { label, color: 'blue' };
    default: {
      if (isWithdrawAwaitingAction(withdraw)) {
        return {
          label: t('withdraws>status>awaitingAction'),
          detail: declineDetail(withdraw, t),
          color: 'amber',
        };
      }
      return {
        label,
        color: withdraw.status === WithdrawStatus.PENDING ? 'amber' : 'blue',
      };
    }
  }
};

export type WithdrawPaymentKind =
  | 'automaticPix'
  | 'manualReceipt'
  | 'pixRejected'
  | 'pixInProgress'
  | 'blocked'
  | 'none';

export const getWithdrawPaymentKind = (
  withdraw: Withdraw
): WithdrawPaymentKind => {
  const transfer = getLastProviderTransfer(withdraw);
  if (transfer) {
    if (transfer.status === WithdrawProviderTransferStatus.PAID)
      return 'automaticPix';
    if (transfer.status === WithdrawProviderTransferStatus.REJECTED)
      return 'pixRejected';
    if (withdraw.status === WithdrawStatus.CONCLUDED) return 'automaticPix';
    return 'pixInProgress';
  }
  if (withdraw.status === WithdrawStatus.CONCLUDED) {
    return withdraw.receiptAssetId ? 'manualReceipt' : 'automaticPix';
  }
  if (withdraw.automaticTransferState === WithdrawAutomationDecision.DECLINED) {
    return 'blocked';
  }
  if (withdraw.automaticTransferState === WithdrawAutomationDecision.APPROVED) {
    return 'automaticPix';
  }
  return 'none';
};

export const getWithdrawPaymentPresentation = (
  withdraw: Withdraw,
  t: TranslateFn
): WithdrawPresentation | null => {
  switch (getWithdrawPaymentKind(withdraw)) {
    case 'automaticPix':
      return { label: t('withdraws>payment>automaticPix'), color: 'blue' };
    case 'manualReceipt':
      return { label: t('withdraws>payment>manualReceipt'), color: 'gray' };
    case 'pixRejected':
      return { label: t('withdraws>payment>pixRejected'), color: 'red' };
    case 'pixInProgress':
      return { label: t('withdraws>payment>pixInProgress'), color: 'blue' };
    case 'blocked':
      return {
        label: t('withdraws>payment>blocked'),
        detail: declineDetail(withdraw, t),
        color: 'amber',
      };
    default:
      return null;
  }
};

/** Ações possíveis para o admin, dado o estado do saque. */
export const getWithdrawAdminActions = (withdraw: Withdraw) => {
  const transfer = getLastProviderTransfer(withdraw);
  const open = !isWithdrawFinal(withdraw);
  const transferFailed =
    withdraw.status === WithdrawStatus.FAILED &&
    withdraw.failureStage === WithdrawFailureStage.TRANSFER;
  return {
    canEscrow: withdraw.status === WithdrawStatus.PENDING,
    canRefuse:
      open &&
      withdraw.status !== WithdrawStatus.TRANSFERRING_FUNDS &&
      withdraw.status !== WithdrawStatus.ESCROWING_RESOURCES,
    canConcludeWithReceipt:
      open &&
      (withdraw.status === WithdrawStatus.READY_TO_TRANSFER_FUNDS ||
        transferFailed),
    canPayViaPix:
      open &&
      (withdraw.status === WithdrawStatus.READY_TO_TRANSFER_FUNDS ||
        transferFailed),
    canConfirmProviderTransfer: transferFailed && Boolean(transfer),
    canReconcile:
      Boolean(transfer) &&
      (withdraw.status === WithdrawStatus.TRANSFERRING_FUNDS || transferFailed),
  };
};

/**
 * Linha do tempo montada só com o que a API já devolve (api-faltante §6).
 * `refusedAt` não existe: usa `updatedAt` quando o status é `refused`.
 */
export const buildWithdrawTimeline = (
  withdraw: Withdraw,
  t: TranslateFn
): WithdrawTimelineEvent[] => {
  const events: WithdrawTimelineEvent[] = [];
  const transfer = getLastProviderTransfer(withdraw);
  const flow = withdraw.automationReasons?.flow;
  const transferEval = withdraw.automationReasons?.transfer;
  const isAutomatic = withdraw.origin === WithdrawOrigin.AUTOMATIC;

  events.push({
    key: 'created',
    title: isAutomatic
      ? t('withdraws>timeline>createdAutomatic')
      : withdraw.origin === WithdrawOrigin.ON_BEHALF
      ? t('withdraws>timeline>createdOnBehalf')
      : t('withdraws>timeline>createdByUser'),
    detail:
      withdraw.ordersCount !== undefined && withdraw.ordersCount > 0
        ? t('withdraws>timeline>ordersSummed', {
            count: withdraw.ordersCount,
            amount: withdraw.amount,
          })
        : undefined,
    at: withdraw.createdAt,
    state: 'done',
  });

  if (withdraw.status === WithdrawStatus.REFUSED) {
    events.push({
      key: 'refused',
      title: t('withdraws>timeline>refused'),
      detail: withdraw.reason || undefined,
      at: withdraw.updatedAt,
      state: 'failed',
    });
    return events;
  }

  const escrowDone =
    Boolean(withdraw.escrowActionId) &&
    withdraw.status !== WithdrawStatus.PENDING &&
    withdraw.status !== WithdrawStatus.ESCROWING_RESOURCES &&
    !(
      withdraw.status === WithdrawStatus.FAILED &&
      withdraw.failureStage === WithdrawFailureStage.ESCROW
    );
  const escrowFailed =
    withdraw.status === WithdrawStatus.FAILED &&
    withdraw.failureStage === WithdrawFailureStage.ESCROW;
  events.push({
    key: 'escrow',
    title: t('withdraws>timeline>escrow'),
    detail: escrowFailed
      ? t('withdraws>timeline>escrowFailed')
      : escrowDone
      ? t('withdraws>timeline>escrowConfirmed')
      : withdraw.status === WithdrawStatus.ESCROWING_RESOURCES
      ? t('withdraws>timeline>escrowInProgress')
      : undefined,
    at:
      escrowDone || escrowFailed
        ? flow?.evaluatedAt ?? withdraw.updatedAt
        : null,
    state: escrowFailed ? 'failed' : escrowDone ? 'done' : 'pending',
  });
  if (escrowFailed) return events;

  if (isAutomatic || transferEval) {
    const declined =
      transferEval?.decision === WithdrawAutomationDecision.DECLINED;
    events.push({
      key: 'automation',
      title: declined
        ? t('withdraws>timeline>pixBlocked')
        : t('withdraws>timeline>pixApproved'),
      detail: declined
        ? [
            transferEval?.reasons
              ?.map((r) => getWithdrawDeclineReasonLabel(r, t))
              .join(', '),
            transferEval?.cap
              ? t('withdraws>timeline>capDetail', {
                  amount: withdraw.amount,
                  cap: transferEval.cap,
                })
              : undefined,
            isWithdrawFinal(withdraw)
              ? undefined
              : t('withdraws>timeline>awaitingApproval'),
          ]
            .filter(Boolean)
            .join(' · ')
        : transferEval?.cap
        ? t('withdraws>timeline>withinCap', { cap: transferEval.cap })
        : undefined,
      at: transferEval?.evaluatedAt ?? null,
      state: transferEval ? (declined ? 'blocked' : 'done') : 'pending',
    });
  }

  const paid =
    withdraw.status === WithdrawStatus.CONCLUDED ||
    transfer?.status === WithdrawProviderTransferStatus.PAID;
  const pixRejected =
    transfer?.status === WithdrawProviderTransferStatus.REJECTED;
  events.push({
    key: 'payment',
    title: t('withdraws>timeline>payment'),
    detail: pixRejected
      ? [t('withdraws>timeline>pixRejected'), transfer?.rejectReason]
          .filter(Boolean)
          .join(' · ')
      : paid
      ? transfer
        ? t('withdraws>timeline>paidByPix', {
            endToEndId: transfer.endToEndId ?? '',
          })
        : withdraw.receiptAssetId
        ? t('withdraws>timeline>paidWithReceipt')
        : t('withdraws>timeline>paid')
      : transfer
      ? t(
          WITHDRAW_TRANSFER_STATUS_KEYS[transfer.status] ??
            'withdraws>transferStatus>unknown'
        )
      : t('withdraws>timeline>paymentPending'),
    at: pixRejected
      ? transfer?.updatedAt
      : paid
      ? transfer?.transactionDate ?? withdraw.concludedAt
      : null,
    state: pixRejected ? 'failed' : paid ? 'done' : 'pending',
  });

  // Evento "saque pago" para o Commerce: ainda não existe na API (§7).
  events.push({
    key: 'commerce',
    title: t('withdraws>timeline>commerceEvent'),
    detail:
      withdraw.ordersCount !== undefined
        ? t('withdraws>timeline>commerceEventDetail', {
            count: withdraw.ordersCount,
          })
        : undefined,
    at: null,
    state: 'pending',
  });

  return events;
};
