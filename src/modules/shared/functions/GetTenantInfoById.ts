import { getPublicAPI } from '../config/api';
import { PixwayAPIRoutes } from '../enums/PixwayAPIRoutes';
import { getEnvVar } from '../utils/env';

export async function GetTenantInfoById(tenantId: string) {

  return await getPublicAPI(process.env.NEXT_PUBLIC_PIXWAY_ID_API_URL ?? "")
    .get(PixwayAPIRoutes.TENANT_INFO_BY_ID + `?tenantId=${tenantId}`)
    .then((data) => data.data)
    .catch((e) => e.response);
}
