import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { QueryParams } from '../../shared/hooks/usePaginatedPrivateQuery';
import { usePixwaySession } from '../../shared/hooks/usePixwaySession';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';

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
    () =>
      axios.get(
        PixwayAPIRoutes.CREATE_ORDER.replace('{companyId}', companyId) +
          queryString
      ),
    { enabled: Boolean(companyId) && Boolean(session?.id) }
  );
};
