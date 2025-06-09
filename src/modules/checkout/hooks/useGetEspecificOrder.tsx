import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';
import { handleNetworkException } from '../../shared/utils/handleNetworkException';

export const useGetEspecificOrder = (orderId: string, enabled: boolean) => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { companyId } = useCompanyConfig();

  return usePrivateQuery(
    [orderId, companyId, PixwayAPIRoutes.GET_SPECIFIC_ORDER],
    async () => {
      try {
        const response = await axios.get(
          PixwayAPIRoutes.GET_SPECIFIC_ORDER.replace(
            '{companyId}',
            companyId
          ).replace('{orderId}', orderId)
        );
        return response.data;
      } catch (error) {
        console.error('Erro ao obter o pedido específico:', error);
        throw handleNetworkException(error);
      }
    },
    { enabled: Boolean(orderId) && enabled && Boolean(companyId) }
  );
};
