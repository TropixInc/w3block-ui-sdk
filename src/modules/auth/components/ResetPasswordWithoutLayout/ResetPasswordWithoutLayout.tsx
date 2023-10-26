import { lazy, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import isAfter from 'date-fns/isAfter';
import isValid from 'date-fns/isValid';
import { object, string } from 'yup';

import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useChangePasswordAndSignIn } from '../../hooks/useChangePasswordAndSignIn';
import { usePasswordValidationSchema } from '../../hooks/usePasswordValidationSchema';
const AuthButton = lazy(() =>
  import('../AuthButton').then((m) => ({ default: m.AuthButton }))
);
const AuthErrorChagingPassword = lazy(() =>
  import('../AuthErrorChangingPassword').then((m) => ({
    default: m.AuthErrorChagingPassword,
  }))
);
const AuthPasswordChangedWithoutLayout = lazy(() =>
  import('../AuthPasswordChangedWithoutLayout').then((m) => ({
    default: m.AuthPasswordChangedWithoutLayout,
  }))
);
const AuthPasswordTips = lazy(() =>
  import('../AuthPasswordTips').then((m) => ({ default: m.AuthPasswordTips }))
);
const AuthTextController = lazy(() =>
  import('../AuthTextController').then((m) => ({
    default: m.AuthTextController,
  }))
);
const ExpiredTokenWithoutLayout = lazy(() =>
  import('../ExpiredTokenWithoutLayout').then((m) => ({
    default: m.ExpiredTokenWithoutLayout,
  }))
);
const PasswordChangeEmailSentWithoutLayout = lazy(() => {
  return import(
    '../PasswordChangeEmailSentWithoutLayout/PasswordChangeEmailSentWithoutLayout'
  ).then((m) => ({ default: m.PasswordChangeEmailSentWithoutLayout }));
});

interface Form {
  password: string;
  confirmation: string;
}

enum Steps {
  PASSWORD_CHANGED = 2,
  EMAIL_SENT,
  EXPIRED_PASSWORD,
  ERROR,
}

const _ResetPasswordWithoutLayout = () => {
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const passwordSchema = usePasswordValidationSchema();
  const { mutate, isLoading, isSuccess, isExpired, isError } =
    useChangePasswordAndSignIn();
  const { email, token, step } = router.query;

  const schema = object().shape({
    password: passwordSchema,
    confirmation: string()
      .required(translate('components>form>requiredFieldValidation'))
      .test(
        'passwordMatches',
        translate(
          'signUpForm>passwordConfirmationValidation>passwordDoesntMatch'
        ),
        (value, context) => value === context.parent.password
      ),
  });
  const methods = useForm<Form>({
    defaultValues: {
      confirmation: '',
      password: '',
    },
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isError && !isExpired && step !== Steps.ERROR.toString()) {
      router.push({
        query: {
          ...router.query,
          step: Steps.ERROR,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, isExpired, step]);

  useEffect(() => {
    if (isExpired && step !== Steps.EXPIRED_PASSWORD.toString()) {
      router.replace({
        query: { ...router.query, step: Steps.EXPIRED_PASSWORD },
      });
    }
  }, [isExpired, router, step]);

  useEffect(() => {
    if (token && !step) {
      const tokenSplitted = (token as string).split(';');
      if (tokenSplitted.length < 2) {
        router.pushConnect(PixwayAppRoutes.SIGN_IN);
      }
      const expirationDate = new Date(Number(tokenSplitted[1]));
      if (!isValid(expirationDate) || isAfter(new Date(), expirationDate)) {
        router.replace({
          query: { ...router.query, step: Steps.EXPIRED_PASSWORD },
        });
      }
    }
  }, [token, router, step]);

  useEffect(() => {
    if (router.isReady && (!email || !token)) {
      router.pushConnect(PixwayAppRoutes.SIGN_IN);
    }
  }, [email, token, router]);

  useEffect(() => {
    if (isSuccess && step !== Steps.PASSWORD_CHANGED.toString()) {
      router.push({
        query: { ...router.query, step: Steps.PASSWORD_CHANGED },
      });
    }
  }, [isSuccess, router, step]);

  const onSubmit = async ({ confirmation, password }: Form) => {
    mutate({
      confirmation,
      password,
      email: email as string,
      token: decodeURIComponent((token as string) ?? ''),
    });
  };

  if (step === Steps.EMAIL_SENT.toString())
    return <PasswordChangeEmailSentWithoutLayout email={email as string} />;

  if (step === Steps.PASSWORD_CHANGED.toString())
    return <AuthPasswordChangedWithoutLayout />;

  if (step === Steps.ERROR.toString())
    return (
      <AuthErrorChagingPassword
        onRetry={() => {
          router.push({
            query: {
              ...router.query,
              step: 1,
            },
          });
        }}
      />
    );

  return step === Steps.EXPIRED_PASSWORD.toString() ? (
    <ExpiredTokenWithoutLayout
      email={email as string}
      onSendEmail={() =>
        router.replace({ query: { ...router.query, step: Steps.EMAIL_SENT } })
      }
    />
  ) : (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="pw-mb-6 sm:pw-my-6"
      >
        <div className="px-3 sm:px-0 pw-mb-[21px]">
          <h2 className="pw-font-medium pw-text-lg pw-leading-[23px] pw-text-[#35394C] pw-text-center">
            {translate('auth>changePasswordForm>title')}
          </h2>
        </div>

        <AuthTextController
          label={translate('companyAuth>newPassword>passwordFieldLabel')}
          name="password"
          placeholder={translate(
            'companyAuth>changePassword>passworldFieldPlaceholder'
          )}
          type="password"
          className="pw-mb-3"
        />
        <AuthTextController
          label={translate(
            'companyAuth>newPassword>passwordConfirmationFieldLabel'
          )}
          name="confirmation"
          placeholder={translate(
            'companyAuth>newPassword>passwordConfirmationFieldLabel'
          )}
          type="password"
          className="pw-mb-[26px]"
        />
        <AuthPasswordTips passwordFieldName="password" className="pw-mb-6" />
        <AuthButton
          fullWidth
          type="submit"
          disabled={!methods.formState.isValid || isLoading}
        >
          {translate('components>genericMessages>advance')}
        </AuthButton>
      </form>
    </FormProvider>
  );
};

export const ResetPasswordWithoutLayout = () => (
  <TranslatableComponent>
    <_ResetPasswordWithoutLayout />
  </TranslatableComponent>
);
