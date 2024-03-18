/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { cleanObject } from '../../shared/utils/validators';

export const useGetXlsxDeferred = () => {
  const { companyId } = useCompanyConfig();
  const axios = useAxios(W3blockAPI.KEY);

  return useMutation(
    [PixwayAPIRoutes.GET_DEFERRED_XLSX, companyId],
    (filter?: any) => {
      const cleaned = cleanObject(filter ?? {});
      const queryString = new URLSearchParams(cleaned).toString();
      return axios.get(
        PixwayAPIRoutes.GET_DEFERRED_XLSX.replace('{companyId}', companyId) +
          `?${queryString}&status=deferred&status=pending`,
        { responseType: 'blob' }
      );
    }
  );
};
