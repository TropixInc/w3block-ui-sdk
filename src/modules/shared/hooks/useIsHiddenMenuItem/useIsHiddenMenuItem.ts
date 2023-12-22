import { useCallback, useMemo } from 'react';

import { UseThemeConfig } from '../../../storefront/hooks/useThemeConfig/useThemeConfig';

export const useIsHiddenMenuItem = (
  roles: Array<'user' | 'superAdmin' | 'admin' | 'operator' | 'loyaltyOperator'>
) => {
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
        }

        if (hiddenOption) {
          return hiddenOption[computedRole];
        }
      }
    },
    [defaultTheme, internalMenuData, roles]
  );
};
