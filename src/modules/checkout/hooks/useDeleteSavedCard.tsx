import { useMutation } from 'react-query';

import { useProfile } from '../../shared';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';

export const useDeleteSavedCard = () => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { companyId } = useCompanyConfig();
  const { data: profile } = useProfile();
  const userId = profile?.data?.id;

  const _deleteSavedCard = (id: string) => {
    return axios.delete(
      PixwayAPIRoutes.DELETE_SAVED_CARDS.replace('{companyId}', companyId)
        .replace('{userId}', userId ?? '')
        .replace('{creditCardId}', id)
    );
  };

  return useMutation(_deleteSavedCard);
};
