import { useQuery, useQueryClient } from 'react-query';

import { useCompanyConfig } from '../useCompanyConfig';
import { useGetW3blockIdSDK } from '../useGetW3blockIdSDK';
import { useProfile } from '../useProfile';
import { PixwayAPIRoutes } from './../../enums/PixwayAPIRoutes';

export const useGetTenantContext = () => {
  const { companyId: tenantId } = useCompanyConfig();
  const { data: profile } = useProfile();
  const getSDK = useGetW3blockIdSDK();
  const queryClient = useQueryClient();

  return useQuery(
    [PixwayAPIRoutes.TENANT_CONTEXT, tenantId],
    async () => {
      const sdk = await getSDK();

      return await sdk.api.tenantContext.findTenantContext('faoasij');
    },
    {
      enabled: Boolean(tenantId && profile),
      onError: () => {
        return null;
      },
      onSettled: () =>
        queryClient.invalidateQueries(PixwayAPIRoutes.TENANT_CONTEXT),
    }
  );
};
