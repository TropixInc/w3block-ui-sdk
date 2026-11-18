/* eslint-disable @typescript-eslint/no-explicit-any */
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import {
  QueryConfig,
  usePrivateQuery,
} from '../../shared/hooks/usePrivateQuery';
import { Withdraw } from '../interfaces';
import { withWithdrawExtras } from '../utils/mock';

/**
 * Detalhe admin do saque (`GET /{companyId}/withdraws/admin/{id}`): traz
 * `receiptAsset`, `providerTransfers` e `user`. Retorna o objeto já com os
 * extras (período/compras) preenchidos pelo mock quando a API não manda.
 */
export const useGetWithdrawAdmin = (
  id: string,
  options?: QueryConfig<Withdraw, any, Withdraw>
) => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return usePrivateQuery<Withdraw, any, Withdraw>(
    [PixwayAPIRoutes.GET_SPECIFIC_WITHDRAW_ADMIN, companyId, id],
    async () => {
      const response = await axios.get<Withdraw>(
        PixwayAPIRoutes.GET_SPECIFIC_WITHDRAW_ADMIN.replace(
          '{companyId}',
          companyId
        ).replace('{id}', id)
      );
      return withWithdrawExtras(response.data);
    },
    {
      enabled: Boolean(id) && Boolean(companyId),
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

/** Detalhe do saque na visão do usuário (`GET /{companyId}/withdraws/{id}`). */
export const useGetWithdraw = (
  id: string,
  options?: QueryConfig<Withdraw, any, Withdraw>
) => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return usePrivateQuery<Withdraw, any, Withdraw>(
    [PixwayAPIRoutes.GET_SPECIFIC_WITHDRAW, companyId, id],
    async () => {
      const response = await axios.get<Withdraw>(
        PixwayAPIRoutes.GET_SPECIFIC_WITHDRAW.replace(
          '{companyId}',
          companyId
        ).replace('{id}', id)
      );
      return withWithdrawExtras(response.data);
    },
    {
      enabled: Boolean(id) && Boolean(companyId),
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
