import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PixwayAPIRoutes } from "../enums/PixwayAPIRoutes";
import { useCompanyConfig } from "./useCompanyConfig";
import { useGetW3blockIdSDK } from "./useGetW3blockIdSDK";


interface Props {
  userId: string;
  contextId: string;
  resons?: string;
  userContextId?: string;
}

const useRejectKYC = (): any => {
  const queryClient = useQueryClient();
  const { companyId: tenantId } = useCompanyConfig();
  const getSdk = useGetW3blockIdSDK();

  return useMutation(
    [PixwayAPIRoutes.REJECT_KYC],
    async (body: Props) => {
      const sdk = await getSdk();
      return sdk.api.users.rejectTenantContextByUserId(
        tenantId ?? '',
        body.userId,
        body.contextId,
        { reason: body.resons, userContextId: body.userContextId }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: [PixwayAPIRoutes.GET_DOCUMENTS_BY_USER]});
        queryClient.invalidateQueries({queryKey: [PixwayAPIRoutes.KYC_LIST]});
        queryClient.invalidateQueries({queryKey: [PixwayAPIRoutes.CONTEXT_BY_USER_ID]});
      },
    }
  );
};

export default useRejectKYC;
