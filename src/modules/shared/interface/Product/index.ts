import { Price } from '../Price';

export interface Product {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  communityId: string;
  name: string;
  description: string;
  images: unknown[];
  prices: Price[];
  distributionType: string;
  pricingType: string;
  contractAddress: string;
  chainId: number;
  startSaleAt: string;
  endSaleAt: string;
  stockAmount: number;
  tokensAmount: number;
}
