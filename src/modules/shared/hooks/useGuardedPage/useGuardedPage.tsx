import { useEffect } from 'react';

import { usePixwayAuthentication } from '../../../auth/hooks/usePixwayAuthentication';
import { validateJwtToken } from '../../config/api';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { usePixwaySession } from '../usePixwaySession';
import useRouter from '../useRouter';
import { useRouterPushConnect } from '../useRouterPushConnect';

export const useGuardedPage = (routeToReturn = PixwayAppRoutes.SIGN_IN) => {
  const { data: session } = usePixwaySession();
  const { signOut } = usePixwayAuthentication();
  const { push } = useRouterPushConnect();
  const { isReady } = useRouter();
  useEffect(() => {
    if (
      isReady &&
      (!session || !validateJwtToken(session.accessToken as string))
    ) {
      signOut().then(() => {
        push(routeToReturn);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);
};
