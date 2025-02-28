import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { handleNetworkException } from '../../../shared/utils/handleNetworkException';
import { Product } from '../useGetProductBySlug/useGetProductBySlug';

const useGetProductById = (productId?: string) => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { companyId } = useCompanyConfig();

  return useQuery<Product>(
    [PixwayAPIRoutes.PRODUCT_BY_ID, companyId as string],
    async () => {
      try {
        const response = await axios.get(
          PixwayAPIRoutes.PRODUCT_BY_ID.replace(
            '{companyId}',
            companyId ?? ''
          ).replace('{productId}', productId ?? '')
        );
        return response.data;
      } catch (error) {
        console.error('Erro ao obter o produto:', error);
        throw handleNetworkException(error);
      }
    },
    {
      enabled:
        Boolean(productId) && productId !== '' && productId !== undefined,
      refetchOnWindowFocus: false,
    }
  );
};

export default useGetProductById;
