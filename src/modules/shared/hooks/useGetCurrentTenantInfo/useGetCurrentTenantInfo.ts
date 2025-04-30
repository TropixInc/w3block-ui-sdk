import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { handleNetworkException } from '../../utils/handleNetworkException';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';
import { IcompanyInfo } from '../useGetTenantInfoById';

export function useGetCurrentTenantInfo() {
  const axios = useAxios(W3blockAPI.ID);
  const { companyId: tenantId } = useCompanyConfig();

  return useQuery(
    [PixwayAPIRoutes.TENANT_INFO_BY_ID, tenantId],
    async (): Promise<IcompanyInfo> => {
      try {
        const info = await axios.get(PixwayAPIRoutes.TENANT_INFO_BY_ID, {
          params: { tenantId },
        });
        return info.data;
      } catch (err) {
        console.error('Erro ao obter informações do tenant:', err);
        throw handleNetworkException(err);
      }
    },
    { enabled: tenantId != undefined && tenantId != '' }
  );
}
