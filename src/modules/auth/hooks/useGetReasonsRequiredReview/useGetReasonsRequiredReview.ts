import { useGetW3blockIdSDK } from '../../../shared/hooks/useGetW3blockIdSDK';
import { usePrivateQuery } from '../../../shared/hooks/usePrivateQuery';

export const useGetReasonsRequiredReview = (
  tenantId: string,
  userId: string,
  contextId: string
) => {
  const getSDK = useGetW3blockIdSDK();
  return usePrivateQuery(
    [tenantId, userId, contextId],
    async () => {
      const sdk = await getSDK();
      return sdk.api.users.findUsersContextByUserId(tenantId, userId, {
        contextId: contextId,
      });
    },
    { enabled: Boolean(tenantId && userId && contextId) }
  );
};
