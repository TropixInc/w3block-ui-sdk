
import { ChainScan } from '../enums/ChainId';
import { PixwayAPIRoutes } from '../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../enums/W3blockAPI';
import { WalletSimple } from '../providers/userWalletsProvider';
import { useAxios } from './useAxios';
import { usePrivateQuery } from './usePrivateQuery';



type Currency = 'ETH' | 'MATIC';

interface GetBalanceAPIResponse {
  balance: string;
  currency: Currency;
}

interface useBalanceParams {
  chainId: ChainScan;
  address: string;
}

export const useBalance = ({ chainId, address }: useBalanceParams) => {
  const axios = useAxios(W3blockAPI.KEY);

  const balance = usePrivateQuery(
    [chainId, address],
    () =>
      axios.get<GetBalanceAPIResponse>(
        PixwayAPIRoutes.BALANCE.replace('{address}', address).replace(
          '{chainId}',
          String(chainId)
        )
      ),
    { enabled: address != undefined && address != '' }
  );
  return chainId && address && address != '' ? balance : null;
};

export const useGetBalancesForWallets = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const getWalletsBalances = async (
    wallets: WalletSimple[]
  ): Promise<WalletSimple[]> => {
    return Promise.all(
      wallets.map((wallet) => {
        return axios
          .get<GetBalanceAPIResponse>(
            PixwayAPIRoutes.BALANCE.replace(
              '{address}',
              wallet.address
            ).replace('{chainId}', String(wallet.chainId))
          )
          .then((response) => {
            return {
              ...wallet,
              balance: response.data.balance,
            };
          })
          .catch(() => {
            return wallet;
          });
      })
    );
  };
  return getWalletsBalances;
};
