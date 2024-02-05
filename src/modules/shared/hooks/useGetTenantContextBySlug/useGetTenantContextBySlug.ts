import { useQuery } from 'react-query';

import { useCompanyConfig } from '../useCompanyConfig';
import { useGetW3blockIdSDK } from '../useGetW3blockIdSDK';
import { PixwayAPIRoutes } from './../../enums/PixwayAPIRoutes';

export const useGetTenantContextBySlug = (slug: string) => {
  const { companyId: tenantId } = useCompanyConfig();
  const getSDK = useGetW3blockIdSDK();

  return useQuery(
    [PixwayAPIRoutes.TENANT_CONTEXT_BY_SLUG, tenantId, slug],
    async () => {
      const sdk = await getSDK();

      return await sdk.api.tenantContext.getTenantContextBySlug(tenantId, slug);
    },
    {
      enabled: Boolean(tenantId && slug),
      onError: () => {
        return null;
      },
    }
  );
};
