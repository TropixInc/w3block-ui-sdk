import { TokenCollectionStatus } from '../../tokens/enums/TokenCollectionStatus';
import { DynamicFormConfiguration } from '../../tokens/interfaces/DynamicFormConfiguration';
import { TokenSubcategory } from '../../tokens/interfaces/TokenSubcategory';
import { Contract } from './Contract';

export interface TokenCollectionDTO {
  status: TokenCollectionStatus;
  contractId: string;
  subcategoryId: string;
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
