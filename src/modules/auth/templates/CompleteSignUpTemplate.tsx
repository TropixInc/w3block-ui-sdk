import { useEffect, useState } from 'react';

import isAfter from 'date-fns/isAfter';
import { AuthLayoutBaseClasses } from '../components/AuthLayoutBase';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { useTranslation } from 'react-i18next';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePixwayAuthentication } from '../hooks/usePixwayAuthentication';
import { useChangePassword } from '../hooks/useChangePassword';
import { SignUpFormData } from '../interface/SignUpFormData';
import { VerifySignUpTokenExpired } from '../components/VerifySignUpTokenExpired';
import { VerifySignUpMailSent } from '../components/VerifySignUpMailSent';
import { SignUpForm } from '../components/SignUpForm';
import { CompleteSignUpSuccess } from '../components/CompleteSignUpSuccess';
import TranslatableComponent from '../../shared/components/TranslatableComponent';



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
  afterLoginRedirectLink?: string;
  hasWhitelist?: boolean;
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
  termsRedirectLink = PixwayAppRoutes.TERMS_CONDITIONS,
  privacyRedirectLink = PixwayAppRoutes.PRIVACY_POLICY,
  afterLoginRedirectLink = PixwayAppRoutes.COMPLETE_KYC,
}: Props) => {
  const router = useRouterConnect();
  const [translate] = useTranslation();
  const { pushConnect } = useRouterConnect();
  const { companyId } = useCompanyConfig();
  const [password, setPassword] = useState<string>();
  const { signOut, signIn } = usePixwayAuthentication();
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
      router.push(PixwayAppRoutes.COMPLETE_KYC);
    }
  }, [token, email, router]);

  useEffect(() => {
    if (token && getIsTokenExpired(token as string)) {
      setStep(Steps.TOKEN_EXPIRED);
    }
  }, [token]);

  const onSubmit = ({ confirmation, password }: SignUpFormData) => {
    mutate(
      {
        email: email as string,
        password,
        confirmation,
        token: token as string,
      },
      {
        onSuccess() {
          setPassword(password);
        },
      }
    );
  };

  const handleContinue = () => {
    signOut().then(() => {
      signIn({
        email: email as string,
        password: password as string,
        companyId: companyId,
      }).then(() => pushConnect(afterLoginRedirectLink));
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
    <CompleteSignUpSuccess handleContinue={handleContinue} classes={classes} />
  );
};

export const CompleteSignUpTemplate = (props: Props) => (
  <TranslatableComponent>
    <_CompleteSignUpTemplate {...props} />
  </TranslatableComponent>
);
