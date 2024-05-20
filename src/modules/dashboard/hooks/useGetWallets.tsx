import { useQuery } from 'react-query';

import { AxiosResponse } from 'axios';

import { Wallet, WalletSimple, useProfile } from '../../shared';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useIsProduction } from '../../shared/hooks/useIsProduction';

export const useGetWallets = () => {
  const { companyId } = useCompanyConfig();
  const profile = useProfile();
  const isProduction = useIsProduction();
  const axios = useAxios(W3blockAPI.ID);
  return useQuery(
    [PixwayAPIRoutes.GET_WALLETS, companyId, profile?.data?.data.id],
    () => {
      return axios
        .get(
          PixwayAPIRoutes.GET_WALLETS.replace('{companyId}', companyId).replace(
            '{userId}',
            profile?.data?.data.id ?? ''
          )
        )
        .then((res: AxiosResponse<Array<Wallet>>): Array<WalletSimple> => {
          const wallets: Array<WalletSimple> = [];
          res.data.map((wallet) => {
            wallets.push({
              id: wallet.id,
              address: wallet.address,
              chainId: isProduction ? 1 : 4,
              balance: '0',
              ownerId: wallet.ownerId,
              type: wallet.type == 'metamaks' ? 'metamask' : 'vault',
              status: wallet.status,
            });
            wallets.push({
              id: wallet.id,
              address: wallet.address,
              chainId: isProduction ? 137 : 137,
              balance: '0',
              ownerId: wallet.ownerId,
              type: wallet.type == 'metamaks' ? 'metamask' : 'vault',
              status: wallet.status,
            });
          });
          return wallets;
        })
        .catch(() => []);
    },
    {
      retry: 1,
      enabled: !!profile?.data?.data.id && !!companyId,
    }
  );
};
