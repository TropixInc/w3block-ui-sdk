import { UserRoleEnum, WalletStatus, WalletTypes } from '@w3block/sdk-id';
import { PixwayAPIRoutes } from '../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../enums/W3blockAPI';
import { handleNetworkException } from '../utils/handleNetworkException';
import { useAxios } from './useAxios';
import { useCompanyConfig } from './useCompanyConfig';
import { usePrivateQuery } from './usePrivateQuery';


interface Wallet {
  id: string;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  address: string;
  ownerId: string;
  type: WalletTypes;
  status: WalletStatus;
}

export interface UserDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  roles: UserRoleEnum[];
  addressId?: string;
  name: string;
  email: string;
  phone?: string;
  verifiedEmailAt: string;
  i18nLocale: string;
  mainWalletId: string;
  mainWallet: Wallet;
  wallets: Wallet[];
  verified: boolean;
}

interface iParams {
  page?: string;
  limit?: number;
  search?: string;
  sortBy?: string;
  orderBy?: string;
  role?: UserRoleEnum;
}

export const useGetUserByTenant = ({
  params,
  enabled,
}: {
  params?: iParams;
  enabled?: boolean;
}) => {
  const axios = useAxios(W3blockAPI.ID);
  const { companyId } = useCompanyConfig();

  if (params?.limit && params.limit > 50) {
    console.error('Error params: Limit must not be greater than 50');
  }

  return usePrivateQuery(
    [PixwayAPIRoutes.CONTACT_BY_TENANT, params?.search],
    async () => {
      try {
        const response = await axios.get<{ items: UserDto[] }>(
          PixwayAPIRoutes.CONTACT_BY_TENANT.replace(
            '{companyId}',
            companyId ?? ''
          ),
          { params }
        );

        return response;
      } catch (err) {
        console.error('Erro ao buscar usuários por tenant:', err);

        throw handleNetworkException(err);
      }
    },
    { enabled }
  );
};
