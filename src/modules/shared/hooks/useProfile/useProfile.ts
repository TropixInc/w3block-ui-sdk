import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';
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

export const usePatchProfile = () => {
  const axios = useAxios(W3blockAPI.ID);
  const { companyId } = useCompanyConfig();

  const patchProfile = (name: string) => {
    return axios.patch(
      PixwayAPIRoutes.PATCH_PROFILE.replace('{companyId}', companyId),
      { name }
    );
  };

  return patchProfile;
};
