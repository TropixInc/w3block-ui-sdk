import { QueryObserverResult, useQuery } from 'react-query';

import { useCompanyConfig } from '../useCompanyConfig';
import { useGetW3blockIdSDK } from '../useGetW3blockIdSDK';
import { PixwayAPIRoutes } from './../../enums/PixwayAPIRoutes';

export const useGetUserByWallet = () => {
  const { companyId: tenantId } = useCompanyConfig();
  const getSDK = useGetW3blockIdSDK();

  const fetchUserByWallet = (address: string): QueryObserverResult => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useQuery(
      [PixwayAPIRoutes.TENANT_CONTEXT_BY_SLUG, tenantId, address],
      async () => {
        const sdk = await getSDK();
        return await sdk.api.users.findByAddress(tenantId, address, {
          includeOwnerInfo: true,
        });
      },
      {
        enabled: Boolean(tenantId && address),
        cacheTime: 1000 * 60 * 60 * 2,
        refetchOnWindowFocus: false,
        onError: () => {
          return null;
        },
      }
    );
  };

  return { fetchUserByWallet };
};
