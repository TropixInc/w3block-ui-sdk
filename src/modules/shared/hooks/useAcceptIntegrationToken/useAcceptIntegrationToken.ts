import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
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
    const res = await axios.post<Response>(
      PixwayAPIRoutes.ACCEPT_INTEGRATION_TOKEN.replace('{tenantId}', tenantId),
      { token }
    );
    return res.data;
  };

  return useMutation(_acceptIntegrationToken);
};
