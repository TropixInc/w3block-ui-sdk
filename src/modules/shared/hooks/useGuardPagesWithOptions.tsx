import { useEffect } from 'react';
import { PixwayAppRoutes } from '../enums/PixwayAppRoutes';
import { useIsProduction } from './useIsProduction';
import { usePixwaySession } from './usePixwaySession';
import { useProfileWithKYC } from './useProfileWithKYC';
import { useRouterConnect } from './useRouterConnect';
import { useUserWallet } from './useUserWallet/useUserWallet';


interface useGuardPagesWithOptionsInterface {
  needUser?: boolean;
  needBusiness?: boolean;
  needProduction?: boolean;
  needWallet?: boolean;
  needWalletBalance?: boolean;
  needAdmin?: boolean;
  needSuperAdmin?: boolean;
  redirectPage?: string;
}

export const useGuardPagesWithOptions = ({
  needAdmin,
  needBusiness,
  needUser,
  needProduction,
  needSuperAdmin,
  needWallet,
  redirectPage,
}: useGuardPagesWithOptionsInterface) => {
  const { pushConnect } = useRouterConnect();
  const { profile } = useProfileWithKYC();
  const { wallets } = useUserWallet();
  const isProduction = useIsProduction();
  const isAdmin = profile?.roles?.includes('admin');
  const isSuperAdmin = profile?.roles?.includes('superAdmin');
  const isBusiness = profile?.roles?.includes('loyaltyOperator');
  const hasWallets = wallets?.length > 0;
  const { data: session, status } = usePixwaySession();

  useEffect(() => {
    if (needUser && (!session || !session.user) && status != 'loading') {
      pushConnect(redirectPage ?? PixwayAppRoutes.SIGN_IN, {
        callbackPath: window.location.href,
      });
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (status == 'loading') {
    return;
  }
  if (needUser && (!session || !session.user)) {
    pushConnect(redirectPage ?? PixwayAppRoutes.SIGN_IN, {
      callbackPath: window.location.href,
    });
    return;
  }
  if (needSuperAdmin && !isSuperAdmin && profile) {
    pushConnect(redirectPage ?? PixwayAppRoutes.TOKENS);
    return;
  }
  if (needAdmin && !isAdmin && !isSuperAdmin && profile) {
    pushConnect(redirectPage ?? PixwayAppRoutes.TOKENS);
    return;
  }
  if (needBusiness && !isBusiness && !isAdmin && !isSuperAdmin && profile) {
    pushConnect(redirectPage ?? PixwayAppRoutes.TOKENS);
    return;
  }
  if (needProduction && !isProduction && profile) {
    pushConnect(redirectPage ?? PixwayAppRoutes.TOKENS);
    return;
  }
  if (needWallet && !hasWallets && profile) {
    pushConnect(redirectPage ?? PixwayAppRoutes.TOKENS);
    return;
  }

  return;
};
