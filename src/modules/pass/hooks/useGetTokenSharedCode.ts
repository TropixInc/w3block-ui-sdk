import { useQuery } from 'react-query';
import { RetryValue } from 'react-query/types/core/retryer';

import { W3blockAPI } from '../../shared';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { handleNetworkException } from '../../shared/utils/handleNetworkException';

export const useGetTokenSharedCode = (
  code: string,
  retry: RetryValue<unknown> | undefined
) => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return useQuery(
    [PixwayAPIRoutes.TOKEN_PASS_SHARE_CODE, code, tenantId],
    async () => {
      try {
        const response = await axios.get(
          PixwayAPIRoutes.TOKEN_PASS_SHARE_CODE.replace(
            '{tenantId}',
            tenantId
          ).replace('{code}', code)
        );
        return response.data;
      } catch (err) {
        console.error('Erro ao buscar o código compartilhado do token:', err);
        throw handleNetworkException(err);
      }
    },
    {
      enabled: Boolean(tenantId && code),
      retry: retry,
    }
  );
};
