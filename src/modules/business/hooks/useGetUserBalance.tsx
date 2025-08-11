import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../shared/hooks/useAxios";
import { W3blockAPI } from "../../shared/enums/W3blockAPI";
import { useCompanyConfig } from "../../shared/hooks/useCompanyConfig";
import { PixwayAPIRoutes } from "../../shared/enums/PixwayAPIRoutes";
import { handleNetworkException } from "../../shared/utils/handleNetworkException";



export const useGetUserBalance = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return useMutation(async (userId: string) => {
    try {
      const response = await axios.get(
        PixwayAPIRoutes.GET_LOYALTY_USER_BALANCE.replace(
          '{companyId}',
          companyId ?? ''
        ).replace('{userId}', userId)
      );
      return response.data;
    } catch (err) {
      console.error('Erro ao buscar saldo do usuário:', err);
      throw handleNetworkException(err);
    }
  });
};
