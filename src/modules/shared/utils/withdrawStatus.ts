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

/** i18n key of the user-facing label (the three in-progress states read "Pendente"). */
export const withdrawStatusLabelKey = (status?: string) => {
  switch (status) {
    case 'concluded':
      return 'auth>withdrawStatus>concluded';
    case 'failed':
      return 'auth>withdrawStatus>failed';
    case 'refused':
      return 'auth>withdrawStatus>refused';
    default:
      return 'auth>withdrawStatus>pending';
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
