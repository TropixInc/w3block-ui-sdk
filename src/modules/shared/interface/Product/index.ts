import {
  CurrencyResponse,
  DataFields,
  Variants,
} from '../../../storefront/hooks/useGetProductBySlug/useGetProductBySlug';

interface PublicPromotion {
  id: string;
  publicDescription: string;
  type: 'discount' | 'coupon';
}
export interface Product {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  communityId: string;
  name: string;
  description: string;
  images: Images[];
  prices: {
    amount?: string;
    currency: CurrencyResponse;
    anchorCurrency: CurrencyResponse;
    currencyId: string;
    anchorCurrencyId?: string;
    anchorCurrencyAmount?: string;
    originalAmount?: string;
  }[];
  promotions: PublicPromotion[];
  distributionType: string;
  pricingType: string;
  contractAddress: string;
  chainId: number;
  startSaleAt: string;
  endSaleAt: string;
  stockAmount: number;
  canPurchaseAmount: number;
  tokensAmount: number;
  variants?: Variants[];
  subtitle?: string;
  metadata?: any;
  type?: string;
  settings?: {
    passShareCodeConfig?: {
      enabled?: boolean;
      dataFields?: DataFields[];
    };
  };
  productToken: {
    product: Product;
  };
}

export interface Images {
  original: string;
  thumb: string;
}

export interface MediaInterface {
  gateway: string;
  raw: string;
  content_type: string;
  cached: {
    originalUrl: string;
    bigSizeUrl: string;
    mediumSizeUrl: string;
    smallSizeUrl: string;
  };
}

export interface MetadataInterface {
  image: string;
  name: string;
  id: number;
  description: string;
  attributes: string[];
}
