import { UseMutationResult, useMutation } from "@tanstack/react-query";
import { ResetPasswordDto } from "@w3block/sdk-id";
import { useGetW3blockIdSDK } from "../../shared/hooks/useGetW3blockIdSDK";
import { handleNetworkException } from "../../shared/utils/handleNetworkException";

export const useChangePassword = (): UseMutationResult<
  unknown,
  unknown,
  ResetPasswordDto
> => {
  const getSDK = useGetW3blockIdSDK();
  return useMutation([], async (payload: ResetPasswordDto) => {
    try {
      const sdk = await getSDK();
      return await sdk.api.auth.resetPassword(payload);
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw handleNetworkException(error);
    }
  });
};
