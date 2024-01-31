import { useMutation } from 'react-query';

import { I18NLocaleEnum, VerificationType } from '@w3block/sdk-id';

import { UtmContextInterface } from '../../../core/context/UtmContext';
import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useGetW3blockIdSDK } from '../../../shared/hooks/useGetW3blockIdSDK';
//import { useUtms } from '../../../shared/hooks/useUtms/useUtms';
import { useUtms } from '../../../shared/hooks/useUtms/useUtms';
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

export const useSignUp = () => {
  const getSDK = useGetW3blockIdSDK();
  const utms = useUtms();
  const { companyId } = useCompanyConfig();
  return useMutation([PixwayAPIRoutes.USERS], async (payload: Payload) => {
    const signUpPayload = payload;
    const ut = utms;
    if (utms.expires && utms?.expires > new Date().getTime()) {
      signUpPayload.utmParams = ut;
    }
    const sdk = await getSDK();
    return sdk.api.auth.signUp({
      ...signUpPayload,
      tenantId: companyId,
    });
  });
};
