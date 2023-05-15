import { getPublicAPI } from '../config/api';
import { PixwayAPIRoutes } from '../enums/PixwayAPIRoutes';

export async function GetTenantInfoById(tenantId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_PIXWAY_ID_API_URL ?? '';

  return await getPublicAPI(baseUrl)
    .get(PixwayAPIRoutes.TENANT_INFO_BY_ID + `?tenantId=${tenantId}`)
    .then((data) => data.data)
    .catch((e) => e.response);
}
