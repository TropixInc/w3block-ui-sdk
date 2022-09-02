import { getSecureApi } from '../../../shared/config/api';
import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { DynamicFormConfiguration } from '../../interfaces/DynamicFormConfiguration';

export interface SaveDraftPayload {
  contractId?: string;
  subcategoryId: string;
  name: string;
  description?: string;
  mainImage?: string;
  tokenData: Record<string, any>;
  quantity: number;
  initialQuantityToMint: number;
  rfids: Array<string>;
}

export interface SaveDraftResponse {
  tokenCollectionStatus: string;
  contractId: string | null;
  subcategoryId: string;
  tokenData: Record<string, any>;
  publishedTokenTemplate: null | DynamicFormConfiguration;
  deletedAt: null | string;
  id: string;
  createdAt: string;
  updatedAt: string;
  quantity: number;
  initialQuantityToMint: number;
}

export const postSaveDraft = (
  token: string,
  companyId: string,
  body: SaveDraftPayload
) => {
  return getSecureApi(token, '').post<SaveDraftResponse>(
    PixwayAPIRoutes.TOKEN_COLLECTIONS.replace('{companyId}', companyId),
    body
  );
};
