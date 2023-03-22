import { useEffect } from 'react';

import { useProfile } from '..';

import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { removeDoubleSlashesOnUrl } from '../../utils/removeDuplicateSlahes';
import { useCompanyConfig } from '../useCompanyConfig';
import { usePixwaySession } from '../usePixwaySession';
import { useRouterConnect } from '../useRouterConnect';

interface useHasWalletProps {
  redirectRoute?: string;
  onlyWithSession?: boolean;
}

export const useHasWallet = ({
  redirectRoute = PixwayAppRoutes.CONNECT_EXTERNAL_WALLET,
  onlyWithSession = false,
}: useHasWalletProps) => {
  const { data: session } = usePixwaySession();
  const { appBaseUrl, connectProxyPass } = useCompanyConfig();
  const { data: profile, isLoading, isSuccess } = useProfile();
  const router = useRouterConnect();

  useEffect(() => {
    const routerToRedirect =
      removeDoubleSlashesOnUrl(appBaseUrl + connectProxyPass + redirectRoute) +
      `?callbackPath=${window.location.href}`;
    if (onlyWithSession) {
      if (
        !profile?.data.mainWallet &&
        !isLoading &&
        router.isReady &&
        isSuccess &&
        session
      ) {
        router.pushConnect(routerToRedirect);
      }
    } else {
      if (
        !profile?.data.mainWallet &&
        !isLoading &&
        router.isReady &&
        isSuccess
      ) {
        router.pushConnect(routerToRedirect);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, redirectRoute, isLoading, isSuccess, session]);
  return;
};
