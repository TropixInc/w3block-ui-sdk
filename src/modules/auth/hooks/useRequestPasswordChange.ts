import { useMutation } from "@tanstack/react-query";
import { PixwayAPIRoutes } from "../../shared/enums/PixwayAPIRoutes";
import { PixwayAppRoutes } from "../../shared/enums/PixwayAppRoutes";
import { W3blockAPI } from "../../shared/enums/W3blockAPI";
import { useAxios } from "../../shared/hooks/useAxios";
import { useCompanyConfig } from "../../shared/hooks/useCompanyConfig";
import { useResolveCallbackUrl } from "../../shared/hooks/useResolveCallbackUrl";

interface Payload {
  email: string;
  verificationType?: 'invisible' | 'numeric';
  callbackPath?: string;
}

export const useRequestPasswordChange = () => {
  const { companyId } = useCompanyConfig();
  const axios = useAxios(W3blockAPI.ID);
  const { resolveCallbackUrl } = useResolveCallbackUrl();

  return useMutation(
    [PixwayAPIRoutes.REQUEST_PASSWORD_CHANGE],
    async ({
      email,
      verificationType = 'invisible',
      callbackPath,
    }: Payload) => {
      return axios.post(PixwayAPIRoutes.REQUEST_PASSWORD_CHANGE, {
        email,
        tenantId: companyId,
        verificationType: verificationType ?? '',
        callbackUrl: resolveCallbackUrl(PixwayAppRoutes.RESET_PASSWORD, callbackPath),
      });
    }
  );
};
