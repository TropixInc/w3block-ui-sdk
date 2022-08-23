import { useMutation } from 'react-query';

import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyId } from '../../../shared/hooks/useCompanyId';
import { useGetW3blockIdSDK } from '../../../shared/hooks/useGetW3blockIdSDK';
import { useHostname } from '../../../shared/hooks/useHostname';

interface Payload {
  email: string;
}

export const useRequestPasswordChange = () => {
  const getSDK = useGetW3blockIdSDK();
  const tenantId = useCompanyId();
  const hostName = useHostname();
  return useMutation(async ({ email }: Payload) => {
    const sdk = await getSDK();
    return sdk.api.auth.requestPasswordReset({
      email,
      tenantId,
      callbackUrl: new URL(
        PixwayAppRoutes.RESET_PASSWORD,
        `https://${hostName}`
      ).toString(),
    });
  });
};
