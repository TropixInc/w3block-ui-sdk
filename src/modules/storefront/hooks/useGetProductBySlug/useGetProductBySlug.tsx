import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { handleNetworkException } from '../../../shared/utils/handleNetworkException';

export type ProductPrice = {
  amount: string;
  currency: CurrencyResponse;
  currencyId?: string;
  anchorCurrencyId?: string;
};

export interface CurrencyResponse {
  code?: string;
  createdAt?: string;
  crypto?: boolean;
  id?: string;
  name?: string;
  symbol: string;
  updatedAt?: string;
}

export interface VariantValues {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  name: string;
  extraAmount: string;
  keyValue: string;
}
export interface Variants {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  name: string;
  keyLabel: string;
  values: VariantValues[];
}

interface Terms {
  title: string;
  description?: string;
  link?: string;
}

export interface DataFields {
  name: string;
  label: string;
  required: boolean;
  type: 'text' | 'textarea';
}
export interface Product {
  settings?: {
    resaleConfig?: {
      batchSize?: number;
      currencyIds?: string[];
      priceLimits?: { max?: string; min?: string; currencyId?: string }[];
    };
    acceptMultipleCurrenciesPurchase?: boolean;
    passShareCodeConfig?: {
      enabled?: boolean;
      dataFields?: DataFields[];
    };
    disableImageDisplay?: boolean;
    minCartItemPrice?: number;
  };
  canPurchase?: boolean;
  chainId?: number;
  htmlContent?: string;
  companyId?: string;
  contractAddress?: string;
  createdAt?: string;
  minPurchaseAmount?: string | null;
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
  images: {
    assetId?: string;
    original?: string;
    thumb?: string;
    variants?: {
      keyLabel: string;
      keyValue: string;
    }[];
  }[];
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
  requirements?: {
    companyId: string;
    keyCollectionId: string;
    productId: string;
    requirementCTALabel: string;
    requirementCTAAction: string;
    requirementDescription: string;
    requirementModalContent: string;
    autoCloseOnSuccess: boolean;
    linkMessage: string;
    purchaseRequiredModalContent: string;
    requirementModalPendingContent: string;
    requirementModalNoPurchaseAvailable: string;
    requireKycContext?: {
      slug?: string;
    };
  };
  hasWhitelistBlocker?: boolean;
  variants?: Variants[];
  terms?: Terms[];
  type?: string;
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
  const { status } = usePixwaySession();
  const { companyId } = useCompanyConfig();

  return useQuery<Product>(
    [PixwayAPIRoutes.PRODUCT_BY_SLUG, companyId as string],
    async () => {
      try {
        const response = await axios.get(
          PixwayAPIRoutes.PRODUCT_BY_SLUG.replace(
            '{companyId}',
            companyId ?? ''
          ).replace('{slug}', slug ?? '')
        );
        return response.data;
      } catch (error) {
        throw handleNetworkException(error);
      }
    },
    {
      enabled:
        Boolean(slug) && slug != '' && slug != undefined && status != 'loading',
      refetchOnWindowFocus: false,
    }
  );
};
export default useGetProductBySlug;
