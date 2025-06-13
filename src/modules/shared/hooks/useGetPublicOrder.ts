import { useQuery } from "@tanstack/react-query";
import { PixwayAPIRoutes } from "../enums/PixwayAPIRoutes";
import { W3blockAPI } from "../enums/W3blockAPI";
import { handleNetworkException } from "../utils/handleNetworkException";
import { useAxios } from "./useAxios";
import { useCompanyConfig } from "./useCompanyConfig";


export const useGetPublicOrder = (deliverId: string, enabled?: boolean) => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { companyId } = useCompanyConfig();

  return useQuery(
    [PixwayAPIRoutes.PUBLIC_ORDER_BY_DELIVERID, companyId, deliverId],
    async () => {
      try {
        const response = await axios.get(
          PixwayAPIRoutes.PUBLIC_ORDER_BY_DELIVERID.replace(
            '{companyId}',
            companyId
          ).replace('{deliverId}', deliverId)
        );
        return response;
      } catch (err) {
        console.error('Erro ao buscar pedido público:', err);
        throw handleNetworkException(err);
      }
    },
    {
      enabled: !!deliverId && enabled,
      retry: false,
    }
  );
};
