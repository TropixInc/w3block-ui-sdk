import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../../shared/hooks/usePrivateQuery';
import { TokenCollectionDTO } from '../../interfaces/TokenCollectionDTO';

export const useTokenCollectionById = (tokenId: string) => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return usePrivateQuery(
    [PixwayAPIRoutes.TOKEN_COLLECTION_BY_ID, tokenId],
    () =>
      axios.get<TokenCollectionDTO>(
        PixwayAPIRoutes.TOKEN_COLLECTION_BY_ID.replace('{id}', tokenId).replace(
          '{companyId}',
          companyId ?? ''
        )
      ),
    {
      enabled: Boolean(tokenId) && Boolean(companyId),
    }
  );
};
