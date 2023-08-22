import { useQuery } from 'react-query';

import { ErcTokenHistoryInterfaceResponse } from '../../dashboard/interface/ercTokenHistoryInterface';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useProfileWithKYC } from '../../shared/hooks/useProfileWithKYC/useProfileWithKYC';
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
    (): Promise<ErcTokenHistoryInterfaceResponse> =>
      axios
        .get(
          PixwayAPIRoutes.GET_ERC_TOKENS_BY_LOYALTY_ID_BY_OPERATOR_ID.replace(
            '{companyId}',
            companyId
          )
            .replace(
              '{loyaltyId}',
              loyalties.length > 0 ? loyalties[0].contractId : ''
            )
            .replace('{operatorId}', profile?.id ?? '') + `?${queryString}`
        )
        .then((res) => res.data),
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
