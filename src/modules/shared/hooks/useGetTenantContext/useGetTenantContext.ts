import { useQuery } from 'react-query';

import { useGetW3blockIdSDK } from '../useGetW3blockIdSDK';
import { useRouterConnect } from '../useRouterConnect';
import { PixwayAPIRoutes } from './../../enums/PixwayAPIRoutes';

export const useGetTenantContext = () => {
  const router = useRouterConnect();
  const { tenantId } = router.query;
  const getSDK = useGetW3blockIdSDK();

  return useQuery(
    [PixwayAPIRoutes.TENANT_CONTEXT],
    async () => {
      const sdk = await getSDK();

      return await sdk.api.tenantContext.findTenantContext(tenantId as string);
    },
    { enabled: Boolean(tenantId) }
  );
};
