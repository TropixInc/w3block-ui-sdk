import { useEffect } from 'react';
import { useThemeConfig } from '../../storefront/hooks/useThemeConfig';
import { PixwayAppRoutes } from '../enums/PixwayAppRoutes';
import { usePixwaySession } from './usePixwaySession';
import { useProfile } from './useProfile';
import { useRouterConnect } from './useRouterConnect';


interface useHasWalletProps {
  redirectRoute?: string;
  onlyWithSession?: boolean;
}

export const useHasWallet = ({
  redirectRoute = PixwayAppRoutes.CONNECT_EXTERNAL_WALLET,
  onlyWithSession = false,
}: useHasWalletProps) => {
  const { data: session } = usePixwaySession();
  const { data: profile, isFetching, isSuccess } = useProfile();
  const router = useRouterConnect();
  const theme = useThemeConfig();
  const skipWallet =
    theme.defaultTheme?.configurations?.contentData?.skipWallet;
  useEffect(() => {
    if (!skipWallet) {
      if (onlyWithSession) {
        if (
          !profile?.data.mainWallet &&
          !isFetching &&
          router.isReady &&
          isSuccess &&
          session
        ) {
          router.pushConnect(redirectRoute, {
            callbackPath: window.location.href,
          });
        }
      } else {
        if (
          !profile?.data.mainWallet &&
          !isFetching &&
          router.isReady &&
          isSuccess
        ) {
          router.pushConnect(redirectRoute, {
            callbackPath: window.location.href,
          });
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, redirectRoute, isFetching, isSuccess, session]);
  return;
};
