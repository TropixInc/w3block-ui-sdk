import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
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

  return usePrivateQuery<Response>(PixwayAPIRoutes.USER_INTEGRATIONS, () =>
    axios.get(
      PixwayAPIRoutes.USER_INTEGRATIONS.replace('{tenantId}', companyId)
    )
  );
};
