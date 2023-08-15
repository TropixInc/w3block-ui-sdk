import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useProfileWithKYC } from '../../shared/hooks/useProfileWithKYC/useProfileWithKYC';
import { LoyaltyInterface } from '../interface/loyalty';

export const useGetCompanyLoyalties = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const { profile } = useProfileWithKYC();
  const { companyId } = useCompanyConfig();

  return useQuery(
    [PixwayAPIRoutes.GET_COMPANY_LOYALTIES, companyId, profile?.id],
    (): Promise<LoyaltyInterface[]> =>
      axios
        .get(
          PixwayAPIRoutes.GET_COMPANY_LOYALTIES.replace(
            '{companyId}',
            companyId
          ) + '?limit=49'
        )
        .then((res) => res.data.items),
    {
      enabled:
        profile?.id != null &&
        companyId != null &&
        (profile.roles.includes('superAdmin') ||
          profile.roles.includes('admin') ||
          profile.roles.includes('loyaltyOperator')),
    }
  );
};
