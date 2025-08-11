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
        queryClient.invalidateQueries([PixwayAPIRoutes.GET_DOCUMENTS_BY_USER]);
        queryClient.invalidateQueries([PixwayAPIRoutes.KYC_LIST]);

        queryClient.invalidateQueries(PixwayAPIRoutes.CONTEXT_BY_USER_ID as any);
      },
    }
  );
};

export default useApproveKYC;
