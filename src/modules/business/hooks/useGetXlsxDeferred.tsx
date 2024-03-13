/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { cleanObject } from '../../shared/utils/validators';

export const useGetXlsxDeferred = (filter?: any, enabled?: boolean) => {
  const { companyId } = useCompanyConfig();
  const axios = useAxios(W3blockAPI.KEY);
  const cleaned = cleanObject(filter ?? {});
  const queryString = new URLSearchParams(cleaned).toString();
  return useQuery(
    [PixwayAPIRoutes.GET_DEFERRED_XLSX, queryString, companyId],
    () =>
      axios.get(
        PixwayAPIRoutes.GET_DEFERRED_XLSX.replace('{companyId}', companyId) +
          `?${queryString}&status=deferred&status=pending`,
        { responseType: 'blob' }
      ),
    {
      enabled: !!companyId && enabled,
    }
  );
};
