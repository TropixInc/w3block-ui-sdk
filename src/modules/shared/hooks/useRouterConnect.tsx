import { useLocation } from "react-use";
import useRouter from "./useRouter";
import { useCompanyConfig } from "./useCompanyConfig";
import { removeDoubleSlashesOnUrl } from "../utils/removeDuplicateSlahes";


export const useRouterConnect = (): any => {
  const router = useRouter();
  const { connectProxyPass } = useCompanyConfig();
  const location = useLocation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pushConnect = (path: string, query?: any) => {
    if (window.self !== window.top) return;
    const queryString = new URLSearchParams(query).toString();
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

    console.log(url, "url");
    router.push(url);
  };

  const routerToHref = (path: string) => {
    return removeDoubleSlashesOnUrl((connectProxyPass ?? "") + path);
  };
  return { ...router, pushConnect, routerToHref };
};
