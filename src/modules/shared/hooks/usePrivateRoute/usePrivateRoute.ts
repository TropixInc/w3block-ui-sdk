import { useEffect, useMemo } from 'react';

import { UserRoleEnum } from '@w3block/sdk-id';

import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { PrivateRouteStrategy } from '../../enums/PrivateRouteStrategy';
import { usePixwaySession } from '../usePixwaySession';
import { useRouterPushConnect } from '../useRouterPushConnect';
import { useSessionUser } from '../useSessionUser';

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
  const { status } = usePixwaySession();
  const user = useSessionUser();
  const router = useRouterPushConnect();
  const { roles, strategy } = config ?? {};
  const isLoading = status !== 'authenticated';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(redirectRoute);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status === 'loading', redirectRoute]);

  const isAuthorized = useMemo(() => {
    if (user) {
      const isRoleWithinSpecifiedRoles = roles.some((role) =>
        user.roles.includes(role)
      );
      return strategy === PrivateRouteStrategy.BLOCK_SPECIFIED_ROLES
        ? !isRoleWithinSpecifiedRoles
        : isRoleWithinSpecifiedRoles;
    }
    return false;
  }, [roles, strategy, user]);

  return useMemo(
    () => ({
      isLoading,
      isAuthorized: isAuthorized,
    }),
    [isLoading, isAuthorized]
  );
};
