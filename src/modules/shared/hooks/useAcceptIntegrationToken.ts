import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { handleNetworkException } from '../../utils/handleNetworkException';
import { useAxios } from '../useAxios';

interface Response {
  token: string;
  payload: {
    expiresAt: string;
    fromTenantId: string;
    toTenantId: string;
    userId: string;
  };
}

interface Params {
  token: string;
  tenantId: string;
}

export const useAcceptIntegrationToken = () => {
  const axios = useAxios(W3blockAPI.ID);

  const _acceptIntegrationToken = async ({ token, tenantId }: Params) => {
    try {
      const res = await axios.post<Response>(
        PixwayAPIRoutes.ACCEPT_INTEGRATION_TOKEN.replace(
          '{tenantId}',
          tenantId
        ),
        { token }
      );
      return res.data;
    } catch (err) {
      console.error('Erro ao aceitar o token de integração:', err);
      throw handleNetworkException(err);
    }
  };

  return useMutation(_acceptIntegrationToken);
};
