import { useQuery } from '@tanstack/react-query';
import { Meta } from '../../../dashboard/interface/ercTokenHistoryInterface';
import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { Product } from '../../interfaces/Product';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';

interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  orderBy?: string;
  benefitId?: string;
  editionNumber?: number;
}

interface Params {
  query?: QueryParams;
  enabled?: boolean;
}

interface Response {
  items: Product[];
  meta: Meta;
}

export const useGetProductsForResale = ({ query, enabled = true }: Params) => {
  const axios = useAxios(W3blockAPI.COMMERCE);
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

  return useQuery({
    queryKey: [PixwayAPIRoutes.GET_PRODUCT_RESALE, companyId, queryString],
    queryFn: () =>
      axios
        .get<Response>(
          PixwayAPIRoutes.GET_PRODUCT_RESALE.replace('{companyId}', companyId) +
            queryString
        )
        .then((res) => res.data),
    enabled,
  });
};
