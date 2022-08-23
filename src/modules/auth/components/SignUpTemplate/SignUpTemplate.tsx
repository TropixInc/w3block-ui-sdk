import { useEffect, useState } from 'react';

import { AxiosError } from 'axios';

import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useSignUp } from '../../hooks/useSignUp';
import { SignUpForm } from '../SignUpForm';
import { SignUpFormData } from '../SignUpForm/interface';
import { VerifySignUpMailSent } from '../VerifySignUpMailSent';

enum Steps {
  SIGN_UP = 1,
  SUCCESS,
}

const EMAIL_ALREADY_IN_USE_API_MESSAGE = 'email is already in use';

const _SignUpTemplate = () => {
  const [translate] = useTranslation();
  const [step, setStep] = useState(Steps.SIGN_UP);
  const { mutate, isLoading, isSuccess, error } = useSignUp();
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isSuccess) {
      setStep(Steps.SUCCESS);
    }
  }, [isSuccess, setStep]);

  const onSubmit = ({ confirmation, email, password }: SignUpFormData) => {
    setEmail(email);
    mutate({
      confirmation,
      email,
      password,
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
