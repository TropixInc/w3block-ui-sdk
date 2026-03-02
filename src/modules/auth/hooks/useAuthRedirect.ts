import { useCallback } from 'react';

import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { useThemeConfig } from '../../storefront/hooks/useThemeConfig';

interface UseAuthRedirectOptions {
  postSigninURL?: string;
  skipWallet?: boolean;
  redirectRoute?: string;
  redirectLink?: string;
}

export const useAuthRedirect = (options: UseAuthRedirectOptions = {}) => {
  const { pushConnect, query } = useRouterConnect();
  const theme = useThemeConfig();
  const themePostSigninURL =
    theme?.defaultTheme?.configurations?.contentData?.postSigninURL;
  const postSigninURL = options.postSigninURL ?? themePostSigninURL;

  const redirect = useCallback(
    (overrides?: { skipWallet?: boolean }) => {
      const skipWallet = overrides?.skipWallet ?? options.skipWallet;
      const redirectRoute = options.redirectRoute ?? '/';
      const redirectLink = options.redirectLink;

      if (query.callbackPath?.length) {
        pushConnect(query.callbackPath as string);
      } else if (query.callbackUrl?.length) {
        pushConnect(query.callbackUrl as string);
      } else if (query.contextSlug?.length) {
        pushConnect(PixwayAppRoutes.COMPLETE_KYC, {
          ...query,
          callbackUrl: query?.callbackUrl ? query?.callbackUrl : '/wallet',
        });
      } else if (postSigninURL) {
        pushConnect(postSigninURL);
      } else if (!skipWallet) {
        pushConnect(PixwayAppRoutes.CONNECT_EXTERNAL_WALLET, {
          ...query,
          callbackUrl: query?.callbackUrl ? query?.callbackUrl : '/wallet',
        });
      } else if (redirectLink) {
        pushConnect(redirectLink);
      } else {
        pushConnect(redirectRoute);
      }
    },
    [
      query,
      pushConnect,
      postSigninURL,
      options.skipWallet,
      options.redirectRoute,
      options.redirectLink,
    ]
  );

  return { redirect };
};
