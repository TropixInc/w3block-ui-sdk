import { useQuery } from 'react-query';

import { useGetW3blockIdSDK } from '../useGetW3blockIdSDK';
import { useRouterConnect } from '../useRouterConnect';

export const useGetTenantContext = () => {
  const router = useRouterConnect();
  const { tenantId } = router.query;
  const getSDK = useGetW3blockIdSDK();

  return useQuery([], async () => {
    const sdk = await getSDK();

    return await sdk.api.tenantContext.findTenantContext(tenantId as string);
  });
};
