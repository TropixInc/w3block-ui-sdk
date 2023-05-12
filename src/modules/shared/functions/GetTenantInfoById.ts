import { getPublicAPI } from '../config/api';
import { PixwayAPIRoutes } from '../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../enums/W3blockAPI';
import { useGetApiUrl } from '../hooks/useGetApiUrl/useGetApiUrl';

export async function GetTenantInfoById(tenantId: string) {
  const baseUrl = useGetApiUrl(W3blockAPI.ID);

  return await getPublicAPI(baseUrl)
    .get(PixwayAPIRoutes.TENANT_INFO_BY_ID + `?tenantId=${tenantId}`)
    .then((data) => data.data)
    .catch((e) => e.response);
}
