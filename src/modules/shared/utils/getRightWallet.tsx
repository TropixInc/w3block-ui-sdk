import { useMemo } from "react";
import { useUserWallet } from "../hooks/useUserWallet/useUserWallet";
import { useThemeConfig } from "../../storefront/hooks/useThemeConfig";

export const useGetRightWallet = () => {
  const { wallets, loyaltyWallet } = useUserWallet();
  const { defaultTheme } = useThemeConfig();
  const loyaltiesAll = useMemo(() => {
    return [
      ...loyaltyWallet.map((wallet) => ({
        type: "loyalty",
        balance: wallet.balance,
        currency: wallet.currency,
        chainId: undefined,
        loyaltyId: wallet.loyaltyId,
        image: wallet.image,
        pointsPrecision: wallet.pointsPrecision,
      })),
      ...wallets
        .filter((wallet) => parseFloat(wallet?.balance ?? "0") > 0)
        .map((wallet) => ({
          type: wallet.type,
          balance: wallet.balance,
          currency: undefined,
          chainId: wallet.chainId,
          loyaltyId: undefined,
          pointsPrecision: "decimal",
          address: wallet.address,
        })),
    ];
  }, [loyaltyWallet, wallets]);

  const organizedLoyalties = useMemo(() => {
    if (
      defaultTheme &&
      defaultTheme?.configurations?.styleData?.walletsAvaiable &&
      defaultTheme?.configurations?.styleData?.walletsAvaiable?.length
    ) {
      const newArrayOfWallets: any[] = [];
      defaultTheme?.configurations?.styleData?.walletsAvaiable?.forEach(
        (wallet: any) => {
          if (wallet == "ETH") {
            newArrayOfWallets.push(
              loyaltiesAll.find((w) => w.chainId == 1 || w.chainId == 4)
            );
          } else if (wallet == "MATIC") {
            newArrayOfWallets.push(
              loyaltiesAll.find((w) => w.chainId == 80001 || w.chainId == 137)
            );
          } else {
            newArrayOfWallets.push(
              loyaltiesAll.find((w) => w.loyaltyId == wallet)
            );
          }
        }
      );
      return newArrayOfWallets.filter((wallet) => wallet != undefined);
    } else {
      return loyaltiesAll;
    }
  }, [loyaltiesAll, defaultTheme]);

  return organizedLoyalties;
};

export const chainIdToCode = (chainId: number, currency: string) => {
  if (chainId === 137 || chainId === 80001) {
    return "MATIC";
  } else if (chainId === 1 || chainId === 4) {
    return "ETH";
  } else {
    return currency;
  }
};
