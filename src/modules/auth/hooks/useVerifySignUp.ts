
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { useGetW3blockIdSDK } from '../../shared/hooks/useGetW3blockIdSDK';
import { handleNetworkException } from '../../shared/utils/handleNetworkException';

interface Payload {
  email: string;
  token: string;
}

export const useVerifySignUp = (): UseMutationResult<
  unknown,
  unknown,
  Payload
> => {
  const getSDK = useGetW3blockIdSDK();
  return useMutation(
    [PixwayAPIRoutes.VERIFY_SIGN_UP],
    async (payload: Payload) => {
      try {
        const sdk = await getSDK();
        return await sdk.api.auth.verifySignUp(payload);
      } catch (error) {
        console.error('Erro ao verificar signup:', error);
        throw handleNetworkException(error);
      }
    }
  );
};
