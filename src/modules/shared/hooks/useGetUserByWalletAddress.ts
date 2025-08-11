import { useQuery } from "@tanstack/react-query";
import { PixwayAPIRoutes } from "../enums/PixwayAPIRoutes";
import { handleNetworkException } from "../utils/handleNetworkException";
import { useCompanyConfig } from "./useCompanyConfig";
import { useGetW3blockIdSDK } from "./useGetW3blockIdSDK";


export const useGetUserByWalletAddress = (address: string): any => {
  const { companyId: tenantId } = useCompanyConfig();
  const getSDK = useGetW3blockIdSDK();

  return useQuery(
    [PixwayAPIRoutes.USER_BY_WALLET, tenantId, address],
    async () => {
      try {
        const sdk = await getSDK();
        return await sdk.api.users.findByAddress(tenantId ?? '', address, {
          includeOwnerInfo: true,
        });
      } catch (error) {
        console.error('Error fetching user by wallet address:', error);
        throw handleNetworkException(error);
      }
    },
    {
      enabled: Boolean(tenantId && address),
      cacheTime: 60 * 60 * 60 * 2,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};
