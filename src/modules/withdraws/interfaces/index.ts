import { PixwayPaginatedResponse } from '../../shared/interfaces/PixwayPaginatedResponse';

// Espelho dos enums de `pixway-registry-backend` (PR #697,
// src/modules/withdraws/enums/index.ts). Manter em sincronia.

export enum WithdrawStatus {
  PENDING = 'pending',
  ESCROWING_RESOURCES = 'escrowing_resources',
  READY_TO_TRANSFER_FUNDS = 'ready_to_transfer_funds',
  TRANSFERRING_FUNDS = 'transferring_funds',
  CONCLUDED = 'concluded',
  FAILED = 'failed',
  REFUSED = 'refused',
}

export enum WithdrawOrigin {
  USER = 'user',
  ON_BEHALF = 'on_behalf',
  AUTOMATIC = 'automatic',
}

export enum WithdrawAutomationDecision {
  APPROVED = 'approved',
  DECLINED = 'declined',
}

export enum WithdrawFailureStage {
  ESCROW = 'escrow',
  TRANSFER = 'transfer',
}

export enum WithdrawProvider {
  SANTANDER = 'santander',
}

export enum WithdrawProviderTransferStatus {
  CREATED = 'created',
  PENDING_VALIDATION = 'pending_validation',
  READY_TO_PAY = 'ready_to_pay',
  PENDING_CONFIRMATION = 'pending_confirmation',
  PAID = 'paid',
  REJECTED = 'rejected',
  UNKNOWN = 'unknown',
}

export enum WithdrawAutomationDeclineReason {
  TRANSFER_DISABLED = 'transfer_disabled',
  PROVIDER_NOT_CONFIGURED = 'provider_not_configured',
  CONTRACT_NOT_ENABLED = 'contract_not_enabled',
  NOT_MAIN_WALLET = 'not_main_wallet',
  WITHDRAW_ACCOUNT_NOT_FOUND = 'withdraw_account_not_found',
  UNSUPPORTED_ACCOUNT_TYPE = 'unsupported_account_type',
  UNRESOLVABLE_PIX_KEY = 'unresolvable_pix_key',
  AMOUNT_ABOVE_LIMIT = 'amount_above_limit',
}

export enum WithdrawAutomaticRequestSkipReason {
  IGNORED_USER = 'ignored_user',
  NO_MAIN_WALLET = 'no_main_wallet',
  OPEN_WITHDRAW = 'open_withdraw',
  WITHDRAW_ACCOUNT_COUNT = 'withdraw_account_count',
  BELOW_MINIMUM = 'below_minimum',
  REQUEST_FAILED = 'request_failed',
}

export const WITHDRAW_FINAL_STATUSES = [
  WithdrawStatus.CONCLUDED,
  WithdrawStatus.REFUSED,
];

export const WITHDRAW_PROCESSING_STATUSES = [
  WithdrawStatus.PENDING,
  WithdrawStatus.ESCROWING_RESOURCES,
  WithdrawStatus.READY_TO_TRANSFER_FUNDS,
  WithdrawStatus.TRANSFERRING_FUNDS,
];

export interface WithdrawProviderTransfer {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  companyId: string;
  withdrawId: string;
  beneficiary?: Record<string, unknown> | null;
  provider: WithdrawProvider;
  status: WithdrawProviderTransferStatus;
  amount: string;
  rejectReason?: string | null;
  endToEndId?: string | null;
  transactionCode?: string | null;
  transactionDate?: string | null;
  providerPaymentId?: string | null;
  duplicatePaymentSuspected?: boolean;
}

export interface WithdrawAutomationEvaluation {
  decision: WithdrawAutomationDecision;
  reasons: WithdrawAutomationDeclineReason[];
  cap: string | null;
  evaluatedAt: string;
}

export interface WithdrawAutomationReasons {
  flow?: WithdrawAutomationEvaluation;
  transfer?: WithdrawAutomationEvaluation;
  confirmedProviderTransferId?: string;
}

export interface WithdrawReceiptAsset {
  id: string;
  directLink?: string;
  type?: string;
  createdAt?: string;
}

export interface WithdrawUser {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface WithdrawPeriod {
  from: string;
  to: string;
}

export interface WithdrawTotals {
  gross: string;
  cashback: string;
  net: string;
}

export interface Withdraw {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  companyId: string;
  receiptAssetId?: string | null;
  receiptAsset?: WithdrawReceiptAsset | null;
  status: WithdrawStatus;
  erc20ContractId: string;
  escrowActionId?: string | null;
  userId: string;
  fromWalletAddress: string;
  withdrawAccountId?: string | null;
  amount: string;
  memo?: string;
  reason?: string;
  concludedAt?: string | null;
  origin: WithdrawOrigin;
  automaticFlowState?: WithdrawAutomationDecision | null;
  automaticTransferState?: WithdrawAutomationDecision | null;
  automationReasons?: WithdrawAutomationReasons | null;
  failureStage?: WithdrawFailureStage | null;
  providerTransfers?: WithdrawProviderTransfer[];
  /** Só na visão admin (lista e detalhe). */
  user?: WithdrawUser;

  // ---- Ainda não expostos pela Key API (api-faltante-saques.md §1). Quando
  // ausentes, `withWithdrawExtras` preenche com dados simulados e marca
  // `extrasAreMock`.
  ordersCount?: number;
  period?: WithdrawPeriod | null;
  totals?: WithdrawTotals;
  extrasAreMock?: boolean;
}

export type WithdrawOrderStatus = 'released' | 'pending';

export interface WithdrawOrder {
  loyaltyDeferredId: string;
  orderId: string | null;
  purchasedAt: string;
  releasedAt: string;
  customer?: { name?: string; email?: string };
  grossAmount: string;
  cashbackAmount: string;
  netAmount: string;
  status: WithdrawOrderStatus;
}

export interface WithdrawOrdersResponse
  extends PixwayPaginatedResponse<WithdrawOrder> {
  totals?: WithdrawTotals;
  /** true quando a resposta veio do mock local (endpoint ainda inexistente). */
  isMock?: boolean;
}

export interface WithdrawsSummary {
  awaitingAction: number;
  processing: number;
  paidInPeriod: { count: number; amount: string; ordersCount: number };
  nextExecutionAt: string | null;
  /** true quando parte dos números veio do mock local. */
  isMock?: boolean;
}

export interface WithdrawsAdminFilters {
  status?: WithdrawStatus[];
  origin?: WithdrawOrigin[];
  automaticFlowState?: WithdrawAutomationDecision[];
  automaticTransferState?: WithdrawAutomationDecision[];
  failureStage?: WithdrawFailureStage[];
  /** Ainda não aceito pela API (api-faltante §5); enviado mesmo assim. */
  search?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  orderBy?: 'ASC' | 'DESC';
}

export type WithdrawsAdminResponse = PixwayPaginatedResponse<Withdraw>;

export interface ConcludeWithdrawParams {
  id: string;
  /** Conclui com este comprovante. */
  receiptAssetId?: string;
  /** Marca o último Pix do provedor como pagamento (saques com falha na transferência). */
  confirmProviderTransfer?: boolean;
  /** "Pagar via Pix": paga pelo provedor do tenant, sem comprovante. */
  agreeAutomaticTransfer?: boolean;
}

export interface AutomaticWithdrawRequestConfig {
  enabled: boolean;
  cronRule: string;
  minWithdrawableAmount: string;
  erc20ContractIds: string[];
  ignoreUserIds: string[];
  nextExecutionAt?: string | null;
  lastExecutionAt?: string | null;
}

export interface AutomaticWithdrawTransferConfig {
  enabled: boolean;
  erc20ContractIds: string[];
  maxAutoApprovalAmount: string;
  maxAutoTransferAmount: string;
  provider: WithdrawProvider;
  providerData: Record<string, unknown>;
}

export interface TenantConfigurations {
  companyId: string;
  automaticWithdrawRequest?: AutomaticWithdrawRequestConfig | null;
  automaticWithdrawTransfer?: AutomaticWithdrawTransferConfig | null;
}

export type WithdrawAccountType = 'pix' | 'bank';

export interface WithdrawAccount {
  id: string;
  tenantId?: string;
  userId?: string;
  type: WithdrawAccountType | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  accountInfo?: any;
  createdAt?: string;
  updatedAt?: string;
}

export type WithdrawPillColor = 'green' | 'blue' | 'amber' | 'red' | 'gray';

export interface WithdrawPresentation {
  label: string;
  /** Complemento curto, ex.: "limite Pix", "Pix rejeitado". */
  detail?: string;
  color: WithdrawPillColor;
}

export type WithdrawTimelineState = 'done' | 'pending' | 'failed' | 'blocked';

export interface WithdrawTimelineEvent {
  key: string;
  title: string;
  detail?: string;
  at?: string | null;
  state: WithdrawTimelineState;
}
