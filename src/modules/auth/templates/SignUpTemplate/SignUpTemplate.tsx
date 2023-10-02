import { useEffect, useState } from 'react';

import { I18NLocaleEnum } from '@w3block/sdk-id';
import { AxiosError } from 'axios';

import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import useTranslation from '../../../shared/hooks/useTranslation';
import { SignUpForm } from '../../components/SignUpForm';
import { SignUpFormData } from '../../components/SignUpForm/interface';
import { VerifySignUpMailSent } from '../../components/VerifySignUpMailSent';
import { useSignUp } from '../../hooks/useSignUp';

enum Steps {
  SIGN_UP = 1,
  SUCCESS,
}

interface Config {
  privacyRedirect?: string;
  termsRedirect?: string;
}

export const EMAIL_ALREADY_IN_USE_API_MESSAGE = 'email is already in use';

const _SignUpTemplate = ({
  privacyRedirect = PixwayAppRoutes.PRIVACY_POLICY,
  termsRedirect = PixwayAppRoutes.TERMS_CONDITIONS,
}: Config) => {
  const [translate] = useTranslation();
  const [step, setStep] = useState(Steps.SIGN_UP);
  const { mutate, isLoading, isSuccess, error } = useSignUp();
  const [email, setEmail] = useState('');
  const { connectProxyPass, companyId } = useCompanyConfig();
  const [language, _] = useState(() => {
    if (window) {
      return window?.navigator?.language === 'pt-BR'
        ? I18NLocaleEnum.PtBr
        : I18NLocaleEnum.En;
    }
  });

  useEffect(() => {
    if (isSuccess) {
      setStep(Steps.SUCCESS);
    }
  }, [isSuccess]);

  const onSubmit = ({ confirmation, email, password }: SignUpFormData) => {
    setEmail(email);
    mutate({
      confirmation,
      email,
      password,
      callbackUrl: connectProxyPass + PixwayAppRoutes.SIGN_UP_MAIL_CONFIRMATION,
      tenantId: companyId,
      i18nLocale: language,
    });
  };

  const getErrorMessage = () => {
    if (!error) return undefined;
    const typedError = error as AxiosError;
    return (typedError.response?.data as Record<string, string>)?.message ===
      EMAIL_ALREADY_IN_USE_API_MESSAGE
      ? translate('auth>signUpError>emailAlreadyInUse')
      : translate('auth>signUpError>genericErrorMessage');
  };

  return step === Steps.SIGN_UP ? (
    <SignUpForm
      isLoading={isLoading}
      onSubmit={onSubmit}
      error={getErrorMessage()}
      termsRedirect={termsRedirect}
      privacyRedirect={privacyRedirect}
    />
  ) : (
    <VerifySignUpMailSent email={email ?? ''} />
  );
};

export const SignUpTemplate = () => (
  <TranslatableComponent>
    <_SignUpTemplate />
  </TranslatableComponent>
);
