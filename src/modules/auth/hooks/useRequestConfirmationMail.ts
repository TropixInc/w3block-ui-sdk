

import { VerificationType } from '@w3block/sdk-id';

import { useMutation } from '@tanstack/react-query';
import { useGetW3blockIdSDK } from '../../shared/hooks/useGetW3blockIdSDK';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { removeDoubleSlashesOnUrl } from '../../shared/utils/removeDuplicateSlahes';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { handleNetworkException } from '../../shared/utils/handleNetworkException';



interface Payload {
  email: string;
  tenantId?: string;
  callbackPath?: string;
  verificationType?: 'numeric' | 'invisible';
}

export const useRequestConfirmationMail = (): any => {
  const getSDK = useGetW3blockIdSDK();
  const { companyId, appBaseUrl, connectProxyPass } = useCompanyConfig();

  return useMutation(
    [PixwayAPIRoutes.REQUEST_CONFIRMATION_MAIL],
    async ({ email, tenantId, callbackPath, verificationType }: Payload) => {
      try {
        const sdk = await getSDK();
        return await sdk.api.auth.requestConfirmationEmail({
          email,
          verificationType:
            (verificationType as VerificationType) ??
            VerificationType.Invisible,
          tenantId: tenantId ?? companyId,
          callbackUrl: removeDoubleSlashesOnUrl(
            callbackPath ??
              appBaseUrl + connectProxyPass + PixwayAppRoutes.COMPLETE_SIGNUP
          ).toString(),
        });
      } catch (error) {
        console.error('Erro ao solicitar e-mail de confirmação:', error);
        throw handleNetworkException(error);
      }
    }
  );
};
