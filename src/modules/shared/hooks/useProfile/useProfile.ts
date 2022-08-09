import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { Roles } from '../../enums/Roles';
import useAxios from '../useAxios/useAxios';
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

interface GetProfileAPIResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  role: Roles;
  addressId: string;
  name: string;
  email: string;
  verifiedEmailAt: string;
  i18nLocale: 'en' | 'pt-br';
  mainWalletId: string;
  address?: {
    id: string;
    createdAt: string;
    updatedAt: string;
    street: string;
    number: number;
    district: string;
    complement: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    coordinates: string;
  };
  mainWallet?: Wallet;
  wallets: Array<Wallet>;
}

export const useProfile = () => {
  const axios = useAxios();

  return usePrivateQuery([PixwayAPIRoutes.GET_PROFILE], () =>
    axios.get<GetProfileAPIResponse>(PixwayAPIRoutes.GET_PROFILE)
  );
};
