

import { useQuery } from '@tanstack/react-query';
import { ErcTokenHistoryInterfaceResponse } from '../../dashboard/interface/ercTokenHistoryInterface';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useProfileWithKYC } from '../../shared/hooks/useProfileWithKYC';

import { handleNetworkException } from '../../shared/utils/handleNetworkException';
import { cleanObject } from '../../shared/utils/validators';
import { useLoyaltiesInfo } from './useLoyaltiesInfo';

export const useGetAllReportsByOperatorId = (filter: any) => {
  const { profile } = useProfileWithKYC();
  const { loyalties } = useLoyaltiesInfo();
  const { companyId } = useCompanyConfig();
  const axios = useAxios(W3blockAPI.KEY);
  const cleaned = cleanObject(filter ?? {});
  const queryString = new URLSearchParams(cleaned).toString();

  return useQuery<ErcTokenHistoryInterfaceResponse>(
    [PixwayAPIRoutes.GET_ERC_TOKENS_BY_LOYALTY_ID_BY_OPERATOR_ID, queryString],
    async (): Promise<ErcTokenHistoryInterfaceResponse> => {
      try {
        const response = await axios.get(
          PixwayAPIRoutes.GET_ERC_TOKENS_BY_LOYALTY_ID_BY_OPERATOR_ID.replace(
            '{companyId}',
            companyId
          )
            .replace(
              '{loyaltyId}',
              loyalties.length > 0 ? loyalties[0].contractId : ''
            )
            .replace('{operatorId}', profile?.id ?? '') + `?${queryString}`
        );
        return response.data;
      } catch (err) {
        console.error('Erro ao buscar relatórios por operador:', err);
        throw handleNetworkException(err);
      }
    },
    {
      enabled:
        loyalties.length > 0 &&
        loyalties[0].contractId != undefined &&
        profile?.roles.includes('loyaltyOperator') &&
        !!companyId &&
        !!profile?.id,
    }
  );
};
