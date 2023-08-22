/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { QueryParams } from '../../../shared/hooks/usePaginatedPrivateQuery';
import { MetadataApiInterface } from '../../../shared/interface/metadata/metadata';

interface Response {
  items: MetadataApiInterface<any>[];
}

interface Params {
  id: string;
  query?: QueryParams;
  enabled?: boolean;
}

export const useGetCollectionMetadata = ({
  id,
  query,
  enabled = true,
}: Params) => {
  const axios = useAxios(W3blockAPI.KEY);
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

  return useQuery(
    [PixwayAPIRoutes.METADATA_BY_COLLECTION_ID, companyId, id],
    () =>
      axios
        .get<Response>(
          PixwayAPIRoutes.METADATA_BY_COLLECTION_ID.replace(
            '{companyId}',
            companyId
          ).replace('{collectionId}', id) + queryString
        )
        .then((res) => res.data),
    {
      enabled: id != undefined && id != '' && enabled,
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );
};
