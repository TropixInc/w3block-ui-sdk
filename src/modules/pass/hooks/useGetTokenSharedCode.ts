import { useQuery } from '@tanstack/react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { handleNetworkException } from '../../shared/utils/handleNetworkException';

/** Retries while a just-bought pass is still being minted (≈10 min with the 30 s cap). */
const WAIT_FOR_MINT_RETRIES = 24;
/** Retries for a shared link opened directly. */
const DEFAULT_RETRIES = 5;

/**
 * The pass API answers 404 "Share code 'x' not exists or its expired" for an
 * unknown or expired code. That answer is final: retrying cannot change it.
 */
export const isShareCodeNotFound = (error: unknown) => {
  const e = error as { statusCode?: number; message?: unknown } | undefined;
  return e?.statusCode === 404 && /share code/i.test(String(e?.message ?? ''));
};

/**
 * @param retry `true` keeps polling (capped) for a code whose token is still
 * being minted; a number is the retry count for other errors.
 */
export const useGetTokenSharedCode = (
  code: string,
  retry: boolean | number = DEFAULT_RETRIES
) => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();
  const maxRetries =
    retry === true
      ? WAIT_FOR_MINT_RETRIES
      : retry === false
      ? 0
      : Number(retry) || 0;

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
      retry: (failureCount, error) =>
        !isShareCodeNotFound(error) && failureCount < maxRetries,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
};
