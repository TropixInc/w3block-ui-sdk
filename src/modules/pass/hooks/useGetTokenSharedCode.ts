import { useQuery } from 'react-query';
import { RetryValue } from 'react-query/types/core/retryer';

import { W3blockAPI } from '../../shared';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';

export const useGetTokenSharedCode = (
  code: string,
  retry: RetryValue<unknown> | undefined
) => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return useQuery(
    [PixwayAPIRoutes.TOKEN_PASS_SHARE_CODE, code, tenantId],
    () =>
      axios
        .get(
          PixwayAPIRoutes.TOKEN_PASS_SHARE_CODE.replace(
            '{tenantId}',
            tenantId
          ).replace('{code}', code)
        )
        .then((res) => res.data),
    {
      enabled: Boolean(tenantId && code),
      retry: retry,
    }
  );
};
