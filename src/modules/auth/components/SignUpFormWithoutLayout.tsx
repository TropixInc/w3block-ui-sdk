/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import { yupResolver } from '@hookform/resolvers/yup';
import { I18NLocaleEnum, VerificationType } from '@w3block/sdk-id';
import { AxiosError } from 'axios';
import { boolean, object, string } from 'yup';
import { AuthLayoutBaseClasses, SignUpFormData } from '../../shared/interfaces/SignUpFormData';
import { useGetTenantInfoByHostname } from '../../shared/hooks/useGetTenantInfoByHostname';
import { usePasswordValidationSchema } from '../hooks/usePasswordValidationSchema';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { useSignUp } from '../hooks/useSignUp';
import { usePixwayAuthentication } from '../hooks/usePixwayAuthentication';
import { useThemeConfig } from '../../storefront/hooks/useThemeConfig';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { removeDoubleSlashesOnUrl } from '../../shared/utils/removeDuplicateSlahes';
import { AuthTextController } from './AuthTextController';
import { AuthButton } from './AuthButton';
import { AuthPasswordTips } from './AuthPasswordTips';
import { AuthCheckbox } from './AuthCheckbox';
import { AuthFooter } from './AuthFooter';
import { Alert } from '../../shared/components/Alert';
import { VerifySignUpWithCodeWithoutLayout } from './VerifySignUpWithCodeWithoutLayout';




interface Props {
  onSubmit?: (data: SignUpFormData) => void;
  isLoading?: boolean;
  email?: string;
  error?: string;
  classes?: AuthLayoutBaseClasses;
  privacyRedirect?: string;
  termsRedirect?: string;
  title?: string;
  hasSignUp?: boolean;
}

enum Steps {
  SIGN_UP = 1,
  SUCCESS,
}

export const EMAIL_ALREADY_IN_USE_API_MESSAGE = 'email is already in use';

export const SignUpFormWithoutLayout = ({
  onSubmit,
  isLoading,
  email,
  error,
  privacyRedirect = 'https://w3block.io/en/privacy-policy',
  termsRedirect = 'https://w3block.io/en/terms',
  title,
}: Props) => {
  const { data: companyInfo } = useGetTenantInfoByHostname();
  const isPasswordless = companyInfo?.configuration?.passwordless?.enabled;
  const passwordSchema = usePasswordValidationSchema({ isPasswordless });
  const { appBaseUrl, connectProxyPass, companyId } = useCompanyConfig();
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const [step, setStep] = useState(Steps.SIGN_UP);
  const [emailLocal, setEmail] = useState('');
  const [language, _] = useState(() => {
    if (window) {
      return window?.navigator?.language === 'pt-BR'
        ? I18NLocaleEnum.PtBr
        : I18NLocaleEnum.En;
    }
  });

  const {
    mutate,
    isLoading: signUpLoading,
    error: signUpError,
    isSuccess,
  } = useSignUp();

  const { signInAfterSignUp } = usePixwayAuthentication();

  const queryString = new URLSearchParams(router.query as any).toString();

  useEffect(() => {
    if (isSuccess && !isPasswordless) {
      setStep(Steps.SUCCESS);
    }
  }, [isSuccess]);

  const theme = useThemeConfig();
  const postSigninURL =
    theme?.defaultTheme?.configurations?.contentData?.postSigninURL;

  const skipWallet =
    theme?.defaultTheme?.configurations?.contentData?.skipWallet;

  const onSubmitLocal = ({ confirmation, email, password }: SignUpFormData) => {
    setEmail(email);
    if (isPasswordless) {
      signInAfterSignUp &&
        signInAfterSignUp({ email, tenantId: companyId }).then((e: { error: string; status: number; }) => {
          if (
            e.error === EMAIL_ALREADY_IN_USE_API_MESSAGE &&
            e.status === 401
          ) {
            router.pushConnect(PixwayAppRoutes.SIGNIN_WITH_CODE, {
              email,
              ...router.query,
            });
          } else if (e.status === 200) {
            if (router.query.callbackPath?.length) {
              router.pushConnect(router.query.callbackPath as string);
            } else if (router.query.callbackUrl?.length) {
              router.pushConnect(router.query.callbackUrl as string);
            } else if (router.query.contextSlug?.length) {
              router.pushConnect(PixwayAppRoutes.COMPLETE_KYC, {
                ...router.query,
              });
            } else if (postSigninURL) {
              router.pushConnect(postSigninURL);
            } else {
              router.pushConnect('/');
            }
          }
        });
    } else {
      mutate({
        confirmation,
        email,
        password,
        i18nLocale: language,
        callbackUrl:
          removeDoubleSlashesOnUrl(
            appBaseUrl +
              connectProxyPass +
              PixwayAppRoutes.SIGN_UP_MAIL_CONFIRMATION
          ) +
          '?' +
          queryString,
        verificationType: VerificationType.Numeric,
      });
    }
  };

  const getErrorMessage = () => {
    if (!signUpError) return undefined;
    const typedError = signUpError as AxiosError;
    return (typedError.response?.data as Record<string, string>)?.message ===
      EMAIL_ALREADY_IN_USE_API_MESSAGE
      ? translate('auth>signUpError>emailAlreadyInUse')
      : translate('auth>signUpError>genericErrorMessage');
  };

  const schema = object().shape({
    email: string().email(),
    password: passwordSchema,
    confirmation: isPasswordless
      ? string()
      : string()
          .required(translate('auth>signUp>confirmationRequired'))
          .test(
            'Ok',
            translate('auth>signUp>passwordConfirmation'),
            (value, context) => value === context.parent.password
          ),
    acceptsPolicyTerms: isPasswordless
      ? boolean()
      : boolean().required().isTrue(),
    acceptsTermsOfUse: isPasswordless
      ? boolean()
      : boolean().required().isTrue(),
  });

  const methods = useForm<SignUpFormData>({
    defaultValues: {
      confirmation: '',
      email: email ? decodeURIComponent(email) : '',
      password: '',
      acceptsPolicyTerms: false,
      acceptsTermsOfUse: false,
    },
    mode: 'onChange',
    resolver: yupResolver(schema as any),
  });

  useEffect(() => {
    if (email)
      methods.setValue('email', email ? decodeURIComponent(email) : '');
  }, [email]);

  const inputs = () => {
    if (isPasswordless)
      return (
        <>
          <AuthTextController
            disabled={Boolean(email)}
            name="email"
            label={translate('home>contactModal>email')}
            className="pw-mb-3"
            placeholder={translate('companyAuth>newPassword>enterYourEmail')}
          />

          <AuthButton
            type="submit"
            fullWidth
            className="pw-mb-1"
            disabled={isLoading || signUpLoading || !methods.formState.isValid}
          >
            {translate('components>advanceButton>continue')}
          </AuthButton>
        </>
      );
    else
      return (
        <>
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
            disabled={isLoading || signUpLoading || !methods.formState.isValid}
          >
            {translate('components>advanceButton>continue')}
          </AuthButton>
          <p className="pw-font-poppins pw-text-[13px] pw-leading-[19.5px] pw-text-center pw-mb-[27px] pw-text-[#353945]">
            <Trans i18nKey={'auth>signUpForm>alreadyHaveAccount'}>
              Já possui uma conta?
              <a
                className="pw-text-brand-primary pw-underline"
                href={router.routerToHref(PixwayAppRoutes.SIGN_IN)}
              >
                Login
              </a>
            </Trans>
          </p>
          <AuthFooter />
        </>
      );
  };

  return step === Steps.SIGN_UP ? (
    <div>
      {(error || signUpError) && !isPasswordless ? (
        <Alert
          variant="error"
          className="pw-flex pw-items-center pw-gap-x-2 pw-my-3"
        >
          <Alert.Icon />{' '}
          <span className="pw-text-xs">
            {error ? error : getErrorMessage()}
          </span>
        </Alert>
      ) : null}
      <FormProvider {...methods}>
        {title ? (
          <p className="pw-font-poppins pw-text-[24px] pw-text-[#35394C] pw-mb-8 pw-text-center pw-font-[700]">
            {title}
          </p>
        ) : null}

        <form
          onSubmit={
            onSubmit
              ? methods.handleSubmit(onSubmit as any)
              : methods.handleSubmit(onSubmitLocal as any)
          }
          className="sm:pw-mt-6"
        >
          {inputs()}
        </form>
      </FormProvider>
    </div>
  ) : (
    <VerifySignUpWithCodeWithoutLayout
      emailLocal={emailLocal}
      password={methods.getValues('password')}
      postSigninURL={postSigninURL}
      skipWallet={skipWallet}
    />
  );
};
