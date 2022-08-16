import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { isAfter, isValid } from 'date-fns';
import { object, string } from 'yup';

import { Alert } from '../../../shared/components/Alert';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import useRouter from '../../../shared/hooks/useRouter';
import { useTimedBoolean } from '../../../shared/hooks/useTimedBoolean';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useChangePasswordAndSignIn } from '../../hooks/useChangePasswordAndSignIn';
import { usePasswordValidationSchema } from '../../hooks/usePasswordValidationSchema';
import { AuthButton } from '../AuthButton';
import { AuthFooter } from '../AuthFooter';
import { AuthLayoutBase } from '../AuthLayoutBase';
import { AuthPasswordChanged } from '../AuthPasswordChanged';
import { AuthPasswordTips } from '../AuthPasswordTips';
import { AuthTextController } from '../AuthTextController';
import { ExpiredToken } from '../ExpiredToken';
import { PasswordChangeMailSent } from '../PasswordChangeMailSent';

interface Form {
  password: string;
  confirmation: string;
}

enum Steps {
  PASSWORD_CHANGED = 2,
  EMAIL_SENT,
  EXPIRED_PASSWORD,
}

const _ResetPasswordTemplate = () => {
  const { logoUrl } = useCompanyConfig();
  const [translate] = useTranslation();
  const router = useRouter();
  const [isShowingErrorAlert, showErrorAlert] = useTimedBoolean(6000);
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
    if (isError && !isExpired && !isShowingErrorAlert) {
      showErrorAlert();
    }
  }, [isError, isExpired, isShowingErrorAlert, showErrorAlert]);

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
        router.push(PixwayAppRoutes.HOME);
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
      router.push(PixwayAppRoutes.HOME);
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
    return <PasswordChangeMailSent email={email as string} />;

  if (step === Steps.PASSWORD_CHANGED.toString())
    return <AuthPasswordChanged />;

  return step === Steps.EXPIRED_PASSWORD.toString() ? (
    <ExpiredToken
      email={email as string}
      onSendEmail={() =>
        router.replace({ query: { ...router.query, step: Steps.EMAIL_SENT } })
      }
    />
  ) : (
    <AuthLayoutBase
      classes={{
        root: '!pw-px-[26px] sm:!pw-px-5 !pw-pt-[63px] lg:!pw-pt-[28px]',
        contentContainer:
          '!pw-pt-0 sm:!pw-pt-[35px] sm:!pw-px-[35px] !pw-shadow-none sm:!pw-shadow-[1px_1px_10px_rgba(0,0,0,0.2)] !pw-bg-transparent sm:!pw-bg-white !pw-px-0 sm:!pw-px-[69px] !pw-max-w-none sm:!pw-max-w-[514px]',
        logo: 'w-[130px] h-[130px]',
      }}
      logo={logoUrl}
      title={translate('companyAuth>changePassword>title')}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="pw-mb-6 sm:pw-my-6"
        >
          <div className="px-3 sm:px-0 pw-mb-[21px]">
            <h2 className="pw-font-medium pw-text-lg pw-leading-[23px] pw-text-[#35394C] pw-text-center">
              {translate('auth>changePasswordForm>title')}
            </h2>
            {isShowingErrorAlert ? (
              <Alert
                variant="error"
                className="pw-flex !pw-justify-start pw-mt-3"
              >
                <Alert.Icon className="pw-mr-2" />
                {translate(
                  'companyAuth>changingPassword>errorChangingPasswordMessage'
                )}
              </Alert>
            ) : null}
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
          <AuthPasswordTips passwordFieldName="password" className="pw-mb-3" />
          <AuthButton
            fullWidth
            type="submit"
            disabled={!methods.formState.isValid || isLoading}
          >
            {translate('components>genericMessages>advance')}
          </AuthButton>
        </form>
        <AuthFooter />
      </FormProvider>
    </AuthLayoutBase>
  );
};

export const ResetPasswordTemplate = () => (
  <TranslatableComponent>
    <_ResetPasswordTemplate />
  </TranslatableComponent>
);
