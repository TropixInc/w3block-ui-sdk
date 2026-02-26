import { useMemo } from 'react';
import { useGetRightWallet } from '../../shared/utils/getRightWallet';
import {
  getLoyaltyWalletWithBalance,
  formatLoyaltyBalance,
  WalletWithBalance,
} from '../utils/checkoutHelpers';

export function useLoyaltyBalance() {
  const organizedLoyalties = useGetRightWallet();

  const loyaltyWallet = useMemo(
    () => getLoyaltyWalletWithBalance(organizedLoyalties as WalletWithBalance[]),
    [organizedLoyalties]
  );

  const formattedBalance = useMemo(
    () => formatLoyaltyBalance(loyaltyWallet),
    [loyaltyWallet]
  );

  const hasLoyaltyBalance = useMemo(
    () =>
      organizedLoyalties?.some(
        (w: WalletWithBalance) =>
          w?.type === 'loyalty' &&
          w?.balance &&
          parseFloat(w?.balance ?? '0') > 0
      ) ?? false,
    [organizedLoyalties]
  );

  return {
    organizedLoyalties,
    loyaltyWallet,
    formattedBalance,
    hasLoyaltyBalance,
  };
}
