/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { QueryParams } from '../../../shared/hooks/usePaginatedQuery';
import { MetadataApiInterface } from '../../../shared/interface/metadata/metadata';
import { handleNetworkException } from '../../../shared/utils/handleNetworkException';

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
    async () => {
      try {
        const response = await axios.get<Response>(
          PixwayAPIRoutes.METADATA_BY_COLLECTION_ID.replace(
            '{companyId}',
            companyId
          ).replace('{collectionId}', id) + queryString
        );
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar metadados da coleção:', error);
        throw handleNetworkException(error);
      }
    },
    {
      enabled: id != undefined && id != '' && enabled,
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );
};
