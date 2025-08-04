import { useMutation } from "@tanstack/react-query";
import { PixwayAPIRoutes } from "../enums/PixwayAPIRoutes";
import { W3blockAPI } from "../enums/W3blockAPI";
import { handleNetworkException } from "../utils/handleNetworkException";
import { useAxios } from "./useAxios";
import { useCompanyConfig } from "./useCompanyConfig";


interface Response {
  saleSummaryByCurrency: {
    currencyId: string;
    fees: string;
    netValue: string;
    pendingSplit: string;
    sales: string;
    totalValue: string;
    waitingWithdraw: string;
  }[];
}

export const useDeleteProductResale = () => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { companyId } = useCompanyConfig();

  return useMutation(
    [PixwayAPIRoutes.DELETE_PRODUCT_RESALE, companyId],
    async ({ productId }: { productId: string }) => {
      try {
        const response = await axios.delete<Response>(
          PixwayAPIRoutes.DELETE_PRODUCT_RESALE.replace(
            '{companyId}',
            companyId
          ).replace('{productId}', productId)
        );
        return response;
      } catch (err) {
        console.error('Erro ao buscar integrações do usuário:', err);
        throw handleNetworkException(err);
      }
    }
  );
};
