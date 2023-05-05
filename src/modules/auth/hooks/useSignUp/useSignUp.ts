import { useMutation } from 'react-query';

import { I18NLocaleEnum, VerificationType } from '@w3block/sdk-id';

import { UtmContextInterface } from '../../../core/context/UtmContext';
import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useGetW3blockIdSDK } from '../../../shared/hooks/useGetW3blockIdSDK';
//import { useUtms } from '../../../shared/hooks/useUtms/useUtms';
import { removeDoubleSlashesOnUrl } from '../../../shared/utils/removeDuplicateSlahes';

interface Payload {
  password: string;
  confirmation: string;
  email: string;
  tenantId?: string;
  name?: string;
  i18nLocale?: I18NLocaleEnum;
  callbackUrl?: string;
  utmParams?: UtmContextInterface;
}

export const useSignUp = () => {
  const getSDK = useGetW3blockIdSDK();
  // const utms = useUtms();
  const { companyId, appBaseUrl, connectProxyPass } = useCompanyConfig();
  return useMutation([PixwayAPIRoutes.USERS], async (payload: Payload) => {
    const signUpPayload = payload;
    // const ut = utms;
    // if (utms.expires && utms?.expires > new Date().getTime()) {
    //   delete ut.expires;
    //   payload.utmParams = ut;
    // }
    const sdk = await getSDK();
    return sdk.api.auth.signUp({
      ...signUpPayload,
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
