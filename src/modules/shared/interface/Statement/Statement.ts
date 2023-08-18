import { LoyaltiesTransaction } from '../../../dashboard/interface/ercTokenHistoryInterface';

export interface Statement {
  id: string;
  type: Erc20ActionType;
  amount: number;
  description: string;
  createdAt: Date;
  status: Erc20ActionStatus;
  loyaltieTransactions: LoyaltiesTransaction[];
  currency: string;
  transactionType: 'receiving' | 'sending';
}

export enum Erc20ActionType {
  TRANSFER = 'transfer',
  BURN = 'burn',
  MINTER = 'minter',
}

export enum Erc20ActionStatus {
  CREATED = 'created',
  STARTED = 'started',
  SUCCESS = 'success',
  FAILED = 'failed',
  WAIT_EVENT = 'wait_event',
}
