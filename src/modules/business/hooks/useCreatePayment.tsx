import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';

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

  const data = useMutation((data: CreatePaymentDTO) =>
    axios
      .patch(
        PixwayAPIRoutes.CREATE_LOYALTY_PAYMENT.replace(
          '{companyId}',
          companyId
        ),
        data
      )
      .then((res) => res.data)
  );
  return data;
};
