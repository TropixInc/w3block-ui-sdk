import { useCallback } from 'react';

import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { authFlowLog } from '../utils/authFlowTimer';
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
      const timer = authFlowLog("useAuthRedirect.redirect", { query });
      const skipWallet = overrides?.skipWallet ?? options.skipWallet;
      const redirectRoute = options.redirectRoute ?? '/';
      const redirectLink = options.redirectLink;

      if (query.callbackPath?.length) {
        timer.log("pushConnect callbackPath");
        pushConnect(query.callbackPath as string);
      } else if (query.callbackUrl?.length) {
        timer.log("pushConnect callbackUrl");
        pushConnect(query.callbackUrl as string);
      } else if (query.contextSlug?.length) {
        timer.log("pushConnect COMPLETE_KYC");
        pushConnect(PixwayAppRoutes.COMPLETE_KYC, {
          ...query,
          callbackUrl: query?.callbackUrl ? query?.callbackUrl : '/wallet',
        });
      } else if (postSigninURL) {
        timer.log("pushConnect postSigninURL");
        pushConnect(postSigninURL);
      } else if (!skipWallet) {
        timer.log("pushConnect CONNECT_EXTERNAL_WALLET");
        pushConnect(PixwayAppRoutes.CONNECT_EXTERNAL_WALLET, {
          ...query,
          callbackUrl: query?.callbackUrl ? query?.callbackUrl : '/wallet',
        });
      } else if (redirectLink) {
        timer.log("pushConnect redirectLink");
        pushConnect(redirectLink);
      } else {
        timer.log("pushConnect redirectRoute");
        pushConnect(redirectRoute);
      }
      timer.end();
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
