import useRouter from "./useRouter";
import { useCompanyConfig } from "./useCompanyConfig";
import { useWindowLocation } from "./useWindowLocation";
import { removeDoubleSlashesOnUrl } from "../utils/removeDuplicateSlahes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildUrlFromRouterArgs = (args: any): string => {
  if (typeof args === 'string') return args;
  if (args && typeof args === 'object') {
    const pathname = args.pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
    if (args.query) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(args.query)) {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      }
      const search = params.toString();
      return search ? `${pathname}?${search}` : pathname;
    }
    return pathname;
  }
  return '/';
};

export const useRouterConnect = (): any => {
  const router = useRouter();
  const { connectProxyPass } = useCompanyConfig();
  const location = useWindowLocation();

  // Provide pathname and query fallbacks for App Router compatibility
  const pathname = router?.pathname ?? location?.pathname ?? '/';
  const query = router?.query ?? (typeof window !== 'undefined'
    ? Object.fromEntries(new URLSearchParams(window.location.search))
    : {});

  // Wrap push/replace to accept both string and object arguments (Pages Router compat)
  const originalPush = router?.push;
  const originalReplace = router?.replace;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const push = (...args: any[]) => {
    const url = buildUrlFromRouterArgs(args[0]);
    return originalPush?.(url, ...args.slice(1));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const replace = (...args: any[]) => {
    const url = buildUrlFromRouterArgs(args[0]);
    return originalReplace?.(url, ...args.slice(1));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pushConnect = (path: string, queryParam?: any) => {
    if (window.self !== window.top) return;
    const queryString = new URLSearchParams(queryParam).toString();
    const url =
      removeDoubleSlashesOnUrl(
        (location.hostname?.includes("localhost") ||
        location.href?.includes("/connect/") ||
        !connectProxyPass
          ? "/"
          : connectProxyPass) + path
      ) +
      (queryString && queryString != "" ? "?" : "") +
      queryString;

    originalPush?.(url);
  };

  const routerToHref = (path: string) => {
    return removeDoubleSlashesOnUrl((connectProxyPass ?? "") + path);
  };
  return { ...router, pathname, query, push, replace, pushConnect, routerToHref };
};
