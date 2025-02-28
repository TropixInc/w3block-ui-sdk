import { useQuery } from 'react-query';

import { ErcTokenHistoryInterfaceResponse } from '../../dashboard/interface/ercTokenHistoryInterface';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useProfileWithKYC } from '../../shared/hooks/useProfileWithKYC/useProfileWithKYC';
import { handleNetworkException } from '../../shared/utils/handleNetworkException';
import { cleanObject } from '../../shared/utils/validators';
import { useLoyaltiesInfo } from './useLoyaltiesInfo';

export const useGetAllReportsAdmin = (filter: any) => {
  const { profile } = useProfileWithKYC();
  const { loyalties } = useLoyaltiesInfo();
  const { companyId } = useCompanyConfig();
  const axios = useAxios(W3blockAPI.KEY);
  const cleaned = cleanObject(filter ?? {});
  const queryString = new URLSearchParams(cleaned).toString();

  return useQuery(
    [
      PixwayAPIRoutes.GET_ERC_TOKENS_BY_LOYALTY_ID_ADMIN,
      queryString,
      companyId,
    ],
    async (): Promise<ErcTokenHistoryInterfaceResponse> => {
      try {
        const response = await axios.get(
          PixwayAPIRoutes.GET_ERC_TOKENS_BY_LOYALTY_ID_ADMIN.replace(
            '{companyId}',
            companyId
          ).replace('{loyaltyId}', loyalties[0].contractId) + `?${queryString}`
        );
        return response.data;
      } catch (err) {
        console.error('Erro ao buscar relatórios de admin:', err);
        throw handleNetworkException(err);
      }
    },
    {
      enabled:
        loyalties.length > 0 &&
        loyalties[0].contractId != undefined &&
        (profile?.roles.includes('admin') ||
          profile?.roles.includes('superAdmin')) &&
        !!companyId,
    }
  );
};
