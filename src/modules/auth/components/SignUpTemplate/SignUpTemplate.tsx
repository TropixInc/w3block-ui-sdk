import { useEffect } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Trans } from 'react-i18next';

import { yupResolver } from '@hookform/resolvers/yup';
import { I18NLocaleEnum, UserRoleEnum } from '@w3block/sdk-id';
import { object, string } from 'yup';

import { Link } from '../../../shared';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useQueryParamState } from '../../../shared/hooks/useQueryParamState';
import useTranslation from '../../../shared/hooks/useTranslation';
import { usePasswordValidationSchema } from '../../hooks/usePasswordValidationSchema';
import { useSignUp } from '../../hooks/useSignUp';
import { AuthButton } from '../AuthButton';
import { AuthFooter } from '../AuthFooter';
import { AuthLayoutBase } from '../AuthLayoutBase';
import { AuthPasswordTips } from '../AuthPasswordTips';
import { AuthTextController } from '../AuthTextController';
import { SignUpSuccess } from '../SignUpSuccess';

interface Form {
  email: string;
  password: string;
  confirmation: string;
}

enum Steps {
  SIGN_UP = 1,
  SUCCESS,
}

const _SignUpTemplate = () => {
  const { logoUrl, companyId } = useCompanyConfig();
  const passwordSchema = usePasswordValidationSchema();
  const [translate] = useTranslation();
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

  const methods = useForm<Form>({
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

  const onSubmit = ({ confirmation, email, password }: Form) => {
    //
    mutate({
      confirmation,
      email,
      password,
      name: '',
      i18nLocale: I18NLocaleEnum.PtBr,
      role: UserRoleEnum.User,
      tenantId: companyId,
    });
  };

  return step === Steps.SIGN_UP.toString() ? (
    <AuthLayoutBase
      logo={logoUrl}
      title={translate('auth>signUpForm>formTitle')}
      classes={{
        contentContainer:
          '!pw-px-[22px] sm:!pw-px-[35px] !pw-pb-14 sm:!pw-pb-[35px]',
      }}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <AuthTextController
            name="email"
            label={translate('home>contactModal>email')}
            className="pw-mb-3"
            placeholder={translate('companyAuth>newPassword>enterYourEmail')}
          />
          <AuthTextController
            name="password"
            label={translate('companyAuth>newPassword>passwordFieldLabel')}
            className="pw-mb-3"
            placeholder={translate('companyAuth>newPassword>enterYourPassword')}
          />
          <AuthTextController
            name="confirmation"
            label={translate(
              'companyAuth>newPassword>passwordConfirmationFieldLabel'
            )}
            className="pw-mb-6"
            placeholder={translate(
              'companyAuth>newPassword>passwordConfirmationFieldLabel'
            )}
          />
          <AuthPasswordTips passwordFieldName="password" className="pw-mb-6" />
          <AuthButton
            fullWidth
            className="pw-mb-1"
            disabled={isLoading || !methods.formState.isValid}
          >
            {translate('components>advanceButton>continue')}
          </AuthButton>
          <p className="pw-font-poppins pw-text-[13px] pw-leading-[19.5px] pw-text-center pw-mb-[27px]">
            <Trans i18nKey={'auth>signUpForm>alreadyHaveAccount'}>
              Já possui uma conta?
              <Link
                className="pw-text-brand-primary pw-underline"
                href={PixwayAppRoutes.SIGN_IN}
              >
                Login
              </Link>
            </Trans>
          </p>
          <AuthFooter />
        </form>
      </FormProvider>
    </AuthLayoutBase>
  ) : (
    <SignUpSuccess email={email ?? ''} />
  );
};

export const SignUpTemplate = () => (
  <TranslatableComponent>
    <_SignUpTemplate />
  </TranslatableComponent>
);
