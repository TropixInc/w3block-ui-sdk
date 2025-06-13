

import { I18NLocaleEnum, VerificationType } from '@w3block/sdk-id';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { useMutation } from '@tanstack/react-query';
import { UtmContextInterface } from '../../core/context/UtmContext';
import { useGetW3blockIdSDK } from '../../shared/hooks/useGetW3blockIdSDK';
import { useUtms } from '../../shared/hooks/useUtms';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';

interface Payload {
  password: string;
  confirmation: string;
  email: string;
  tenantId?: string;
  name?: string;
  i18nLocale?: I18NLocaleEnum;
  callbackUrl?: string;
  utmParams?: UtmContextInterface;
  verificationType?: VerificationType;
}

export const useSignUp = (): any => {
  const getSDK = useGetW3blockIdSDK();
  const utms = useUtms();
  const { companyId } = useCompanyConfig();
  return useMutation([PixwayAPIRoutes.USERS], async (payload: Payload) => {
    const signUpPayload = payload;
    const ut = utms;
    if (ut) {
      console.log('utm found in signup:', ut);
    } else {
      console.log('utm not found');
    }
    const sdk = await getSDK();
    return sdk.api.auth.signUp({
      ...signUpPayload,
      utmParams: ut,
      tenantId: companyId,
    });
  });
};
