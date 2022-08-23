import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useGetW3blockIdSDK } from '../../../shared/hooks/useGetW3blockIdSDK';
import { useHostname } from '../../../shared/hooks/useHostname';

interface Payload {
  email: string;
}

export const useRequestConfirmationMail = () => {
  const getSDK = useGetW3blockIdSDK();
  const { companyId } = useCompanyConfig();
  const hostName = useHostname();
  return useMutation(
    [PixwayAPIRoutes.REQUEST_CONFIRMATION_MAIL],
    async ({ email }: Payload) => {
      const sdk = await getSDK();
      return sdk.api.auth.requestConfirmationEmail({
        email,
        tenantId: companyId,
        callbackUrl: new URL(
          PixwayAppRoutes.SIGN_UP_MAIL_CONFIRMATION,
          `https://${hostName}/`
        ).toString(),
      });
    }
  );
};
