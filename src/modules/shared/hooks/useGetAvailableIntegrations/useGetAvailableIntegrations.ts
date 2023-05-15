import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';
import { usePrivateQuery } from '../usePrivateQuery';

export interface IntegrationResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  fromTenantId: string;
  toTenantId: string;
  requestedAt: string;
  acceptedAt: string;
  rejectedAt: string;
  status: string;
  reason: string;
}

interface Response {
  data: IntegrationResponse[];
}

export const useGetAvailableIntegrations = () => {
  const axios = useAxios(W3blockAPI.ID);
  const { companyId } = useCompanyConfig();

  return usePrivateQuery<Response>(
    PixwayAPIRoutes.GET_AVAILABLE_INTEGRATIONS,
    () =>
      axios.get(
        PixwayAPIRoutes.GET_AVAILABLE_INTEGRATIONS.replace(
          '{tenantId}',
          companyId
        )
      )
  );
};
