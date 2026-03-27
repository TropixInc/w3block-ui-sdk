import { UseMutationResult, useMutation } from "@tanstack/react-query";
import { useCompanyConfig } from "../../shared/hooks/useCompanyConfig";
import { useGetW3blockIdSDK } from "../../shared/hooks/useGetW3blockIdSDK";
import { useProfile } from "../../shared/hooks/useProfile";

export const useDeleMethodPayment = (): UseMutationResult<
  unknown,
  unknown,
  string
> => {
  const { companyId: tenantId } = useCompanyConfig();
  const { data: profile } = useProfile();
  const getSDK = useGetW3blockIdSDK();
  return useMutation([], async (accountId: string) => {
    const sdk = await getSDK();
    return sdk.api.users.deleteUserWithdrawAccount(
      tenantId,
      profile?.data?.id ?? '',
      accountId
    );
  });
};
