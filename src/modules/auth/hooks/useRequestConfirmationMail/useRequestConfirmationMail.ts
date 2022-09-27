import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useGetW3blockIdSDK } from '../../../shared/hooks/useGetW3blockIdSDK';

interface Payload {
  email: string;
  tenantId?: string;
  callbackPath?: PixwayAppRoutes;
}

export const useRequestConfirmationMail = () => {
  const getSDK = useGetW3blockIdSDK();
  const { companyId, appBaseUrl } = useCompanyConfig();
  return useMutation(
    [PixwayAPIRoutes.REQUEST_CONFIRMATION_MAIL],
    async ({ email, tenantId, callbackPath }: Payload) => {
      const sdk = await getSDK();
      return sdk.api.auth.requestConfirmationEmail({
        email,
        tenantId: tenantId ?? companyId,
        callbackUrl: new URL(
          callbackPath ?? PixwayAppRoutes.SIGN_UP_MAIL_CONFIRMATION,
          appBaseUrl
        ).toString(),
      });
    }
  );
};
