// Módulo de saques compartilhado entre Offpix (admin) e Connect (estabelecimento).
// Exportado pela entrada `shared` do pacote.

export * from './interfaces';
export * from './utils/presentation';
export * from './utils/format';
export * from './utils/download';
export {
  WITHDRAWS_MOCK_FALLBACK,
  isMissingEndpoint,
  withWithdrawExtras,
  mockOrdersFor,
  mockOrdersPage,
  mockPeriodFor,
  totalsOf,
} from './utils/mock';

export * from './hooks/useGetWithdrawsAdmin';
export * from './hooks/useGetWithdrawAdmin';
export * from './hooks/useGetWithdrawOrders';
export * from './hooks/useGetWithdrawXlsx';
export * from './hooks/useGetWithdrawsSummary';
export * from './hooks/useGetWithdrawsAuditXlsx';
export * from './hooks/useGetTenantConfigurations';
export * from './hooks/useReconcileWithdrawTransfer';
export * from './hooks/useGetUserWithdrawAccount';
export {
  useRequestWithdraw,
  useEscrowWithdraw,
  useRefuseWithdraw,
  useConcludeWithdraw,
  useGetSpecificWithdrawAdmin,
  useGetSpecificWithdraw,
} from '../auth/hooks/useRequestWithdraw';
export { default as useGetWithdrawsMethods } from '../auth/hooks/useGetWithdrawsMethods';
export { default as InputWithdrawCommerce } from '../auth/components/InputWithdrawCommerce';

export * from './components/WithdrawStatusBadge';
export * from './components/WithdrawSummary';
export * from './components/WithdrawTimeline';
export * from './components/WithdrawOrdersTable';
export * from './components/WithdrawReceiptCard';
