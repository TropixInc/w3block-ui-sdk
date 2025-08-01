/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation } from '@tanstack/react-query';
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
    (params?: any) => {
      const cleaned = cleanObject(params.filter ?? {});
      const queryString = new URLSearchParams(cleaned).toString();
      const status = () => {
        if (params.status === 'scheduled') {
          return 'status=deferred&status=pending&status=started&status=pool&status=success&withdrawBlockedOnly=true';
        } else if (params.status === 'received') {
          return 'status=deferred&status=pending&status=started&status=pool&status=success&withdrawBlockedOnly=false';
        }
        return 'status=deferred&status=pending&status=started&status=pool&status=success';
      };
      return axios.get(
        PixwayAPIRoutes.GET_DEFERRED_XLSX.replace('{companyId}', companyId) +
          `?${queryString}&${status()}`,
        { responseType: 'blob' }
      );
    }
  );
};
