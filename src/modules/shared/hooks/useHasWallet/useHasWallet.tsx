import { useEffect } from 'react';

import { useProfile } from '..';

import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import useRouter from '../useRouter';

export const useHasWallet = (
  redirectRoute: PixwayAppRoutes = PixwayAppRoutes.CONNECT_EXTERNAL_WALLET
) => {
  const { data: profile, isLoading } = useProfile();

  const router = useRouter();

  useEffect(() => {
    if (!profile?.data.mainWallet && !isLoading && router.isReady) {
      router.push(redirectRoute);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, redirectRoute, isLoading]);
  return;
};
