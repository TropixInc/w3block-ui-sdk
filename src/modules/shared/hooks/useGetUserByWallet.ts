import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { PixwayAPIRoutes } from "../enums/PixwayAPIRoutes";
import { useCompanyConfig } from "./useCompanyConfig";
import { useGetW3blockIdSDK } from "./useGetW3blockIdSDK";


export const useGetUserByWallet = () => {
  const { companyId: tenantId } = useCompanyConfig();
  const getSDK = useGetW3blockIdSDK();

  const fetchUserByWallet = (address: string): QueryObserverResult => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useQuery(
      [PixwayAPIRoutes.USER_BY_WALLET, tenantId, address],
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
