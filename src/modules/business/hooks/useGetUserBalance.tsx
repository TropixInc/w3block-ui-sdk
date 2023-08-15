import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';

export const useGetUserBalance = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  const getUserBalance = useMutation((userId: string) =>
    axios
      .get(
        PixwayAPIRoutes.GET_LOYALTY_USER_BALANCE.replace(
          '{companyId}',
          companyId
        ).replace('{userId}', userId)
      )
      .then((res) => res.data[0])
  );
  return getUserBalance;
};
