import { useEffect } from 'react';

import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { usePixwaySession } from '../usePixwaySession';
import { useProfile } from '../useProfile/useProfile';
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
  const { data: profile, isLoading, isSuccess } = useProfile();
  const router = useRouterConnect();

  useEffect(() => {
    if (onlyWithSession) {
      if (
        !profile?.data.mainWallet &&
        !isLoading &&
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
        !isLoading &&
        router.isReady &&
        isSuccess
      ) {
        router.pushConnect(redirectRoute, {
          callbackPath: window.location.href,
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, redirectRoute, isLoading, isSuccess, session]);
  return;
};
