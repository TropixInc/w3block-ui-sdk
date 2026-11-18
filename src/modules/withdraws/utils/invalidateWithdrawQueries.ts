import { QueryClient } from '@tanstack/react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';

/** Prefixos de chave de tudo que muda quando um saque é concluído, recusado ou reconciliado. */
export const WITHDRAW_QUERY_KEYS = [
  PixwayAPIRoutes.WITHDRAWS_ADMIN,
  PixwayAPIRoutes.WITHDRAWS_ADMIN_SUMMARY,
  PixwayAPIRoutes.GET_SPECIFIC_WITHDRAW_ADMIN,
  PixwayAPIRoutes.GET_SPECIFIC_WITHDRAW,
  PixwayAPIRoutes.WITHDRAW_ORDERS_ADMIN,
  PixwayAPIRoutes.WITHDRAW_ORDERS,
];

export const invalidateWithdrawQueries = (queryClient: QueryClient) =>
  Promise.all(
    WITHDRAW_QUERY_KEYS.map((key) => queryClient.invalidateQueries([key]))
  );
