import { getSecureApi } from '../../../shared/config/api';
import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { SaveDraftPayload, SaveDraftResponse } from '../postSaveDraft';

export const putEditDraft = (
  token: string,
  tokenId: string,
  companyId: string,
  payload: SaveDraftPayload
) => {
  return getSecureApi(token, '').put<SaveDraftResponse>(
    `${PixwayAPIRoutes.TOKEN_COLLECTIONS.replace(
      '{companyId}',
      companyId
    )}/${tokenId}`,
    payload
  );
};
