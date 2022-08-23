import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';

import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { useQueryParamState } from '../../../shared/hooks/useQueryParamState';
import { usePasswordValidationSchema } from '../../hooks/usePasswordValidationSchema';
import { useSignUp } from '../../hooks/useSignUp';
import { SignUpForm } from '../SignUpForm';
import { SignUpFormData } from '../SignUpForm/interface';
import { SignUpSuccess } from '../SignUpSuccess';

enum Steps {
  SIGN_UP = 1,
  SUCCESS,
}

const _SignUpTemplate = () => {
  const passwordSchema = usePasswordValidationSchema();
  const [step, setStep] = useQueryParamState<string>(
    'step',
    Steps.SIGN_UP.toString()
  );

  const { mutate, isLoading, isSuccess } = useSignUp();

  const schema = object().shape({
    email: string().email(),
    password: passwordSchema,
    confirmation: passwordSchema,
  });

  const methods = useForm<SignUpFormData>({
    defaultValues: {
      confirmation: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { email } = useWatch({ control: methods.control });

  useEffect(() => {
    if (isSuccess) {
      setStep(Steps.SUCCESS.toString());
    }
  }, [isSuccess, setStep]);

  const onSubmit = ({ confirmation, email, password }: SignUpFormData) => {
    //
    mutate({
      confirmation,
      email,
      password,
    });
  };

  return step === Steps.SIGN_UP.toString() ? (
    <SignUpForm isLoading={isLoading} onSubmit={onSubmit} />
  ) : (
    <SignUpSuccess email={email ?? ''} />
  );
};

export const SignUpTemplate = () => (
  <TranslatableComponent>
    <_SignUpTemplate />
  </TranslatableComponent>
);
