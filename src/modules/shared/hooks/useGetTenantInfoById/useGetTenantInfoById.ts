import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { useAxios } from '../useAxios';

interface HostInfo {
  hostname: string;
  isMain: true;
}

export interface IcompanyInfo {
  id: string;
  name: string;
  info: unknown;
  hosts: HostInfo[];
}

export function useGetTenantInfoById(tenantId: string) {
  const axios = useAxios(W3blockAPI.ID);

  return useQuery(
    PixwayAPIRoutes.TENANT_INFO_BY_ID,
    async (): Promise<IcompanyInfo> => {
      const info = await axios.get(PixwayAPIRoutes.TENANT_INFO_BY_ID, {
        params: { tenantId },
      });
      return info.data;
    },
    { enabled: tenantId != undefined && tenantId != '' }
  );
}
