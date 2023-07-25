/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, createContext, useEffect, useMemo, useState } from 'react';

import { useGetWallets } from '../../../dashboard/hooks/useGetWallets';
import { CoinsType } from '../../../storefront/interfaces';
import { useGetBalancesForWallets } from '../../hooks/useBalance';
import { useIsProduction } from '../../hooks/useIsProduction';

interface UserWalletsContextInterface {
  wallets: WalletSimple[];
  hasWallet?: boolean;
  setMainCoin?: (coin: CoinsType) => void;
  mainWallet?: WalletSimple;
}

export interface WalletSimple {
  id?: string;
  address: string;
  chainId: number;
  balance?: string;
  ownerId: string;
  type: 'metamask' | 'vault';
  status: string;
}

export const UserWalletsContext = createContext<UserWalletsContextInterface>({
  wallets: [],
  hasWallet: false,
});

export const UserWalletsProvider = ({ children }: { children: ReactNode }) => {
  const [wallets, setWallets] = useState<WalletSimple[]>([]);
  const [coinType, setCoinType] = useState<CoinsType>(CoinsType.MATIC);
  const isProduction = useIsProduction();
  const getWalletsbalance = useGetBalancesForWallets();
  const { data, isSuccess } = useGetWallets();
  useEffect(() => {
    if (data) {
      getBalances(data);
    }
  }, [isSuccess]);

  const getBalances = (data: WalletSimple[]) => {
    if (data.length > 0) {
      getWalletsbalance(data).then((res) => {
        setWallets(res);
      });
    }
  };

  const mainWallet = useMemo(() => {
    if (coinType != CoinsType.LOYALTY) {
      return wallets.find(
        (wallet) =>
          wallet.chainId == getChainIdBasedOnCoinType(coinType, isProduction)
      );
    } else {
      return wallets.find(
        (wallet) =>
          wallet.chainId ==
          getChainIdBasedOnCoinType(CoinsType.MATIC, isProduction)
      );
    }
  }, [coinType, wallets]);

  return (
    <UserWalletsContext.Provider
      value={{
        wallets: wallets,
        hasWallet: wallets.length > 0,
        setMainCoin: setCoinType,
        mainWallet: mainWallet,
      }}
    >
      {children}
    </UserWalletsContext.Provider>
  );
};

const getChainIdBasedOnCoinType = (
  coinType: CoinsType,
  production: boolean
) => {
  if (coinType === CoinsType.MATIC) {
    return production ? 137 : 80001;
  } else {
    return production ? 1 : 4;
  }
};
