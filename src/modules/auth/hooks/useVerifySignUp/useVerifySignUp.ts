import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { useGetW3blockIdSDK } from '../../../shared/hooks/useGetW3blockIdSDK';

interface Payload {
  email: string;
  token: string;
}

export const useVerifySignUp = () => {
  const getSDK = useGetW3blockIdSDK();
  return useMutation(
    [PixwayAPIRoutes.VERIFY_SIGN_UP],
    async (payload: Payload) => {
      const sdk = await getSDK();
      return sdk.api.auth.verifySignUp(payload);
    }
  );
};
