/* eslint-disable @typescript-eslint/no-explicit-any */
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import {
  QueryConfig,
  usePrivateQuery,
} from '../../shared/hooks/usePrivateQuery';
import { Withdraw, WithdrawOrdersResponse } from '../interfaces';
import {
  isMissingEndpoint,
  mockOrdersPage,
  WITHDRAWS_MOCK_FALLBACK,
} from '../utils/mock';

interface Params {
  page?: number;
  limit?: number;
  /** Usa a rota de admin (default) ou a do usuário. */
  admin?: boolean;
}

/**
 * Compras conciliadas no saque (api-faltante §1). A rota ainda não existe na
 * Key API: enquanto responder 404, cai no mock determinístico gerado a partir
 * do saque (`isMock: true` na resposta).
 */
export const useGetWithdrawOrders = (
  withdraw: Pick<Withdraw, 'id' | 'amount' | 'createdAt'> | undefined,
  { page = 1, limit = 10, admin = true }: Params = {},
  options?: QueryConfig<WithdrawOrdersResponse, any, WithdrawOrdersResponse>
) => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();
  const route = admin
    ? PixwayAPIRoutes.WITHDRAW_ORDERS_ADMIN
    : PixwayAPIRoutes.WITHDRAW_ORDERS;
  const id = withdraw?.id ?? '';

  return usePrivateQuery<WithdrawOrdersResponse, any, WithdrawOrdersResponse>(
    [route, companyId, id, page, limit],
    async () => {
      try {
        const response = await axios.get<WithdrawOrdersResponse>(
          route.replace('{companyId}', companyId).replace('{id}', id),
          { params: { page, limit } }
        );
        return response.data;
      } catch (err) {
        if (WITHDRAWS_MOCK_FALLBACK && isMissingEndpoint(err) && withdraw) {
          return mockOrdersPage(withdraw, page, limit);
        }
        throw err;
      }
    },
    {
      enabled: Boolean(id) && Boolean(companyId),
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
