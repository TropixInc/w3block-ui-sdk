import { PixwayAPIRoutes } from "../enums/PixwayAPIRoutes";
import { handleNetworkException } from "../utils/handleNetworkException";
import { useCompanyConfig } from "./useCompanyConfig";
import { useGetW3blockIdSDK } from "./useGetW3blockIdSDK";
import { usePrivateQuery } from "./usePrivateQuery";


export const useGetContextByUserId = (userId: string, contextId?: string): any => {
  const { companyId } = useCompanyConfig();
  const getSdk = useGetW3blockIdSDK();

  return usePrivateQuery(
    [PixwayAPIRoutes.CONTEXT_BY_USER_ID, userId, contextId],
    async () => {
      try {
        const sdk = await getSdk();
        const response = await sdk.api.users.findUsersContextByUserId(
          companyId as string,
          userId,
          { contextId }
        );

        return response;
      } catch (err) {
        console.error('Erro ao obter contexto do usuário:', err);

        throw handleNetworkException(err);
      }
    },
    { enabled: Boolean(userId) }
  );
};
