import { Tone } from '../components/ui/tokens';

export type WithdrawStatus =
  | 'pending'
  | 'escrowing_resources'
  | 'ready_to_transfer_funds'
  | 'transferring_funds'
  | 'concluded'
  | 'failed'
  | 'refused';

/** Statuses that still move: the money is reserved or waiting for the transfer. */
export const WITHDRAW_IN_PROGRESS_STATUSES: readonly WithdrawStatus[] = [
  'pending',
  'escrowing_resources',
  'ready_to_transfer_funds',
  'transferring_funds',
];

export const isWithdrawInProgress = (status?: string) =>
  WITHDRAW_IN_PROGRESS_STATUSES.includes(status as WithdrawStatus);

/** Statuses waiting for an admin action (hold funds / conclude the transfer). */
export const WITHDRAW_NEEDS_ACTION_STATUSES: readonly WithdrawStatus[] = [
  'pending',
  'ready_to_transfer_funds',
];

export const isWithdrawAwaitingAction = (status?: string) =>
  WITHDRAW_NEEDS_ACTION_STATUSES.includes(status as WithdrawStatus);

export const withdrawStatusTone = (status?: string): Tone => {
  switch (status) {
    case 'concluded':
      return 'ok';
    case 'failed':
    case 'refused':
      return 'bad';
    case 'pending':
    case 'escrowing_resources':
    case 'ready_to_transfer_funds':
    case 'transferring_funds':
      return 'warn';
    default:
      return 'grey';
  }
};

/**
 * i18n key of the status label. For the user every in-progress state reads
 * "Em processamento"; the admin sees each step, with `pending` as
 * "Aguardando ação" because it is waiting for them.
 */
export const withdrawStatusLabelKey = (
  status?: string,
  audience: 'user' | 'admin' = 'user'
) => {
  switch (status) {
    case 'concluded':
      return 'auth>withdrawStatus>concluded';
    case 'failed':
      return 'auth>withdrawStatus>failed';
    case 'refused':
      return 'auth>withdrawStatus>refused';
    case 'pending':
      return audience === 'admin'
        ? 'auth>withdrawStatus>awaitingAction'
        : 'auth>withdrawStatus>inProgress';
    case 'escrowing_resources':
      return audience === 'admin'
        ? 'auth>withdrawStatus>escrowingResources'
        : 'auth>withdrawStatus>inProgress';
    case 'ready_to_transfer_funds':
      return audience === 'admin'
        ? 'auth>withdrawStatus>awaitingAction'
        : 'auth>withdrawStatus>inProgress';
    case 'transferring_funds':
      return audience === 'admin'
        ? 'auth>withdrawStatus>transferringFunds'
        : 'auth>withdrawStatus>inProgress';
    default:
      return 'auth>withdrawStatus>inProgress';
  }
};

/** Sums `amount` strings, ignoring anything that is not a finite number. */
export const sumAmounts = (
  items: ReadonlyArray<{ amount?: string | number | null }>
) =>
  items.reduce((total, item) => {
    const n = Number(item?.amount);
    return Number.isFinite(n) ? total + n : total;
  }, 0);
