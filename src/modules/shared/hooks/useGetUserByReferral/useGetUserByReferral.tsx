import { useQuery } from 'react-query';

import { W3blockAPI } from '../../enums';
import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';

export const useGetUserByReferral = (referralCode?: string) => {
  const axios = useAxios(W3blockAPI.ID);
  const { companyId } = useCompanyConfig();

  const getUserByReferral = useQuery(
    [PixwayAPIRoutes.GET_USER_BY_REFERRAL, referralCode],
    () =>
      axios
        .get(
          PixwayAPIRoutes.GET_USER_BY_REFERRAL.replace(
            '{companyId}',
            companyId
          ).replace('{referralCode}', referralCode ?? '')
        )
        .then((res) => res.data),
    { enabled: typeof referralCode === 'string', retry: 2 }
  );
  return getUserByReferral;
};
