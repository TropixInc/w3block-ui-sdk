import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { useGetW3blockIdSDK } from '../useGetW3blockIdSDK';
import { usePrivateQuery } from '../usePrivateQuery';

export interface Wallet {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  address: string;
  ownerId: string;
  type: string;
  status: string;
}

export const useProfile = () => {
  const getW3blockIdSDK = useGetW3blockIdSDK();
  return usePrivateQuery([PixwayAPIRoutes.GET_PROFILE], async () => {
    return (await getW3blockIdSDK()).api.users.getProfileByUserLogged();
  });
};
