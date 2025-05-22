import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { Currency } from '../../interface';
import { handleNetworkException } from '../../utils/handleNetworkException';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';
import { usePrivateQuery } from '../usePrivateQuery';
import { useProfile } from '../useProfile';

interface Response {
  items: {
    id: string;
    resellerId: string;
    prices: {
      amount: string;
      currencyId: string;
    }[];
    tokenData: {
      amount: string;
      currency: Currency;
      currencyId: string;
    };
  }[];
}

export const useGetUserForSaleErc20 = (enabled?: boolean) => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { companyId } = useCompanyConfig();
  const profile = useProfile();

  return usePrivateQuery(
    [
      PixwayAPIRoutes.GET_USER_FORSALE_ERC20,
      companyId,
      profile?.data?.data?.id,
    ],
    async () => {
      try {
        const response = await axios.get<Response>(
          PixwayAPIRoutes.GET_USER_FORSALE_ERC20.replace(
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
    {
      enabled:
        enabled &&
        profile?.data?.data?.id !== '' &&
        profile?.data?.data?.id !== undefined,
    }
  );
};
