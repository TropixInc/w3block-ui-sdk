import { useMutation } from "@tanstack/react-query";
import { PixwayAPIRoutes } from "../../shared/enums/PixwayAPIRoutes";
import { W3blockAPI } from "../../shared/enums/W3blockAPI";
import { useAxios } from "../../shared/hooks/useAxios";
import { useCompanyConfig } from "../../shared/hooks/useCompanyConfig";
import { handleNetworkException } from "../../shared/utils/handleNetworkException";


export interface CreatePaymentDTO {
  loyaltyId: string;
  amount: string;
  points: string;
  userId: string;
  userCode: string;
  description: string;
}

export const useCreatePayment = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return useMutation(async (data: CreatePaymentDTO) => {
    try {
      const response = await axios.patch(
        PixwayAPIRoutes.CREATE_LOYALTY_PAYMENT.replace(
          '{companyId}',
          companyId ?? ''
        ),
        data
      );
      return response.data;
    } catch (err) {
      console.error('Erro ao criar pagamento:', err);
      throw handleNetworkException(err);
    }
  });
};
