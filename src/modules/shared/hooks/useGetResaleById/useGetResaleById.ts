import { useQuery } from 'react-query';

import { W3blockAPI } from '../../enums';
import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { Product } from '../../interface';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';

interface Params {
  id: string;
  enabled?: boolean;
}

interface Response {
  product: Product;
  resaleMetadata: {
    prices: {
      currencyId: string;
      maxPrice: string;
      minPrice: string;
      recommendedPrice: string;
    }[];
  };
}

export const useGetResaleById = ({ id, enabled = true }: Params) => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { companyId } = useCompanyConfig();

  return useQuery(
    [PixwayAPIRoutes.GET_PRODUCT_RESALE_BY_ID, companyId, id],
    () =>
      axios
        .get<Response>(
          PixwayAPIRoutes.GET_PRODUCT_RESALE_BY_ID.replace(
            '{companyId}',
            companyId
          ).replace('{productId}', id)
        )
        .then((res) => res.data),
    {
      enabled: enabled,
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );
};
