import { useProfile } from '../../shared';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';

interface SavedCardsResponse {
  name: string;
  brand: string;
  lastNumbers: string;
  createdAt: string;
  id: string;
}

interface Response {
  items: SavedCardsResponse[];
}

export const useGetSavedCards = () => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { companyId } = useCompanyConfig();
  const { data: profile } = useProfile();
  const userId = profile?.data?.id;
  return usePrivateQuery(
    [userId, companyId, PixwayAPIRoutes.GET_SAVED_CARDS],
    () => {
      return axios.get<Response>(
        PixwayAPIRoutes.GET_SAVED_CARDS.replace(
          '{companyId}',
          companyId
        ).replace('{userId}', userId ?? '')
      );
    },
    { enabled: !!userId }
  );
};
