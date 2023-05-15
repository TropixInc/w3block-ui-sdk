import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';

interface Response {
  token: string;
  payload: {
    expiresAt: string;
    fromTenantId: string;
    toTenantId: string;
    userId: string;
  };
}

export const useCreateIntegrationToken = () => {
  const axios = useAxios(W3blockAPI.ID);
  const { companyId: tenantId } = useCompanyConfig();

  const _createIntegrationToken = async (toTenantId: string) => {
    const res = await axios.post<Response>(
      PixwayAPIRoutes.CREATE_INTEGRATION_TOKEN.replace('{tenantId}', tenantId),
      { toTenantId }
    );
    return res.data;
  };

  return useMutation(_createIntegrationToken);
};
