import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { isAfter, isValid } from 'date-fns';
import { object, string } from 'yup';

import { Alert } from '../../../shared/components/Alert';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import useRouter from '../../../shared/hooks/useRouter';
import { useTimedBoolean } from '../../../shared/hooks/useTimedBoolean';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useChangePasswordAndSignIn } from '../../hooks/useChangePasswordAndSignIn';
import { usePasswordValidationSchema } from '../../hooks/usePasswordValidationSchema';
import { AuthButton } from '../AuthButton';
import { AuthFooter } from '../AuthFooter';
import { AuthLayoutBase } from '../AuthLayoutBase';
import { CompanyAuthPasswordChanged } from '../AuthPasswordChanged';
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
    if (!email || !token) {
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
      token: token as string,
    });
  };

  if (step === Steps.EMAIL_SENT.toString())
    return (
      <PasswordChangeMailSent companyId="" logo="" email={email as string} />
    );

  if (step === Steps.PASSWORD_CHANGED.toString())
    return <CompanyAuthPasswordChanged />;

  return step === Steps.EXPIRED_PASSWORD.toString() ? (
    <ExpiredToken
      email={email as string}
      onSendEmail={() =>
        router.replace({ query: { ...router.query, step: Steps.EMAIL_SENT } })
      }
    />
  ) : (
    <AuthLayoutBase
      classes={{ root: '!pw-pt-[20px] lg:!pw-pt-[28px]' }}
      logo=""
      title={translate('companyAuth>changePassword>title')}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="pw-my-6">
          <div className="pw-mb-[21px]">
            <h1 className="pw-text-[#35394C] pw-font-bold pw-text-2xl pw-leading-7 pw-text-center">
              {translate('companyAuth>changePassword>title')}
            </h1>
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
            className="pw-mb-3"
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
