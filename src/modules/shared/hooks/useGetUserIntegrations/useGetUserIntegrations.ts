import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { handleNetworkException } from '../../utils/handleNetworkException';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';
import { IntegrationResponse } from '../useGetAvailableIntegrations';
import { usePrivateQuery } from '../usePrivateQuery';

interface UserIntegrationsResponse {
  items: IntegrationResponse[];
}

interface Response {
  data: UserIntegrationsResponse;
}

export const useGetUserIntegrations = () => {
  const axios = useAxios(W3blockAPI.ID);
  const { companyId } = useCompanyConfig();

  return usePrivateQuery<Response>(
    [PixwayAPIRoutes.USER_INTEGRATIONS, companyId],
    async () => {
      try {
        const response = await axios.get(
          PixwayAPIRoutes.USER_INTEGRATIONS.replace('{tenantId}', companyId)
        );
        return response;
      } catch (err) {
        console.error('Erro ao buscar integrações do usuário:', err);
        throw handleNetworkException(err);
      }
    }
  );
};
