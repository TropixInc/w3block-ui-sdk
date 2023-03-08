import { useMutation } from 'react-query';

import { SignupUserDto } from '@w3block/sdk-id/dist/types/id/api/api';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useGetW3blockIdSDK } from '../../../shared/hooks/useGetW3blockIdSDK';

export const useSignUp = () => {
  const getSDK = useGetW3blockIdSDK();
  const { companyId, appBaseUrl, connectProxyPass } = useCompanyConfig();
  return useMutation(
    [PixwayAPIRoutes.USERS],
    async (payload: SignupUserDto) => {
      const sdk = await getSDK();
      return sdk.api.auth.signUp({
        ...payload,
        tenantId: companyId,
        callbackUrl: new URL(
          payload.callbackUrl ??
            connectProxyPass + PixwayAppRoutes.SIGN_UP_MAIL_CONFIRMATION,
          appBaseUrl
        ).toString(),
      });
    }
  );
};
