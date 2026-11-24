import { useEffect, useMemo } from 'react';

import { UserRoleEnum } from '@w3block/sdk-id';
import { authFlowLog } from '../../auth/utils/authFlowTimer';
import { PrivateRouteStrategy } from '../enums/PrivateRouteStrategy';
import { PixwayAppRoutes } from '../enums/PixwayAppRoutes';
import { usePixwaySession } from './usePixwaySession';
import { useRouterConnect } from './useRouterConnect';
import { useSessionUser } from './useSessionUser';
import { validateJwtToken } from '../config/api';
import { signOutExpiredSession } from '../utils/expiredSessionSignOut';
import { usePixwayAuthentication } from '../../auth/hooks/usePixwayAuthentication';


interface Config {
  roles: Array<UserRoleEnum>;
  strategy: PrivateRouteStrategy;
}

export const usePrivateRoute = (
  config: Config = {
    roles: [],
    strategy: PrivateRouteStrategy.BLOCK_SPECIFIED_ROLES,
  },
  redirectRoute: PixwayAppRoutes = PixwayAppRoutes.SIGN_IN
) => {
  const { status, data: session } = usePixwaySession();
  const user = useSessionUser();
  const router = useRouterConnect();
  const { signOut } = usePixwayAuthentication();
  const { roles, strategy } = config ?? {};
  const isLoading = status !== 'authenticated';

  // A session whose token could not be renewed (or already expired) still
  // reports `authenticated`; without this the user stays on private pages
  // with every API call answering 401. Treat it as signed out: clear the
  // session once and go to sign-in with a callback to this page.
  const accessToken = user?.accessToken;
  const isDeadSession = useMemo(() => {
    if (status !== 'authenticated') return false;
    if (session?.error === 'RefreshAccessTokenError') return true;
    if (!accessToken) return false;
    try {
      return !validateJwtToken(accessToken);
    } catch {
      return true;
    }
  }, [status, session?.error, accessToken]);

  useEffect(() => {
    if (isDeadSession) signOutExpiredSession(signOut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeadSession]);

  useEffect(() => {
    const timer = authFlowLog("usePrivateRoute.useEffect", {
      status,
      redirectRoute,
      hasRouter: !!router,
    });
    if (router && status === 'unauthenticated') {
      timer.log("redirect para sign-in (unauthenticated)");
      router?.pushConnect(redirectRoute, { callbackPath: window.location.href });
    } else {
      timer.log("sem redirect", { status });
    }
    timer.end();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status === 'loading', redirectRoute]);

  const isAuthorized = useMemo(() => {
    if (isDeadSession) return false;
    if (user) {
      const isRoleWithinSpecifiedRoles = roles.some((role) =>
        user.roles.includes(role)
      );
      return strategy === PrivateRouteStrategy.BLOCK_SPECIFIED_ROLES
        ? !isRoleWithinSpecifiedRoles
        : isRoleWithinSpecifiedRoles;
    }
    return false;
  }, [roles, strategy, user, isDeadSession]);

  return useMemo(
    () => ({
      isLoading,
      isAuthorized: isAuthorized,
    }),
    [isLoading, isAuthorized]
  );
};
