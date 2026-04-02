import { useCallback } from 'react';
import { useCompanyConfig } from './useCompanyConfig';
import { useGetTenantInfoByHostname } from './useGetTenantInfoByHostname';
import { removeDoubleSlashesOnUrl } from '../utils/removeDuplicateSlahes';

export const useResolveCallbackUrl = () => {
  const { appBaseUrl, connectProxyPass } = useCompanyConfig();
  const { data: tenantInfo } = useGetTenantInfoByHostname();

  const resolveCallbackUrl = useCallback(
    (path: string, callbackPath?: string) => {
      if (callbackPath) return callbackPath;

      const fullPath = connectProxyPass + path;

      if (appBaseUrl.includes('localhost') && tenantInfo?.hosts?.length) {
        const mainHost =
          tenantInfo.hosts.find((h) => h.isMain) ?? tenantInfo.hosts[0];
        return removeDoubleSlashesOnUrl(
          `https://${mainHost.hostname}${fullPath}`
        );
      }

      return removeDoubleSlashesOnUrl(appBaseUrl + fullPath);
    },
    [appBaseUrl, connectProxyPass, tenantInfo]
  );

  return { resolveCallbackUrl };
};
