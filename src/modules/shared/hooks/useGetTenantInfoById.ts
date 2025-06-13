import { useQuery } from "@tanstack/react-query";
import { PixwayAPIRoutes } from "../enums/PixwayAPIRoutes";
import { W3blockAPI } from "../enums/W3blockAPI";
import { useAxios } from "./useAxios";

interface HostInfo {
  hostname: string;
  isMain: true;
}

interface SignInConfigs {
  enabled: boolean;
  requireReferrer: boolean;
  callbackUri: string;
}
export interface IcompanyInfo {
  id: string;
  name: string;
  info: unknown;
  hosts: HostInfo[];
  configuration?: {
    passwordless?: {
      enabled: boolean;
    };
    googleSignIn: SignInConfigs;
    appleSignIn: SignInConfigs;
  };
}

export function useGetTenantInfoById(tenantId: string) {
  const axios = useAxios(W3blockAPI.ID);

  return useQuery(
    PixwayAPIRoutes.TENANT_INFO_BY_ID as any,
    async (): Promise<IcompanyInfo> => {
      const info = await axios.get(PixwayAPIRoutes.TENANT_INFO_BY_ID, {
        params: { tenantId },
      });
      return info.data;
    },
    { enabled: tenantId != undefined && tenantId != '' }
  );
}
