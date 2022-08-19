import { useMutation } from 'react-query';

import { SignupUserDto } from '@w3block/sdk-id';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useGetW3blockIdSDK } from '../../../shared/hooks/useGetW3blockIdSDK';
import { useHostname } from '../../../shared/hooks/useHostname';

type Payload = Pick<SignupUserDto, 'confirmation' | 'email' | 'password'>;

export const useSignUp = () => {
  const getSDK = useGetW3blockIdSDK();
  const { companyId } = useCompanyConfig();
  const hostname = useHostname();
  return useMutation([PixwayAPIRoutes.USERS], async (payload: Payload) => {
    const sdk = await getSDK();
    return sdk.api.auth.signUp({
      ...payload,
      tenantId: companyId,
      callbackUrl: new URL(
        PixwayAppRoutes.SIGN_UP_MAIL_CONFIRMATION,
        `https://${hostname}/`
      ).toString(),
    });
  });
};
