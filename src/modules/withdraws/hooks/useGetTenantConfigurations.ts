/* eslint-disable @typescript-eslint/no-explicit-any */
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import {
  QueryConfig,
  usePrivateQuery,
} from '../../shared/hooks/usePrivateQuery';
import { TenantConfigurations } from '../interfaces';

/**
 * Configuração global de automação de saques do tenant (só leitura;
 * `GET /{companyId}/tenant/configurations`, PR #697). A escrita fica com a
 * W3Block (decisão 29/10).
 */
export const useGetTenantConfigurations = (
  options?: QueryConfig<TenantConfigurations, any, TenantConfigurations>
) => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return usePrivateQuery<TenantConfigurations, any, TenantConfigurations>(
    [PixwayAPIRoutes.TENANT_CONFIGURATIONS, companyId],
    async () => {
      const response = await axios.get<TenantConfigurations>(
        PixwayAPIRoutes.TENANT_CONFIGURATIONS.replace('{companyId}', companyId)
      );
      return response.data;
    },
    {
      enabled: Boolean(companyId),
      refetchOnWindowFocus: false,
      staleTime: 60_000,
      retry: false,
      ...options,
    }
  );
};
