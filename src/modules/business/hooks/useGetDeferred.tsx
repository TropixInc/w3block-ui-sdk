/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'react-query';

import { ErcTokenHistoryInterfaceResponse } from '../../dashboard/interface/ercTokenHistoryInterface';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { cleanObject } from '../../shared/utils/validators';

export const useGetDeferred = (
  filter?: any,
  enabled?: boolean,
  status?: string
) => {
  const { companyId } = useCompanyConfig();
  const axios = useAxios(W3blockAPI.KEY);
  const cleaned = cleanObject(filter ?? {});
  const queryString = new URLSearchParams(cleaned).toString();
  const statusQuery = () => {
    if (status === 'all')
      return 'status=deferred&status=pending&status=started&status=success';
    else if (status === 'success') return 'status=success';
    else return 'status=deferred&status=pending&status=started';
  };
  return useQuery(
    [PixwayAPIRoutes.GET_DEFERRED, queryString, companyId, status],
    (): Promise<ErcTokenHistoryInterfaceResponse> =>
      axios
        .get(
          PixwayAPIRoutes.GET_DEFERRED.replace('{companyId}', companyId) +
            `?${queryString}&${statusQuery()}`
        )
        .then((res) => res?.data),
    {
      enabled: !!companyId && enabled,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
};
