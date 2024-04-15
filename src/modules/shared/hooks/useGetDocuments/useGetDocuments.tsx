import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';
import { QueryParams } from '../usePaginatedQuery';
import { usePixwaySession } from '../usePixwaySession';
import { usePrivateQuery } from '../usePrivateQuery';

export const useGetDocuments = (query?: QueryParams) => {
  const axios = useAxios(W3blockAPI.ID);
  const defaultQuery: QueryParams = {
    limit: 10,
    ...query,
  };
  const queryString =
    '?' +
    new URLSearchParams(defaultQuery as Record<string, string>).toString();
  const { data } = usePixwaySession();
  const { companyId } = useCompanyConfig();
  return usePrivateQuery(
    [PixwayAPIRoutes.GET_DOCUMENTS_BY_USER, companyId, data?.id, query],
    () =>
      axios
        .get(
          PixwayAPIRoutes.GET_DOCUMENTS_BY_USER.replace(
            '{tenantId}',
            companyId
          ).replace('{userId}', data?.id ?? '') + queryString
        )
        .then((res) => res.data),
    {
      enabled: companyId != null && data != null,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
      keepPreviousData: false,
      cacheTime: 0,
      staleTime: 0,
    }
  );
};
