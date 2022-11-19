import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';
import { useGetW3blockIdSDK } from '../useGetW3blockIdSDK';
import { usePrivateQuery } from '../usePrivateQuery';
import { useRouterPushConnect } from '../useRouterPushConnect';

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
  const router = useRouterPushConnect();
  return usePrivateQuery(
    [PixwayAPIRoutes.GET_PROFILE],
    async () => {
      return (await getW3blockIdSDK()).api.users.getProfileByUserLogged();
    },
    {
      retry: 1,
      onError() {
        router.push(PixwayAppRoutes.SIGN_IN);
      },
    }
  );
};

export const usePatchProfile = () => {
  const axios = useAxios(W3blockAPI.ID);
  const { companyId } = useCompanyConfig();

  const _patchProfile = (name: string) => {
    return axios.patch(
      PixwayAPIRoutes.PATCH_PROFILE.replace('{companyId}', companyId),
      { name }
    );
  };

  const patchProfile = useMutation(_patchProfile);

  return patchProfile;
};
