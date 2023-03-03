import { useMutation } from 'react-query';

import { I18NLocaleEnum, VerificationType } from '@w3block/sdk-id';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useGetW3blockIdSDK } from '../../../shared/hooks/useGetW3blockIdSDK';
import { removeDoubleSlashesOnUrl } from '../../../shared/utils/removeDuplicateSlahes';

interface Payload {
  password: string;
  confirmation: string;
  email: string;
  tenantId?: string;
  name?: string;
  i18nLocale?: I18NLocaleEnum;
  callbackUrl?: string;
}

export const useSignUp = () => {
  const getSDK = useGetW3blockIdSDK();
  const { companyId, appBaseUrl, connectProxyPass } = useCompanyConfig();
  return useMutation([PixwayAPIRoutes.USERS], async (payload: Payload) => {
    const sdk = await getSDK();
    return sdk.api.auth.signUp({
      ...payload,
      tenantId: companyId,
      verificationType: VerificationType.Numeric,
      callbackUrl:
        payload.callbackUrl ??
        removeDoubleSlashesOnUrl(
          appBaseUrl +
            connectProxyPass +
            PixwayAppRoutes.SIGN_UP_MAIL_CONFIRMATION
        ),
    });
  });
};
