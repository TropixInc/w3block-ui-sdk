import { Product } from '../../storefront/hooks/useGetProductBySlug';
import { PixwayAPIRoutes } from '../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../enums/W3blockAPI';
import { Currency } from '../interfaces/Currency';
import { handleNetworkException } from '../utils/handleNetworkException';
import { useAxios } from './useAxios';
import { useCompanyConfig } from './useCompanyConfig';
import { usePrivateQuery } from './usePrivateQuery';
import { useProfile } from './useProfile';

export interface UserResaleResponse {
  items: {
    companyId: string;
    createdAt: string;
    customPrices: {
      amount: string;
      currencyId: string;
    }[];
    fixedMatch?: string;
    id: string;
    itemQuantity: string;
    keyCollectionEditionNumber?: string;
    keyCollectionId?: string;
    metadata?: string;
    ownerWalletAddress?: string;
    order: {
      createdAt: string;
      id: string;
      status: string;
      deliverId: string;
    };
    product: Product;
    productContractTokenId?: string;
    productId: string;
    resellerId: string;
    status: string;
    updatedAt: string;
    receipts: {
      currency: Currency;
      currencyId: string;
      fees: string;
      netValue: string;
      receiveDate: string;
      status: string;
      withdrawDate: string;
    }[];
  }[];
}

export const useGetUserResales = () => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { companyId } = useCompanyConfig();
  const profile = useProfile();

  return usePrivateQuery(
    [PixwayAPIRoutes.GET_USER_RESALE, companyId, profile?.data?.data?.id],
    async () => {
      try {
        const response = await axios.get<UserResaleResponse>(
          PixwayAPIRoutes.GET_USER_RESALE.replace(
            '{companyId}',
            companyId
          ).replace('{userId}', profile?.data?.data?.id ?? '')
        );
        return response;
      } catch (err) {
        console.error('Erro ao buscar integrações do usuário:', err);
        throw handleNetworkException(err);
      }
    },
    { refetchOnWindowFocus: false }
  );
};
