import { useLocation } from 'react-use';

import { removeDoubleSlashesOnUrl } from '../../utils/removeDuplicateSlahes';
import { useCompanyConfig } from '../useCompanyConfig';
import useRouter from '../useRouter';

export const useRouterConnect = () => {
  const router = useRouter();
  const { connectProxyPass } = useCompanyConfig();
  const location = useLocation();

  const pushConnect = (path: string, query?: any) => {
    if (window.self !== window.top) return;
    const queryString = new URLSearchParams(query).toString();
    router.push(
      removeDoubleSlashesOnUrl(
        (location.hostname?.includes('localhost') ||
        location.href?.includes('/connect/') ||
        !connectProxyPass
          ? '/'
          : connectProxyPass) + path
      ) +
        (queryString && queryString != '' ? '?' : '') +
        queryString
    );
  };
  const routerToHref = (path: string) => {
    return removeDoubleSlashesOnUrl((connectProxyPass ?? '') + path);
  };
  return { ...router, pushConnect, routerToHref };
};
