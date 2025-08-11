

import { PixwayAPIRoutes } from '../enums/PixwayAPIRoutes';
import { PixwayAppRoutes } from '../enums/PixwayAppRoutes';
import { W3blockAPI } from '../enums/W3blockAPI';


import { useMutation } from '@tanstack/react-query';
import { useGetW3blockIdSDK } from './useGetW3blockIdSDK';
import { useGetTenantInfoByHostname } from './useGetTenantInfoByHostname';
import { useRouterConnect } from './useRouterConnect';
import { usePrivateQuery } from './usePrivateQuery';
import { handleNetworkException } from '../utils/handleNetworkException';
import { useAxios } from './useAxios';
import { useCompanyConfig } from './useCompanyConfig';

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

export const useProfile = (): any => {
  const getW3blockIdSDK = useGetW3blockIdSDK();
  const { data: companyInfo } = useGetTenantInfoByHostname();
  const isPasswordless = companyInfo?.configuration?.passwordless?.enabled;

  const router = useRouterConnect();

  return usePrivateQuery(
    [PixwayAPIRoutes.GET_PROFILE],
    async () => {
      try {
        const sdk = await getW3blockIdSDK();
        return await sdk.api.users.getProfileByUserLogged();
      } catch (err) {
        console.error('Erro ao obter perfil do usuário:', err);
        throw handleNetworkException(err);
      }
    },
    {
      retry: 1,
      onError() {
        router.pushConnect(PixwayAppRoutes.SIGN_IN);
      },
      onSuccess(data) {
        if (data.data && !data.data.verified && !isPasswordless) {
          router.pushConnect(PixwayAppRoutes.VERIfY_WITH_CODE);
        }
      },
    }
  );
};

export const useProfileWithouRedirect = (): any => {
  const getW3blockIdSDK = useGetW3blockIdSDK();
  return usePrivateQuery(
    [PixwayAPIRoutes.GET_PROFILE],
    async () => {
      return (await getW3blockIdSDK()).api.users.getProfileByUserLogged();
    },
    {
      retry: 1,
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
