import { lazy, useEffect, useState } from 'react';
import { useDebounce } from 'react-use';

import isAfter from 'date-fns/isAfter';

import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useVerifySignUp } from '../hooks/useVerifySignUp';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { VerifySignUpTokenExpired } from '../components/VerifySignUpTokenExpired';
import { VerifySignUpMailSent } from '../components/VerifySignUpMailSent';
import { AuthLayoutBase } from '../components/AuthLayoutBase';
import { AuthButton } from '../components/AuthButton';
import { AuthFooter } from '../components/AuthFooter';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import useTranslation from '../../shared/hooks/useTranslation';


enum Steps {
  LOADING = 1,
  EMAIL_VERIFIED,
  TOKEN_EXPIRED,
  EMAIL_SENT,
}

const TIME_TO_REDIRECT_TO_HOME = 6000;

const _MailConfirmationTemplate = () => {
  const [translate] = useTranslation();
  const { logoUrl } = useCompanyConfig();
  const { mutate, isLoading, isSuccess, isError } = useVerifySignUp();
  const router = useRouterConnect();
  const { email, token } = router.query;
  const [step, setStep] = useState(Steps.LOADING);

  const [_, cancel] = useDebounce(
    () => {
      if (step === Steps.EMAIL_VERIFIED) {
        router.pushConnect(PixwayAppRoutes.SIGN_IN);
      }
    },
    TIME_TO_REDIRECT_TO_HOME,
    [step]
  );

  useEffect(() => {
    if (step) setStep(Steps.LOADING);
    return cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if ((!token || !email) && router.isReady && step === Steps.LOADING) {
      router.push(PixwayAppRoutes.HOME);
    }
  }, [token, email, router, step]);

  useEffect(() => {
    if (isSuccess && step !== Steps.EMAIL_VERIFIED) {
      setStep(Steps.EMAIL_VERIFIED);
    }
  }, [isSuccess, step, setStep]);

  useEffect(() => {
    if (isError && step !== Steps.TOKEN_EXPIRED) {
      setStep(Steps.TOKEN_EXPIRED);
    }
  }, [isError, step, setStep]);

  useEffect(() => {
    if (
      router.isReady &&
      email &&
      token &&
      !Array.isArray(email) &&
      !Array.isArray(token) &&
      step === Steps.LOADING
    ) {
      const tokenSplitted = token.split(';');
      if (tokenSplitted.length !== 2) router.push(PixwayAppRoutes.HOME);
      else {
        const timeStamp = Number(tokenSplitted[1]);
        if (isAfter(new Date(), new Date(timeStamp)))
          setStep(Steps.TOKEN_EXPIRED);
        else if (!isLoading && !isError)
          mutate({ email: email as string, token: token as string });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutate, email, token, router]);

  if (step === Steps.TOKEN_EXPIRED)
    return (
      <VerifySignUpTokenExpired
        email={email as string}
        onSendEmail={() => setStep(Steps.EMAIL_SENT)}
      />
    );

  if (step === Steps.EMAIL_SENT)
    return <VerifySignUpMailSent email={email as string} />;

  return isLoading || !step || step === Steps.LOADING ? null : (
    <AuthLayoutBase
      logo={logoUrl}
      title={translate('auth>verifySignUp>mailVerifiedStepTitle')}
    >
      <p className="pw-text-[13px] pw-leading-4 pw-text-[#353945] pw-my-[18px]">
        {translate('auth>verifySignUp>waitForRedirectionMessage')}
      </p>
      <AuthButton
        fullWidth
        onClick={() => router.pushConnect(PixwayAppRoutes.SIGN_IN)}
        className="pw-mb-[18px]"
      >
        {translate('loginPage>formSubmitButton>signIn')}
      </AuthButton>
      <AuthFooter />
    </AuthLayoutBase>
  );
};

export const MailConfirmationTemplate = () => (
  <TranslatableComponent>
    <_MailConfirmationTemplate />
  </TranslatableComponent>
);
