import { useMutation } from 'react-query';

import { VerificationType } from '@w3block/sdk-id';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useGetW3blockIdSDK } from '../../../shared/hooks/useGetW3blockIdSDK';
import { removeDoubleSlashesOnUrl } from '../../../shared/utils/removeDuplicateSlahes';

interface Payload {
  email: string;
  tenantId?: string;
  callbackPath?: string;
  verificationType?: 'numeric' | 'invisible';
}

export const useRequestConfirmationMail = () => {
  const getSDK = useGetW3blockIdSDK();
  const { companyId, appBaseUrl, connectProxyPass } = useCompanyConfig();
  return useMutation(
    [PixwayAPIRoutes.REQUEST_CONFIRMATION_MAIL],
    async ({ email, tenantId, callbackPath, verificationType }: Payload) => {
      const sdk = await getSDK();
      return sdk.api.auth.requestConfirmationEmail({
        email,
        verificationType:
          (verificationType as VerificationType) ?? VerificationType.Invisible,
        tenantId: tenantId ?? companyId,
        callbackUrl: removeDoubleSlashesOnUrl(
          callbackPath ??
            appBaseUrl + connectProxyPass + PixwayAppRoutes.COMPLETE_SIGNUP
        ).toString(),
      });
    }
  );
};
