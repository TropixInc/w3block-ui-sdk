/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, createContext, useEffect, useMemo, useState } from 'react';
import { CoinsType } from '../../storefront/interfaces/Theme';
import { useRouterConnect } from '../hooks/useRouterConnect';
import { usePixwaySession } from '../hooks/usePixwaySession';
import { useProfileWithKYC } from '../hooks/useProfileWithKYC';
import { useIsProduction } from '../hooks/useIsProduction';
import { useGetBalancesForWallets } from '../hooks/useBalance';
import { useGetWallets } from '../../dashboard/hook/useGetWallets';
import { useGetUserBalance } from '../../business/hooks/useGetUserBalance';
import { AuthenticateModal } from '../../auth/components/AuthenticateModal';
import { TransferModal } from '../components/TransferModal';
import { UserProvider } from './userProvider';
import { BusinessProviderSDK } from '../../business/providers/businessProviderSDK';


interface UserWalletsContextInterface {
  wallets: WalletSimple[];
  hasWallet?: boolean;
  setMainCoin?: (coin: CoinsType) => void;
  mainWallet?: WalletSimple;
  setAuthenticatePaymentModal?: (value: boolean) => void;
  setTransferModal?: (value: boolean) => void;
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
  image?: string;
  pointsPrecision?: 'decimal' | 'integer';
}

export const UserWalletsContext = createContext<UserWalletsContextInterface>({
  wallets: [],
  hasWallet: false,
  loyaltyWallet: [],
});

const _UserWalletsProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouterConnect();
  const { data: session } = usePixwaySession();
  const [wallets, setWallets] = useState<WalletSimple[]>([]);
  const [loyaltyWallet, setLoyaltyWallet] = useState<WalletLoyalty[]>([]);
  const { profile } = useProfileWithKYC();
  const [coinType, setCoinType] = useState<CoinsType>(CoinsType.MATIC);
  const isProduction = useIsProduction();
  const [authenticatePaymentModal, setAuthenticatePaymentModal] =
    useState<boolean>(false);
  const [transferModal, setTransferModal] = useState<boolean>(false);
  const getWalletsbalance = useGetBalancesForWallets();
  const { data, isSuccess } = useGetWallets();
  useEffect(() => {
    if (data) {
      getBalances(data);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (authenticatePaymentModal) {
      router.replace({ query: { ...router.query, authorizeLoyalty: 'true' } });
    } else if (router.query.authorizeLoyalty && !authenticatePaymentModal) {
      {
        delete router.query.authorizeLoyalty;
        router.replace({ query: router.query });
      }
    }
  }, [authenticatePaymentModal]);

  useEffect(() => {
    if (
      status != 'loading' &&
      session &&
      !authenticatePaymentModal &&
      router.query.authorizeLoyalty == 'true'
    ) {
      setAuthenticatePaymentModal(true);
    }
  }, [router.query, session]);

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
        setAuthenticatePaymentModal,
        setTransferModal,
        loyaltyWallet,
      }}
    >
      {children}
      <AuthenticateModal
        isOpen={authenticatePaymentModal}
        onClose={() => setAuthenticatePaymentModal(false)}
      />
      <TransferModal
        isOpen={transferModal}
        onClose={() => setTransferModal(false)}
        wallet={mainWallet?.address ?? ''}
        contractId={loyaltyWallet?.[0]?.contractId}
      />
    </UserWalletsContext.Provider>
  );
};

const getChainIdBasedOnCoinType = (
  coinType: CoinsType,
  production: boolean
) => {
  if (coinType === CoinsType.MATIC) {
    return production ? 137 : 137;
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
