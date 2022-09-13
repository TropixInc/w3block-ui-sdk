import { TokenCollectionStatus } from '../enums/TokenCollectionStatus';
import { Contract } from './Contract';
import { DynamicFormConfiguration } from './DynamicFormConfiguration';
import { TokenSubcategory } from './TokenSubcategory';

export interface TokenCollectionDTO {
  status: TokenCollectionStatus;
  contractId: string;
  subcategoryId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tokenData: Record<string, any>;
  publishedTokenTemplate: null | DynamicFormConfiguration;
  deletedAt: null | string;
  id: string;
  createdAt: string;
  updatedAt: string;
  quantity: number;
  initialQuantityToMint: number;
  quantityMinted: number;
  name?: string;
  description?: string;
  mainImage?: string;
  contract: Contract;
  subcategory: TokenSubcategory;
  rfids: Array<string>;
  ownerAddress: string;
}
