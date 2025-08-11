import { PixwayAPIRoutes } from "../enums/PixwayAPIRoutes";
import { W3blockAPI } from "../enums/W3blockAPI";
import { handleNetworkException } from "../utils/handleNetworkException";
import { useAxios } from "./useAxios";
import { useCompanyConfig } from "./useCompanyConfig";
import { usePrivateQuery } from "./usePrivateQuery";
import { useProfile } from "./useProfile";

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

export const useGetUserResaleSummary = () => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { companyId } = useCompanyConfig();
  const profile = useProfile();

  return usePrivateQuery(
    [
      PixwayAPIRoutes.GET_USER_RESALE_SUMMARY,
      companyId,
      profile?.data?.data?.id,
    ],
    async () => {
      try {
        const response = await axios.get<Response>(
          PixwayAPIRoutes.GET_USER_RESALE_SUMMARY.replace(
            '{companyId}',
            companyId
          ).replace('{userId}', profile?.data?.data?.id ?? '')
        );
        return response;
      } catch (err) {
        console.error('Erro ao buscar integrações do usuário:', err);
        throw handleNetworkException(err);
      }
    }
  );
};
