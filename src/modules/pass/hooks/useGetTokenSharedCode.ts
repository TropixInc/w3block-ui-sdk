
import { useQuery } from '@tanstack/react-query';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { handleNetworkException } from '../../shared/utils/handleNetworkException';


export const useGetTokenSharedCode = (
  code: string,
  retry: any
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
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
};
