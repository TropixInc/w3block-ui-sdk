import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';

export type ProductPrice = {
  amount: string;
  currency: {
    code?: string;
    createdAt?: string;
    crypto?: string;
    id?: string;
    name?: string;
    symbol: string;
    updatedAt?: string;
  };
  currencyId?: string;
};

export interface Product {
  canPurchase?: boolean;
  chainId?: number;
  htmlContent?: string;
  companyId?: string;
  contractAddress?: string;
  createdAt?: string;
  description: string;
  hasLink?: boolean;
  distributionType?: string;
  draftData?: {
    keyCollectionId?: string;
    quantity?: number;
    range?: string;
  };
  endSaleAt?: string;
  id: string;
  images: { assetId?: string; original?: string; thumb?: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
  name: string;
  prices: ProductPrice[];
  pricingType?: string;
  slug: string;
  startSaleAt?: string;
  status?: string;
  stockAmount?: number;
  canPurchaseAmount?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tags?: any[];
  tokensAmount?: number;
  updatedAt?: string;
}

export interface ProductsResponse {
  id: string;
  items: Product[];
  meta: {
    currentPage: number;
    itemCount: number;
    totalItems: number;
    totalPages: number;
  };
}

const useGetProductBySlug = (slug?: string) => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { companyId } = useCompanyConfig();

  return useQuery<Product>(
    [PixwayAPIRoutes.PRODUCT_BY_SLUG, companyId as string],

    () =>
      axios
        .get(
          PixwayAPIRoutes.PRODUCT_BY_SLUG.replace(
            '{companyId}',
            companyId ?? ''
          ).replace('{slug}', slug ?? '')
        )
        .then((data) => data.data),
    {
      enabled: Boolean(slug) && slug != '' && slug != undefined,
      refetchOnWindowFocus: false,
    }
  );
};

export default useGetProductBySlug;
