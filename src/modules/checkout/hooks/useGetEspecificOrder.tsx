import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';

export const useGetEspecificOrder = (orderId: string, enabled: boolean) => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { companyId } = useCompanyConfig();
  return usePrivateQuery(
    [orderId, companyId, PixwayAPIRoutes.GET_SPECIFIC_ORDER],
    () => {
      return axios.get(
        PixwayAPIRoutes.GET_SPECIFIC_ORDER.replace(
          '{companyId}',
          companyId
        ).replace('{orderId}', orderId)
      );
    },
    { enabled: Boolean(orderId) && enabled && Boolean(companyId) }
  );
};
