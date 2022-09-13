import { useMutation } from 'react-query';

import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useGetW3blockIdSDK } from '../../../shared/hooks/useGetW3blockIdSDK';

interface Payload {
  email: string;
}

export const useRequestPasswordChange = () => {
  const getSDK = useGetW3blockIdSDK();
  const { appBaseUrl, companyId: tenantId } = useCompanyConfig();
  return useMutation(async ({ email }: Payload) => {
    const sdk = await getSDK();
    return sdk.api.auth.requestPasswordReset({
      email,
      tenantId,
      callbackUrl: new URL(
        PixwayAppRoutes.RESET_PASSWORD,
        appBaseUrl
      ).toString(),
    });
  });
};
