import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';

import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { boolean, object, string } from 'yup';

import { Alert } from '../../../shared/components/Alert';
import { Link } from '../../../shared/components/Link';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import useTranslation from '../../../shared/hooks/useTranslation';
import { usePasswordValidationSchema } from '../../hooks/usePasswordValidationSchema';
import { AuthButton } from '../AuthButton';
import { AuthCheckbox } from '../AuthCheckbox/AuthCheckbox';
import { AuthFooter } from '../AuthFooter';
import { AuthLayoutBase, AuthLayoutBaseClasses } from '../AuthLayoutBase';
import { AuthPasswordTips } from '../AuthPasswordTips';
import { AuthTextController } from '../AuthTextController';
import { SignUpFormData } from './interface';

interface Props {
  onSubmit: (data: SignUpFormData) => void;
  isLoading: boolean;
  email?: string;
  error?: string;
  classes?: AuthLayoutBaseClasses;
  privacyRedirect?: string;
  termsRedirect?: string;
}

export const SignUpForm = ({
  onSubmit,
  isLoading,
  email,
  error,
  classes = {},
  privacyRedirect,
  termsRedirect,
}: Props) => {
  const { logoUrl } = useCompanyConfig();
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
    <AuthLayoutBase
      logo={logoUrl}
      title={translate('auth>signUpForm>formTitle')}
      classes={{
        contentContainer: classNames(
          '!pw-px-[22px] sm:!pw-px-[35px] !pw-pb-14 sm:!pw-pb-[35px]',
          classes.contentContainer ?? ''
        ),
        logo: classes.logo ?? '',
      }}
    >
      {error ? (
        <Alert
          variant="error"
          className="pw-flex pw-items-center pw-gap-x-2 pw-my-3"
        >
          <Alert.Icon /> <span className="pw-text-xs">{error}</span>
        </Alert>
      ) : null}
      <FormProvider {...methods}>
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
  );
};
