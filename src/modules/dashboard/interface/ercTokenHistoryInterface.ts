import {
  Erc20ActionStatus,
  Erc20ActionType,
} from '../../shared/interface/Statement/Statement';

export interface ErcTokenHistoryInterfaceResponse {
  items: Erc20TokenHistory[];
  meta: Meta;
}

export interface Meta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface Erc20TokenHistory {
  id: string;
  createdAt: string;
  updatedAt: string;
  contractId: string;
  companyId: string;
  type: Erc20ActionType;
  status: Erc20ActionStatus;
  contractAddress: string;
  chainId: number;
  sender: string;
  txHash: string;
  txId: string;
  metadata: Metadata;
  request: Request;
  executeAt: string;
  loyaltiesTransactions: LoyaltiesTransaction[];
  to?: FromToInterface;
  from?: FromToInterface;
}

export interface FromToInterface {
  id?: string;
  phone?: string;
  type?: string;
  user_name?: string;
  wallet?: string;
  cpf?: string;
  email?: string;
}
export interface Metadata {
  confirmedAt: string;
  transaction: Transaction;
}

export interface Transaction {
  id: string;
  from: string;
  hash: string;
  nonce: any;
  checks: number;
  status: string;
  reasons: any;
  clientId: string;
  expiredAt: any;
  lastCheck: string;
  confirmations: number;
  receiptStatus: string;
}

export interface Request {
  to: string;
  amount: string;
  from?: string;
  metadata?: any;
}

export interface LoyaltiesTransaction {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  loyaltyId: string;
  userId: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  metadata: Metadata2;
  executeAt: string;
  status: string;
  actionId: string;
  isWithdrawal: boolean;
}

export interface Metadata2 {
  ruleId?: string;
  description: string;
  operatorUserId: string;
  action?: string;
}
