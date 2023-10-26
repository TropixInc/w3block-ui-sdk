import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';
import { IcompanyInfo } from '../useGetTenantInfoById';

export function useGetCurrentTenantInfo() {
  const axios = useAxios(W3blockAPI.ID);
  const { companyId: tenantId } = useCompanyConfig();

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
