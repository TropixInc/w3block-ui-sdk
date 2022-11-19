import { useEffect } from 'react';

import { useProfile } from '..';

import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import useRouter from '../useRouter';
import { useRouterPushConnect } from '../useRouterPushConnect';

export const useHasWallet = (
  redirectRoute: PixwayAppRoutes = PixwayAppRoutes.CONNECT_EXTERNAL_WALLET
) => {
  const { data: profile, isLoading, isSuccess } = useProfile();

  const router = useRouter();
  const { push } = useRouterPushConnect();

  useEffect(() => {
    if (
      !profile?.data.mainWallet &&
      !isLoading &&
      router.isReady &&
      isSuccess
    ) {
      push(redirectRoute);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, redirectRoute, isLoading, isSuccess]);
  return;
};
