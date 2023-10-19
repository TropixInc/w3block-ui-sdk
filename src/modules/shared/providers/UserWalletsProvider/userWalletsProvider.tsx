/* eslint-disable react-hooks/exhaustive-deps */
import {
  ReactNode,
  createContext,
  lazy,
  useEffect,
  useMemo,
  useState,
} from 'react';

const BusinessProviderSDK = lazy(() =>
  import(
    '../../../business/providers/businessProvider/businessProviderSDK'
  ).then((m) => ({ default: m.BusinessProviderSDK }))
);

const AuthenticateModal = lazy(() =>
  import('../../components/AuthenticateModal/AuthenticateModal').then((m) => ({
    default: m.AuthenticateModal,
  }))
);
import { useGetUserBalance } from '../../../business/hooks/useGetUserBalance';
import { useGetWallets } from '../../../dashboard/hooks/useGetWallets';
import { CoinsType } from '../../../storefront/interfaces';
import { useGetBalancesForWallets } from '../../hooks/useBalance';
import { useIsProduction } from '../../hooks/useIsProduction';
import { usePixwaySession } from '../../hooks/usePixwaySession';
import { useProfileWithKYC } from '../../hooks/useProfileWithKYC/useProfileWithKYC';
import { useRouterConnect } from '../../hooks/useRouterConnect/useRouterConnect';
import { UserProvider } from '../UserProvider/userProvider';

interface UserWalletsContextInterface {
  wallets: WalletSimple[];
  hasWallet?: boolean;
  setMainCoin?: (coin: CoinsType) => void;
  mainWallet?: WalletSimple;
  setAuthenticatePaymentModal?: (value: boolean) => void;
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
  const [wallets, setWallets] = useState<WalletSimple[]>([]);
  const [loyaltyWallet, setLoyaltyWallet] = useState<WalletLoyalty[]>([]);
  const { data: session, status } = usePixwaySession();
  const { profile } = useProfileWithKYC();
  const [coinType, setCoinType] = useState<CoinsType>(CoinsType.MATIC);
  const isProduction = useIsProduction();
  const [authenticatePaymentModal, setAuthenticatePaymentModal] =
    useState<boolean>(false);
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
        loyaltyWallet,
      }}
    >
      {children}
      <AuthenticateModal
        isOpen={authenticatePaymentModal}
        onClose={() => setAuthenticatePaymentModal(false)}
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
