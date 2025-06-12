
import { useQuery } from '@tanstack/react-query';
import { handleNetworkException } from '../utils/handleNetworkException';
import { useCompanyConfig } from './useCompanyConfig';
import { useGetW3blockIdSDK } from './useGetW3blockIdSDK';
import { useProfile } from './useProfile';
import { PixwayAPIRoutes } from '../enums/PixwayAPIRoutes';

export const useGetTenantContext = (): any => {
  const { companyId: tenantId } = useCompanyConfig();
  const { data: profile } = useProfile();
  const getSDK = useGetW3blockIdSDK();

  return useQuery(
    [PixwayAPIRoutes.TENANT_CONTEXT, tenantId],
    async () => {
      try {
        const sdk = await getSDK();
        return await sdk.api.tenantContext.findTenantContext(tenantId);
      } catch (error) {
        console.error('Erro ao buscar o contexto do tenant:', error);
        throw handleNetworkException(error);
      }
    },
    {
      enabled: Boolean(tenantId && profile),
      onError: () => {
        return null;
      },
    }
  );
};
