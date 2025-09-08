import { OrderByEnum } from '@w3block/sdk-id';
import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { handleNetworkException } from '../../utils/handleNetworkException';
import { useCompanyConfig } from '../useCompanyConfig';
import { useGetW3blockIdSDK } from '../useGetW3blockIdSDK';
import { usePrivateQuery } from '../usePrivateQuery';

interface UseGetContextByUserIdProps {
  userId: string;
  queryOptions?: {
    limit?: number;
    page?: number;
    sortBy?: string;
    orderBy?: OrderByEnum;
    search?: string;
    contextId?: string;
  };
}

export const useGetContextByUserId = ({ userId, queryOptions }: UseGetContextByUserIdProps): any => {
  const { companyId } = useCompanyConfig();
  const getSdk = useGetW3blockIdSDK();

  return usePrivateQuery(
    [PixwayAPIRoutes.CONTEXT_BY_USER_ID, userId, queryOptions],
    async () => {
      try {
        const sdk = await getSdk();
        const response = await sdk.api.users.findUsersContextByUserId(
          companyId as string,
          userId,
          { ...queryOptions }
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
