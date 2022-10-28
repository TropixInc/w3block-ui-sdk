import { ChainScan } from '../../enums/ChainId';
import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { useAxios } from '../useAxios';
import { usePrivateQuery } from '../usePrivateQuery';

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

  const balance = usePrivateQuery([chainId, address], () =>
    axios.get<GetBalanceAPIResponse>(
      PixwayAPIRoutes.BALANCE.replace('{address}', address).replace(
        '{chainId}',
        String(chainId)
      )
    )
  );
  return chainId && address && address != '' ? balance : null;
};
