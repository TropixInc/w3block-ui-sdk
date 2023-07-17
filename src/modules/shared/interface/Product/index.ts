import {
  CurrencyResponse,
  Variants,
} from '../../../storefront/hooks/useGetProductBySlug/useGetProductBySlug';

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
    currencyId: string;
    anchorCurrencyId?: string;
    originalAmount?: string;
  }[];
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
