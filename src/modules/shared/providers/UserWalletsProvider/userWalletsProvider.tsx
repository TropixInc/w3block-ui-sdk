/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, createContext, useEffect, useMemo, useState } from 'react';

import { useGetUserBalance } from '../../../business/hooks/useGetUserBalance';
import { BusinessProviderSDK } from '../../../business/providers/businessProvider/businessProviderSDK';
import { useGetWallets } from '../../../dashboard/hooks/useGetWallets';
import { CoinsType } from '../../../storefront/interfaces';
import { AuthenticateModal } from '../../components/AuthenticateModal/AuthenticateModal';
import { useRouterConnect } from '../../hooks';
import { useGetBalancesForWallets } from '../../hooks/useBalance';
import { useIsProduction } from '../../hooks/useIsProduction';
import { useProfileWithKYC } from '../../hooks/useProfileWithKYC/useProfileWithKYC';
import { UserProvider } from '../UserProvider/userProvider';

interface UserWalletsContextInterface {
  wallets: WalletSimple[];
  hasWallet?: boolean;
  setMainCoin?: (coin: CoinsType) => void;
  mainWallet?: WalletSimple;
  setAuthenticatePayemntModal?: (value: boolean) => void;
  loyaltyWallet: WalletLoyalty[];
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

export interface WalletLoyalty {
  balance: string;
  currency: string;
  loyaltyId: string;
  contractId: string;
}

export const UserWalletsContext = createContext<UserWalletsContextInterface>({
  wallets: [],
  hasWallet: false,
  loyaltyWallet: [],
});

const _UserWalletsProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouterConnect();
  const [wallets, setWallets] = useState<WalletSimple[]>([]);
  const [loyaltyWallet, setLoyaltyWallet] = useState<WalletLoyalty[]>([]);
  const { profile } = useProfileWithKYC();
  const [coinType, setCoinType] = useState<CoinsType>(CoinsType.MATIC);
  const isProduction = useIsProduction();
  const [authenticatePayemntModal, setAuthenticatePayemntModal] =
    useState<boolean>(false);
  const getWalletsbalance = useGetBalancesForWallets();
  const { data, isSuccess } = useGetWallets();
  useEffect(() => {
    if (data) {
      getBalances(data);
    }
  }, [isSuccess]);
  // !!ver como solucionar
  // useEffect(() => {
  //   if (authenticatePayemntModal) {
  //     router.replace({ query: { ...router.query, authorizeLoayltie: 'true' } });
  //   } else {
  //     delete router.query.authorizeLoayltie;
  //     router.replace({ query: router.query });
  //   }
  // }, [authenticatePayemntModal]);

  useEffect(() => {
    if (!authenticatePayemntModal && router.query.authorizeLoayltie == 'true') {
      setAuthenticatePayemntModal(true);
    }
  }, [router.query]);

  const { mutate: getBalanceFromLoyalty } = useGetUserBalance();

  const getBalances = (data: WalletSimple[]) => {
    if (data.length > 0) {
      getWalletsbalance(data).then((res) => {
        setWallets(res);
      });
    }
  };

  useEffect(() => {
    if (profile?.id) {
      handleGetLoyaltyBalances();
    }
  }, [profile]);

  const handleGetLoyaltyBalances = () => {
    getBalanceFromLoyalty(profile?.id ?? '', {
      onSuccess: (res: any) => {
        if (res) {
          setLoyaltyWallet([...res]);
        }
      },
    });
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
        setAuthenticatePayemntModal,
        loyaltyWallet,
      }}
    >
      {children}
      <AuthenticateModal
        isOpen={authenticatePayemntModal}
        onClose={() => setAuthenticatePayemntModal(false)}
      />
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

export const UserWalletsProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <BusinessProviderSDK>
        <_UserWalletsProvider>{children}</_UserWalletsProvider>
      </BusinessProviderSDK>
    </UserProvider>
  );
};
