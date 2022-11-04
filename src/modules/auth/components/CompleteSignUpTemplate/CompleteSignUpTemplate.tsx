import { useEffect, useState } from 'react';

import { isAfter } from 'date-fns';

import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import useRouter from '../../../shared/hooks/useRouter';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useChangePassword } from '../../hooks/useChangePassword';
import { AuthLayoutBaseClasses } from '../AuthLayoutBase';
import { CompleteSignUpSuccess } from '../CompleteSignUpSuccess';
import { SignUpForm } from '../SignUpForm';
import { SignUpFormData } from '../SignUpForm/interface';
import { VerifySignUpMailSent } from '../VerifySignUpMailSent';
import { VerifySignUpTokenExpired } from '../VerifySignUpTokenExpired';

enum Steps {
  FORM = 1,
  TOKEN_EXPIRED,
  CONFIRMATION_MAIL_SENT,
  MAIL_CONFIRMED,
}

interface Props {
  classes?: AuthLayoutBaseClasses;
  termsRedirectLink?: string;
  privacyRedirectLink?: string;
}

const getIsTokenExpired = (token: string) => {
  const tokenSplitted = token.split(';');
  if (tokenSplitted.length !== 2) {
    return true;
  }
  return isAfter(new Date(), new Date(Number(tokenSplitted[1])));
};

const _CompleteSignUpTemplate = ({
  classes = {},
  termsRedirectLink,
  privacyRedirectLink,
}: Props) => {
  const router = useRouter();
  const [translate] = useTranslation();
  const { email, token, tenantId } = router.query;
  const { mutate, isLoading, isSuccess, isError } = useChangePassword();
  const [step, setStep] = useState(() => {
    return token && getIsTokenExpired(token as string)
      ? Steps.TOKEN_EXPIRED
      : Steps.FORM;
  });

  useEffect(() => {
    if (isSuccess) setStep(Steps.MAIL_CONFIRMED);
  }, [isSuccess]);

  useEffect(() => {
    if (isError) setStep(Steps.TOKEN_EXPIRED);
  }, [isError]);

  useEffect(() => {
    if ((!token || !email) && router.isReady) {
      router.push(PixwayAppRoutes.HOME);
    }
  }, [token, email, router]);

  useEffect(() => {
    if (token && getIsTokenExpired(token as string)) {
      setStep(Steps.TOKEN_EXPIRED);
    }
  }, [token]);

  const onSubmit = ({ confirmation, password }: SignUpFormData) => {
    mutate({
      email: email as string,
      password,
      confirmation,
      token: token as string,
    });
  };

  if (step === Steps.TOKEN_EXPIRED)
    return (
      <VerifySignUpTokenExpired
        email={email as string}
        tenantId={tenantId as string | undefined}
        onSendEmail={() => setStep(Steps.CONFIRMATION_MAIL_SENT)}
        classes={classes}
        isPostSignUp
      />
    );

  if (step === Steps.CONFIRMATION_MAIL_SENT)
    return (
      <VerifySignUpMailSent
        email={email as string}
        tenantId={tenantId as string | undefined}
        classes={classes}
        isPostSignUp
      />
    );

  return step === Steps.FORM ? (
    <SignUpForm
      email={email as string}
      isLoading={isLoading}
      onSubmit={onSubmit}
      error={
        isError ? translate('auth>signUpError>genericErrorMessage') : undefined
      }
      classes={classes}
      privacyRedirect={privacyRedirectLink}
      termsRedirect={termsRedirectLink}
    />
  ) : (
    <CompleteSignUpSuccess classes={classes} />
  );
};

export const CompleteSignUpTemplate = (props: Props) => (
  <TranslatableComponent>
    <_CompleteSignUpTemplate {...props} />
  </TranslatableComponent>
);
