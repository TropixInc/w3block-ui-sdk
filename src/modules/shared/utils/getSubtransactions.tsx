import { ReactElement } from 'react';

import { isArray } from 'lodash';

import { Erc20TokenHistory } from '../../dashboard/interface/ercTokenHistoryInterface';
import { Erc20ActionStatus } from '../interface/Statement/Statement';

export enum StatementScreenTransactionType {
  SENDING,
  CASHBACK,
  PENDING,
  RECEIVING,
}

export enum StatementScreenTransactionSubType {
  ZUCA_PURCHASE,
  ZUCA_DEBIT,
  ZUCA_CREDIT,
}

export interface StatementScreenTransaction {
  parentItemId: string;
  hash: string;
  actionId?: string;
  deliveryId?: string;
  recipient: string | ReactElement;
  type: StatementScreenTransactionType;
  subtype?: StatementScreenTransactionSubType;
  date: string; // this is set to string on purpose, so the ListItem can be a pure component and receive only primitive types
  description: string;
  value: string;
  pending: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
  status?: Erc20ActionStatus;
  operatorName?: string;
}

export interface Metadata {
  confirmedAt?: string | null;
  transaction?: Transaction | null;
  commerce?: Commerce | null;
}
export interface Transaction {
  id: string;
  from: string;
  hash: string;
  nonce?: null;
  checks: number;
  status: string;
  clientId: string;
  createdAt: string;
  expiredAt?: null;
  lastCheck: string;
  confirmations: number;
  receiptStatus: string;
  optimisticStatus: string;
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

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
}

export interface Request {
  to: string;
  from: string;
  amount: string;
  metadata?: MetadataEntity | null;
}

export interface MetadataEntity {
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
  indirectCashbackLevel?: number | null;
  indirectCashbackFromUserId?: string | null;
  isFinalRecipient?: boolean;
}

export interface ItemsEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  contractId: string;
  companyId: string;
  type: string;
  status: string;
  contractAddress: string;
  chainId: number;
  sender: string;
  txHash: string;
  txId?: string | null;
  metadata: Metadata;
  request: Request;
  executeAt: string;
  sendEmail: boolean;
  to?: ToOrFrom | null;
  from?: From | null;
  loyaltiesTransactions?: (LoyaltiesTransactionsEntity | null)[] | null;
}

export interface ToOrFrom {
  id: string;
  type: string;
  wallet: string;
  email: string;
  user_name: string;
  cpf: string;
}

export interface From {
  id: string;
  type: string;
  user_name: string;
  wallet: string;
  email?: string | null;
  cpf?: string | null;
}

export interface LoyaltiesTransactionsEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  loyaltyId: string;
  userId: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  metadata?: MetadataEntity1[] | null;
  executeAt: string;
  status: string;
  actionId: string;
  parentMinterId?: null;
  parentTransferId?: null;
  isWithdrawal: boolean;
  poolAddress?: null;
  sendEmail: boolean;
}

export interface MetadataEntity1 {
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

export function getSubtransactions(data: Erc20TokenHistory) {
  const pending = data?.status !== 'success' && data?.status !== 'external';
  const hash = data?.txHash || data?.txId || '-';
  const parentItemId = data?.id;
  const subTransactions: StatementScreenTransaction[] = [];

  if (data?.loyaltiesTransactions?.length) {
    data?.loyaltiesTransactions?.forEach((loyalty) => {
      const metadata = isArray(loyalty?.metadata)
        ? loyalty?.metadata
        : [loyalty?.metadata];
      if (metadata) {
        metadata?.forEach((metadata, index) => {
          const common = {
            hash,
            pending,
            parentItemId,
            actionId: `${loyalty?.actionId}-${index}`,
            status: data?.status,
          };
          if (metadata.action === 'split_payees') {
            subTransactions.push({
              ...common,
              recipient: metadata?.buyerName,
              type: StatementScreenTransactionType.RECEIVING,
              date: metadata?.createdAt,
              description: 'split_payees',
              metadata,
              value: parseFloat(metadata?.pointsCashback).toFixed(2),
            });
          } else if (
            metadata?.action === 'cashback_multilevel' &&
            metadata?.indirectCashbackLevel &&
            metadata?.indirectCashbackLevel >= 1
          ) {
            subTransactions.push({
              ...common,
              recipient: metadata?.buyerName,
              type: StatementScreenTransactionType.RECEIVING,
              date: metadata?.createdAt,
              description: 'comission',
              value: parseFloat(metadata?.pointsCashback).toFixed(2),
            });
          } else if (metadata?.isFinalRecipient) {
            subTransactions.push({
              ...common,
              deliveryId: metadata?.commerce?.deliverId,
              recipient: metadata?.buyerName,
              operatorName: metadata?.operatorName,
              type: StatementScreenTransactionType.RECEIVING,
              date: metadata?.createdAt,
              description: 'final_recipient',
              value: parseFloat(loyalty?.amount).toFixed(2),
            });
          } else if (metadata?.action === 'cashback_multilevel') {
            subTransactions.push({
              ...common,
              deliveryId: metadata?.commerce?.deliverId,
              recipient: metadata?.operatorName,
              operatorName: metadata?.operatorName,
              type: StatementScreenTransactionType.RECEIVING,
              date: metadata?.createdAt,
              description: 'cashback',
              value: parseFloat(metadata?.pointsCashback).toFixed(2),
            });
          } else {
            subTransactions.push({
              parentItemId,
              hash,
              pending,
              type:
                data?.type === 'minter'
                  ? StatementScreenTransactionType.RECEIVING
                  : data?.type === 'burn'
                  ? StatementScreenTransactionType.SENDING
                  : StatementScreenTransactionType.PENDING,
              subtype:
                data?.type === 'minter'
                  ? StatementScreenTransactionSubType.ZUCA_CREDIT
                  : data?.type === 'burn'
                  ? StatementScreenTransactionSubType.ZUCA_DEBIT
                  : StatementScreenTransactionSubType.ZUCA_CREDIT,
              date: data?.createdAt,
              value: parseFloat(loyalty?.amount).toFixed(2),
              recipient: metadata?.description,
              description: '',
            });
          }
        });
      }
    });
  } else if (data?.metadata?.commerce) {
    const {
      metadata: { commerce },
      request,
    } = data;
    const type =
      request?.from === '0x0000000000000000000000000000000000000000'
        ? StatementScreenTransactionType.RECEIVING
        : StatementScreenTransactionType.SENDING;

    const transactionFragment = {
      hash,
      pending,
      type,
      parentItemId,
      deliveryId: commerce?.deliverId,
      date: data?.createdAt,
    };

    if (type === StatementScreenTransactionType.SENDING) {
      const amounts: string[] = [];
      commerce?.payments?.forEach((p) => {
        if (!p) return;
        if (p?.totalAmount) {
          amounts.push(parseFloat(p?.totalAmount).toFixed(2));
        }
      });
      subTransactions.push({
        ...transactionFragment,
        value:
          amounts?.length === 2
            ? `${parseFloat(
                commerce?.payments?.[0]?.currencyFullTotalAmount ?? ''
              ).toFixed(2)} (${amounts[0]} +${amounts[1]})`
            : amounts[0],

        recipient: commerce?.destinationUserName,
        description: 'payment',
      });
    } else {
      subTransactions.push({
        ...transactionFragment,
        value: parseFloat(request?.amount).toFixed(2),
        recipient: 'Crédito Zuca',
        subtype: StatementScreenTransactionSubType.ZUCA_PURCHASE,
        description: 'credit_purchase',
      });
    }
  } else {
    const { request } = data;
    // transactions that dont fit other criteria and don't have a description are filtered out
    if (request?.metadata?.description) {
      subTransactions.push({
        parentItemId,
        hash,
        pending,
        type:
          data?.type === 'minter'
            ? StatementScreenTransactionType.RECEIVING
            : data?.type === 'burn'
            ? StatementScreenTransactionType.SENDING
            : StatementScreenTransactionType.PENDING,
        subtype:
          data?.type === 'minter'
            ? StatementScreenTransactionSubType.ZUCA_CREDIT
            : data?.type === 'burn'
            ? StatementScreenTransactionSubType.ZUCA_DEBIT
            : StatementScreenTransactionSubType.ZUCA_CREDIT,
        date: data?.createdAt,
        value: parseFloat(request?.amount).toFixed(2),
        recipient: request?.metadata?.description,
        description:
          data?.type === 'minter'
            ? 'Crédito'
            : data?.type === 'burn'
            ? 'Débito'
            : 'Transferência',
      });
    }
  }
  return subTransactions;
}
