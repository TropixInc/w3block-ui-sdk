import { useQuery } from 'react-query';

import { ErcTokenHistoryInterfaceResponse } from '../../dashboard/interface/ercTokenHistoryInterface';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { cleanObject } from '../../shared/utils/validators';

export const useGetDeferredByUserId = (userId: string, filter?: any) => {
  const { companyId } = useCompanyConfig();
  const axios = useAxios(W3blockAPI.KEY);
  const cleaned = cleanObject(filter ?? {});
  const queryString = new URLSearchParams(cleaned).toString();
  return useQuery(
    [PixwayAPIRoutes.GET_DEFERRED_BY_USER_ID, queryString, companyId],
    (): Promise<ErcTokenHistoryInterfaceResponse> =>
      axios
        .get(
          PixwayAPIRoutes.GET_DEFERRED_BY_USER_ID.replace(
            '{companyId}',
            companyId
          ).replace('{userId}', userId) + `?${queryString}`
        )
        .then((res) => res?.data),
    {
      enabled: !!userId && !!companyId,
    }
  );
};
