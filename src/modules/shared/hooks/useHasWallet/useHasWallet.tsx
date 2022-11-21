import { useEffect } from 'react';

import { useProfile } from '..';

import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useRouterConnect } from '../useRouterConnect';

export const useHasWallet = (
  redirectRoute: PixwayAppRoutes = PixwayAppRoutes.CONNECT_EXTERNAL_WALLET
) => {
  const { data: profile, isLoading, isSuccess } = useProfile();

  const router = useRouterConnect();

  useEffect(() => {
    if (
      !profile?.data.mainWallet &&
      !isLoading &&
      router.isReady &&
      isSuccess
    ) {
      router.pushConnect(redirectRoute);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, redirectRoute, isLoading, isSuccess]);
  return;
};
