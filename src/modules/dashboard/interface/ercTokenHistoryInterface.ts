/* eslint-disable @typescript-eslint/no-explicit-any */

import { Currency } from "../../shared/interfaces/Currency";
import { Erc20ActionType, Erc20ActionStatus } from "../../shared/interfaces/Statement";


export interface ErcTokenHistoryInterfaceResponse {
  items: Erc20TokenHistory[];
  summary?: {
    balance?: number;
  };
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
  commerce?: Commerce;
  description?: string;
}

export interface Commerce {
  orderId: string;
  payments?: PaymentsEntity[] | null;
  deliverId: string;
  productTokenId: string;
  isErc20Purchase: boolean;
  isLoyaltyPurchase: boolean;
  payerWalletAddress: string;
  destinationUserName: string;
  erc20PurchaseAmount: string;
  destinationWalletAddress: string;
}

export interface PaymentsEntity {
  currency: Currency;
  currencyId: string;
  totalAmount: string;
  currencyFullTotalAmount: string;
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
  metadata?: Metadata2;
  executeAt: string;
  status: string;
  actionId: string;
  parentMinterId?: null;
  parentTransferId?: null;
  isWithdrawal: boolean;
  poolAddress?: null;
  sendEmail: boolean;
}

export interface Metadata2 {
  action: string;
  amount: string;
  ruleId: string;
  buyerId: string;
  commerce: Commerce1;
  userName: string;
  buyerName: string;
  createdAt: string;
  userEmail: string;
  buyerEmail: string;
  description: string;
  operatorName: string;
  poolMetadata: PoolMetadata;
  operatorUserId: string;
  pointsCashback: string;
  loyaltiesDeferredId: string;
  isFinalRecipient?: boolean;
  indirectCashbackLevel?: number | null;
  indirectCashbackFromUserId?: string | null;
}

export interface Commerce1 {
  orderId: string;
  deliverId: string;
  productTokenId: string;
  destinationUserName: string;
}

export interface PoolMetadata {
  amount: number;
  amountLocked: number;
  amountToMint: number;
  poolAddressBalance: PoolAddressBalance;
  availableToTransfer: number;
}

export interface PoolAddressBalance {
  balance: string;
  currency: string;
  processing: string;
}
