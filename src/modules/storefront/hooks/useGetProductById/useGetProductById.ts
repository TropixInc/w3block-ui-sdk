import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { Product } from '../useGetProductBySlug/useGetProductBySlug';

const useGetProductById = (productId?: string) => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { companyId } = useCompanyConfig();

  return useQuery<Product>(
    [PixwayAPIRoutes.PRODUCT_BY_ID, companyId as string],

    () =>
      axios
        .get(
          PixwayAPIRoutes.PRODUCT_BY_ID.replace(
            '{companyId}',
            companyId ?? ''
          ).replace('{productId}', productId ?? '')
        )
        .then((data) => data.data),
    {
      enabled: Boolean(productId) && productId != '' && productId != undefined,
      refetchOnWindowFocus: false,
    }
  );
};

export default useGetProductById;
