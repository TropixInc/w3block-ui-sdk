import { useMutation } from 'react-query';

import { ResetPasswordDto } from '@w3block/sdk-id';

import { useGetW3blockIdSDK } from '../../../shared/hooks/useGetW3blockIdSDK';

export const useChangePassword = () => {
  const getSDK = useGetW3blockIdSDK();
  return useMutation([], async (payload: ResetPasswordDto) => {
    const sdk = await getSDK();
    return sdk.api.auth.resetPassword(payload);
  });
};
