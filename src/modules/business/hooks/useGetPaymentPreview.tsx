import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';

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
  const data = useMutation((data: PaymentPreviewDTO) =>
    axios
      .patch(
        PixwayAPIRoutes.GET_LOYALTY_PREVIEW.replace('{companyId}', companyId),
        data
      )
      .then((res) => res.data)
  );
  return data;
};
