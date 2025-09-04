import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PixwayAPIRoutes } from "../enums/PixwayAPIRoutes";
import { useCompanyConfig } from "./useCompanyConfig";
import { useGetW3blockIdSDK } from "./useGetW3blockIdSDK";


interface Props {
  userId: string;
  contextId: string;
  userContextId: string;
}

const useApproveKYC = (): any => {
  const queryClient = useQueryClient();
  const { companyId: tenantId } = useCompanyConfig();
  const getSdk = useGetW3blockIdSDK();

  return useMutation(
    [PixwayAPIRoutes.APROVE_KYC],
    async (body: Props) => {
      const sdk = await getSdk();
      return sdk.api.users.approveTenantContextByUserId(
        tenantId ?? '',
        body.userId,
        body.contextId,
        { reason: '', userContextId: body.userContextId }
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

export default useApproveKYC;
