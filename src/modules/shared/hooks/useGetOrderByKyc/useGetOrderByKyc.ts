import { useMutation } from 'react-query';

import { PaymentsEntity } from '../../../dashboard/interface/ercTokenHistoryInterface';
import { W3blockAPI } from '../../enums';
import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { Product } from '../../interface';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';
import { UserDto } from '../useGetUsersByTenant';

interface Response {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  company: any;
  userId: string;
  user: UserDto;
  destinationWalletAddress: string;
  addressId: string;
  address: any;
  status: string;
  deliverDate: string;
  expiresIn: string;
  deliverId: string;
  products: Product[];
  payments: PaymentsEntity[];
}

export const useGetOrderByKyc = () => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { companyId } = useCompanyConfig();
  return useMutation(
    [PixwayAPIRoutes.GET_ODER_BY_KYC],
    ({ kycUserContextId }: { kycUserContextId: string }) =>
      axios.get<Response>(
        PixwayAPIRoutes.GET_ODER_BY_KYC.replace(
          '{companyId}',
          companyId
        ).replace('{kycUserContextId}', kycUserContextId) +
          '?fetchNewestStatus=true'
      )
  );
};
