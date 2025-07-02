
import { useMutation } from '@tanstack/react-query';
import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { Product } from '../../interfaces/Product';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';

interface Params {
  id: string;
  amount?: string;
  price?: string;
}

export interface ProductResaleResponse {
  product: Product;
  resaleMetadata: {
    prices: {
      currencyId: string;
      maxPrice: string;
      minPrice: string;
      recommendedPrice: string;
    }[];
    percentageFee?: string;
    resalePreviewResponse: {
      totalPrice: string;
      fees: string;
      netValue: string;
    };
  };
}

export const useGetResaleById = () => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { companyId } = useCompanyConfig();

  return useMutation(
    [PixwayAPIRoutes.GET_PRODUCT_RESALE_BY_ID, companyId],
    ({ id, amount, price }: Params) =>
      axios
        .get<ProductResaleResponse>(
          amount && price
            ? PixwayAPIRoutes.GET_PRODUCT_RESALE_BY_ID.replace(
                '{companyId}',
                companyId
              ).replace('{productId}', id) +
                `?previewAmount=${amount}&previewPrice=${price}`
            : PixwayAPIRoutes.GET_PRODUCT_RESALE_BY_ID.replace(
                '{companyId}',
                companyId
              ).replace('{productId}', id)
        )
        .then((res) => res.data)
  );
};
