import { useEffect } from 'react';

import { isAfter } from 'date-fns';

import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useQueryParamState } from '../../../shared/hooks/useQueryParamState';
import useRouter from '../../../shared/hooks/useRouter';
import { useVerifySignUp } from '../../hooks/useVerifySignUp';
import { AuthLayoutBase } from '../AuthLayoutBase';

enum Steps {
  LOADING = 1,
  EMAIL_VERIFIED,
  TOKEN_EXPIRED,
  EMAIL_SENT,
}

export const MailConfirmationTemplate = () => {
  const { logoUrl } = useCompanyConfig();
  const { mutate, isLoading } = useVerifySignUp();
  const router = useRouter();
  const { email, token } = router.query;
  const [step, setStep] = useQueryParamState<string>(
    'step',
    Steps.LOADING.toString()
  );

  /*
  useEffect(() => {
    if (step) setStep(Steps.LOADING.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  */

  useEffect(() => {
    if (
      email &&
      token &&
      !Array.isArray(email) &&
      !Array.isArray(token) &&
      step === Steps.LOADING.toString()
    ) {
      const tokenSplitted = token.split(';');
      if (tokenSplitted.length !== 2) router.push(PixwayAppRoutes.HOME);
      else {
        const timeStamp = tokenSplitted[1];
        if (isAfter(new Date(), new Date(timeStamp)))
          setStep(Steps.TOKEN_EXPIRED.toString());
        else mutate({ email: email as string, token: token as string });
      }
    } else {
      router.push(PixwayAppRoutes.HOME);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutate, email, token]);

  return isLoading ? null : (
    <AuthLayoutBase logo={logoUrl} title="Email confirmado com sucesso">
      aeeehooo caralho
    </AuthLayoutBase>
  );
};
