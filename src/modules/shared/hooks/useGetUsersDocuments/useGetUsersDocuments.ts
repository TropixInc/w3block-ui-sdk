import { useCompanyConfig } from '../useCompanyConfig';
import { useGetW3blockIdSDK } from '../useGetW3blockIdSDK';
import { usePrivateQuery } from '../usePrivateQuery';
import { PixwayAPIRoutes } from './../../enums/PixwayAPIRoutes';

interface Params {
  userId: string;
  contextId: string;
}

export const useGetUsersDocuments = ({ userId, contextId }: Params) => {
  const { companyId: tenantId } = useCompanyConfig();

  const getSDKId = useGetW3blockIdSDK();

  return usePrivateQuery(
    [PixwayAPIRoutes.DOCUMENTS_BY_USER_BY_CONTEXT, userId, contextId],
    async () => {
      const sdk = await getSDKId();

      return sdk.api.users.getAllByContextByUserIdAndContextId(
        tenantId,
        userId,
        contextId
      );
    },
    { enabled: Boolean(tenantId && userId && contextId) }
  );
};
