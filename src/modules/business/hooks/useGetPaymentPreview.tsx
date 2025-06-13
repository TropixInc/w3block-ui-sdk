
import { useMutation } from '@tanstack/react-query';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { handleNetworkException } from '../../shared/utils/handleNetworkException';

export interface PaymentPreviewDTO {
  loyaltyId: string;
  amount: string;
  points: string;
  userId: string;
  userCode: string;
}
export const useGetPaymentPreview = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return useMutation(async (data: PaymentPreviewDTO) => {
    try {
      const response = await axios.patch(
        PixwayAPIRoutes.GET_LOYALTY_PREVIEW.replace(
          '{companyId}',
          companyId ?? ''
        ),
        data
      );
      return response.data;
    } catch (err) {
      console.error('Erro ao obter pré-visualização do pagamento:', err);
      throw handleNetworkException(err);
    }
  });
};
