import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { QueryParams } from '../../shared/hooks/usePaginatedQuery';
import { usePixwaySession } from '../../shared/hooks/usePixwaySession';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';
import { handleNetworkException } from '../../shared/utils/handleNetworkException';
export const useGetOrders = (query?: QueryParams) => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { data: session } = usePixwaySession();
  const { companyId } = useCompanyConfig();

  const defaultQuery: QueryParams = {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    orderBy: 'DESC',
    ...query,
  };

  const queryString =
    '?' +
    new URLSearchParams(defaultQuery as Record<string, string>).toString();

  return usePrivateQuery(
    [companyId, PixwayAPIRoutes.CREATE_ORDER],
    async () => {
      try {
        const response = await axios.get(
          PixwayAPIRoutes.CREATE_ORDER.replace('{companyId}', companyId) +
            queryString
        );
        return response.data;
      } catch (error) {
        console.error('Erro ao obter pedidos:', error);
        throw handleNetworkException(error);
      }
    },
    { enabled: Boolean(companyId) && Boolean(session?.id) }
  );
};
