import { useCallback, useMemo } from 'react';

import { UserRoleEnum } from '@w3block/sdk-id';

import { UseThemeConfig } from '../../../storefront/hooks/useThemeConfig/useThemeConfig';

export const useIsHiddenMenuItem = (roles: Array<UserRoleEnum>) => {
  const { defaultTheme } = UseThemeConfig();

  const internalMenuData = useMemo(() => {
    return defaultTheme?.configurations.styleData.internalMenu || {};
  }, [defaultTheme?.configurations.styleData.internalMenu]);
  return useCallback(
    (id: string) => {
      if (defaultTheme?.configurations.styleData.internalMenu) {
        const hiddenOption = internalMenuData[id]?.hidden;

        let computedRole = 'user';

        if (roles?.find((e: string) => e === 'admin' || e === 'superAdmin')) {
          computedRole = 'admin';
        } else if (roles?.find((e: string) => e === 'operator')) {
          computedRole = 'operator';
        } else if (roles?.find((e: string) => e === 'loyaltyOperator')) {
          computedRole = 'loyaltyOperator';
        } else if (roles?.find((e: string) => e === 'commerce.orderReceiver')) {
          computedRole = 'commerce.orderReceiver';
        } else if (roles?.find((e: string) => e === 'kyc.approver')) {
          computedRole = 'kyc.approver';
        }

        if (hiddenOption) {
          return hiddenOption[computedRole];
        } else if (id === 'futureStatement') {
          return true;
        } else if (id === 'withdraws') {
          return true;
        } else if (id === 'withdrawsAdmin') {
          return true;
        }
      } else if (id === 'futureStatement') {
        return true;
      } else if (id === 'withdraws') {
        return true;
      } else if (id === 'withdrawsAdmin') {
        return true;
      }
    },
    [defaultTheme, internalMenuData, roles]
  );
};
