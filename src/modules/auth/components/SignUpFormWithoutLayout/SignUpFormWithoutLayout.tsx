import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation, Trans } from 'react-i18next';

import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, boolean } from 'yup';

import { Alert } from '../../../shared/components/Alert';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { usePasswordValidationSchema } from '../../hooks/usePasswordValidationSchema';
import { AuthButton } from '../AuthButton';
import { AuthCheckbox } from '../AuthCheckbox';
import { AuthFooter } from '../AuthFooter';
import { AuthLayoutBaseClasses } from '../AuthLayoutBase';
import { AuthPasswordTips } from '../AuthPasswordTips';
import { AuthTextController } from '../AuthTextController';
import { SignUpFormData } from '../SignUpForm/interface';

interface Props {
  onSubmit: (data: SignUpFormData) => void;
  isLoading: boolean;
  email?: string;
  error?: string;
  classes?: AuthLayoutBaseClasses;
  privacyRedirect?: string;
  termsRedirect?: string;
  title?: string;
}

export const SignUpFormWithoutLayout = ({
  onSubmit,
  isLoading,
  email,
  error,
  privacyRedirect = PixwayAppRoutes.PRIVACY_POLICY,
  termsRedirect = PixwayAppRoutes.TERMS_CONDITIONS,
  title,
}: Props) => {
  const passwordSchema = usePasswordValidationSchema();
  const [translate] = useTranslation();

  const schema = object().shape({
    email: string().email(),
    password: passwordSchema,
    confirmation: passwordSchema,
    acceptsPolicyTerms: boolean().required().isTrue(),
    acceptsTermsOfUse: boolean().required().isTrue(),
  });

  const methods = useForm<SignUpFormData>({
    defaultValues: {
      confirmation: '',
      email: email ?? '',
      password: '',
      acceptsPolicyTerms: false,
      acceptsTermsOfUse: false,
    },
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (email) methods.setValue('email', email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  return (
    <div>
      {error ? (
        <Alert
          variant="error"
          className="pw-flex pw-items-center pw-gap-x-2 pw-my-3"
        >
          <Alert.Icon /> <span className="pw-text-xs">{error}</span>
        </Alert>
      ) : null}
      <FormProvider {...methods}>
        {title ? (
          <p className="pw-font-poppins pw-text-[24px] pw-text-[#35394C] pw-mb-8 pw-text-center pw-font-[700]">
            {title}
          </p>
        ) : null}

        <form onSubmit={methods.handleSubmit(onSubmit)} className="sm:pw-mt-6">
          <AuthTextController
            disabled={Boolean(email)}
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
            type="password"
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
            type="password"
          />
          <AuthPasswordTips passwordFieldName="password" className="pw-mb-6" />
          <div className="pw-flex pw-flex-col pw-gap-y-[4.5px] pw-mb-[26px]">
            <AuthCheckbox
              name="acceptsTermsOfUse"
              label="Aceito os"
              keyTrans="companyAuth>signUp>acceptTermsOfUse"
              linkText="Termos de uso"
              redirectLink={termsRedirect}
            />
            <AuthCheckbox
              name="acceptsPolicyTerms"
              keyTrans="companyAuth>signUp>acceptPrivacyPolicy"
              linkText="Política de Privacidade"
              label="Aceito os"
              redirectLink={privacyRedirect}
            />
          </div>

          <AuthButton
            type="submit"
            fullWidth
            className="pw-mb-1"
            disabled={isLoading || !methods.formState.isValid}
          >
            {translate('components>advanceButton>continue')}
          </AuthButton>
          <p className="pw-font-poppins pw-text-[13px] pw-leading-[19.5px] pw-text-center pw-mb-[27px]">
            <Trans i18nKey={'auth>signUpForm>alreadyHaveAccount'}>
              Já possui uma conta?
              <a
                className="pw-text-brand-primary pw-underline"
                href={PixwayAppRoutes.SIGN_IN}
              >
                Login
              </a>
            </Trans>
          </p>
          <AuthFooter />
        </form>
      </FormProvider>
    </div>
  );
};
