import { useEffect } from 'react';

import { usePixwayAuthentication } from '../../../auth/hooks/usePixwayAuthentication';
import { validateJwtToken } from '../../config/api';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { usePixwaySession } from '../usePixwaySession';
import { useRouterConnect } from '../useRouterConnect';

export const useGuardedPage = (routeToReturn = PixwayAppRoutes.SIGN_IN) => {
  const { data: session } = usePixwaySession();
  const { signOut } = usePixwayAuthentication();
  const { isReady, pushConnect } = useRouterConnect();
  useEffect(() => {
    if (
      isReady &&
      (!session || !validateJwtToken(session.accessToken as string))
    ) {
      signOut().then(() => {
        pushConnect(routeToReturn);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);
};
