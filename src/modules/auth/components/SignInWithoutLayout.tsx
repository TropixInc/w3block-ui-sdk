'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useController, useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import { useLocalStorage } from 'react-use';

import { yupResolver } from '@hookform/resolvers/yup';
import { KycStatus } from '@w3block/sdk-id';
import classNames from 'classnames';
import { ObjectSchema, object, string } from 'yup';

import GoogleIcon from '../../shared/assets/icons/googleIcon.svg';
import { Alert } from '../../shared/components/Alert';
import { Spinner } from '../../shared/components/Spinner';
import { LocalStorageFields } from '../../shared/enums/LocalStorageFields';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useGetAppleRedirectLink } from '../../shared/hooks/useGetAppleRedirectLink';
import { useGetGoogleRedirectLink } from '../../shared/hooks/useGetGoogleRedirectLink';
import { usePixwaySession } from '../../shared/hooks/usePixwaySession';
import { useProfile } from '../../shared/hooks/useProfile';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { useTimedBoolean } from '../../shared/hooks/useTimedBoolean';
import useTranslation from '../../shared/hooks/useTranslation';
import { useThemeConfig } from '../../storefront/hooks/useThemeConfig';
import AppleIcon from '../../shared/assets/icons/appleIcon.svg';
import { useOAuthSignIn } from '../hooks/useOAuthSignIn';
import { usePasswordValidationSchema } from '../hooks/usePasswordValidationSchema';
import { usePixwayAuthentication } from '../hooks/usePixwayAuthentication';
import { AuthButton } from './AuthButton';
import { AuthFooter } from './AuthFooter';
import { AuthTextController } from './AuthTextController';
import { AuthValidationTip } from './AuthValidationTip';
import { SignUpFormWithoutLayout } from './SignUpFormWithoutLayout';
import { W3blockAuthenticationContext } from '../context/W3blockAuthenticationContext';

interface Form {
  email: string;
  password: string; 
  twoFactor: string;
  companyId: string;
}

interface SignInWithoutLayoutProps {
  defaultRedirectRoute: string;
  routeToAttachWallet?: string;
  isAppleSignIn?: boolean;
  routerToAttachKyc?: string;
  hasSignUp?: boolean;
  configs?: {
    isPasswordless?: boolean;
    haveGoogleSignIn?: boolean;
    haveAppleSignIn?: boolean;
  }
}

export const SigInWithoutLayout = ({
  defaultRedirectRoute,
  routeToAttachWallet = PixwayAppRoutes.CONNECT_EXTERNAL_WALLET,
  routerToAttachKyc = PixwayAppRoutes.COMPLETE_KYC,
  hasSignUp = true,
  isAppleSignIn = false,
  configs,
}: SignInWithoutLayoutProps) => {
  const { companyId } = useCompanyConfig();
  const googleLink = useGetGoogleRedirectLink();
  const appleLink = useGetAppleRedirectLink();
  const isPasswordless = configs?.isPasswordless;
  const haveGoogleSignIn = configs?.haveGoogleSignIn;
  const haveAppleSignIn = configs?.haveAppleSignIn;
  const [translate] = useTranslation();
  const { signIn } =
    usePixwayAuthentication();
  const passwordSchema = usePasswordValidationSchema({
    isPasswordless,
    messageConfig: {
      pattern: translate('companyAuth>signIn>invalidPasswordFeedback'),
    },
  });
  const { data: session, status: sessionStatus } = usePixwaySession();
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingErrorMessage, showErrorMessage] = useTimedBoolean(6000);
  const router = useRouterConnect();
  const { data: profile } = useProfile();
  const [callbackUrl, setCallbackUrl] = useLocalStorage<string>(
    LocalStorageFields.AUTHENTICATION_CALLBACK,
    ''
  );
  const query =
    Object.keys(router?.query ?? {})?.length > 0 &&
    (profile?.data.kycStatus === KycStatus.Pending || !profile?.data.mainWallet)
      ? router?.query
      : '';

  const queryString = new URLSearchParams(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (router?.query as any) || {}
  ).toString();

  const code = useMemo(() => {
    if (router?.query) {
      return router?.query?.code as string;
    } else return '';
  }, [router]);

  const isGoogleSignIn = useMemo(() => {
    return router?.query?.scope?.includes('googleapis');
  }, [router]);

  const callback = useMemo(() => {
    if (router?.query?.callbackUrl?.length)
      return router?.query?.callbackUrl as string;
    if (router?.query?.callbackPath?.length)
      return router?.query?.callbackPath as string;
    else if (router?.query?.contextSlug?.length)
      return (
        PixwayAppRoutes.COMPLETE_KYC +
        (queryString && queryString != '' ? '?' : '') +
        queryString
      );
    else return '/';
  }, [router]);

  const { googleError, appleError, isProcessing } = useOAuthSignIn({
    code,
    isGoogleSignIn,
    isAppleSignIn,
    callback,
  });
  const { defaultTheme } = useThemeConfig();
  const postSigninURL =
    defaultTheme?.configurations?.contentData?.postSigninURL;
  const schema = object().shape({
    email: string()
      .required(translate('components>form>requiredFieldValidation'))
      .email(translate('shared>invalidEmail')),
    password: passwordSchema,
  });

  const methods = useForm<Form>({
    defaultValues: {
      email: '',
      password: '',
      twoFactor: '',
      companyId,
    },
    mode: 'onTouched',
    resolver: yupResolver(schema as ObjectSchema<Form>),
  });

  const { fieldState } = useController({
    control: methods.control,
    name: 'password',
  });

  const skipWallet = defaultTheme?.configurations?.contentData?.skipWallet;

  const checkForCallbackUrl = () => {
    if (profile && !profile.data.verified) {
      return PixwayAppRoutes.VERIfY_WITH_CODE;
    } else if (router?.query?.callbackPath) {
      return router?.query?.callbackPath as string;
    } else if (router?.query?.callbackUrl) {
      return router?.query?.callbackUrl as string;
    } else if (profile?.data?.kycStatus === KycStatus.Pending) {
      return routerToAttachKyc;
    } else if (!profile?.data?.mainWallet && !skipWallet) {
      return routeToAttachWallet;
    } else if (callbackUrl) {
      const url = callbackUrl;
      setCallbackUrl('');
      return url;
    } else if (postSigninURL) {
      return postSigninURL;
    } else {
      return PixwayAppRoutes.TOKENS;
    }
  };

  const getRedirectUrl = () => checkForCallbackUrl() ?? defaultRedirectRoute;

  const isRedirecting = useRef(false);
  const [redirectTimedOut, setRedirectTimedOut] = useState(false);

  useEffect(() => {
    if (session && profile && !isPasswordless && !isRedirecting.current) {
      isRedirecting.current = true;
      setRedirectTimedOut(false);
      if (router?.query?.callbackPath || router?.query?.callbackUrl) {
        router.pushConnect(getRedirectUrl());
      } else router.pushConnect(getRedirectUrl(), query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, router, profile]);

  const isSessionLoading = sessionStatus === 'loading';

  useEffect(() => {
    if (isProcessing || isSessionLoading || (session && profile && !isPasswordless)) {
      const timer = setTimeout(() => setRedirectTimedOut(true), 15000);
      return () => clearTimeout(timer);
    }
    setRedirectTimedOut(false);
  }, [isProcessing, isSessionLoading, session, profile, isPasswordless]);

  const onSubmit = async ({ email, password }: Form) => {
    try {
      setIsLoading(true);
      const response = await signIn({
        email,
        password,
        companyId,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (response?.error && response?.error != '') showErrorMessage();
    } catch {
      showErrorMessage();
    } finally {
      setIsLoading(false);
    }
  };

  if (isProcessing || isSessionLoading || (session && profile && !isPasswordless))
    return (
      <div className="pw-w-full pw-flex pw-flex-col pw-items-center pw-justify-center pw-gap-4">
        <Spinner />
        {redirectTimedOut && (
          <div className="pw-flex pw-flex-col pw-items-center pw-gap-2">
            <p className="pw-text-sm pw-text-[#353945]">
              {translate('auth>signIn>loadingTimeout')}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="pw-text-sm pw-text-brand-primary pw-underline pw-font-semibold"
            >
              {translate('shared>tryAgain')}
            </button>
          </div>
        )}
      </div>
    );
  else if (isPasswordless)
    return <SignUpFormWithoutLayout title="Insira seu e-mail" />;
  else
    return (
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit as any)}
          className="pw-font-montserrat"
        >
          {isShowingErrorMessage && !isPasswordless ? (
            <Alert
              variant="error"
              className="pw-mb-6 pw-mt-4 pw-flex !pw-justify-start"
            >
              <Alert.Icon className="pw-mr-2 !pw-w-[10px] !pw-h-[10px]" />
              {translate('companyAuth>signIn>loginFailedError')}
            </Alert>
          ) : null}
          <p className="pw-font-[700] pw-text-[24px] pw-mb-6 pw-font-poppins pw-text-[#35394C] pw-text-center">
            {translate('auth>signIn>title')}
          </p>

          <AuthTextController
            name="email"
            label={translate('home>contactModal>email')}
            className="pw-mb-3"
            placeholder={translate('companyAuth>newPassword>enterYourEmail')}
            autoComplete="username"
          />
          {!isPasswordless ? (
            <AuthTextController
              name="password"
              autoComplete="current-password"
              label={translate('companyAuth>newPassword>passwordFieldLabel')}
              type="password"
              className="pw-mb-6"
              placeholder={translate(
                'companyAuth>newPassword>enterYourPassword'
              )}
              renderTips={() => (
                <div className="pw-flex pw-justify-between pw-items-center pw-gap-x-1.5 pw-mt-2">
                  <AuthValidationTip
                    isDirty={fieldState.isDirty}
                    error={fieldState.error}
                  />
                  <a
                    href={router.routerToHref(
                      PixwayAppRoutes.REQUEST_PASSWORD_CHANGE
                    )}
                    className="pw-text-[#383857] pw-text-[13px] pw-leading-[19.5px] hover:pw-underline hover:pw-text-[#5682C3] pw-underline"
                  >
                    {translate('auth>passwordChange>requestChangeFormTitle')}
                  </a>
                </div>
              )}
            />
          ) : null}

          <div className="pw-mb-6">
            <AuthButton
              className={classNames('pw-mb-1 pw-flex pw-items-center pw-justify-center')}
              type="submit"
              fullWidth
              disabled={!methods.formState.isValid || isLoading || Boolean(session)}
            >
              {isLoading ? <Spinner className="pw-w-4 pw-h-4 border-[1px]" /> : translate('loginPage>formSubmitButton>signIn')}
            </AuthButton>
            {hasSignUp ? (
              <>
                <p className="pw-text-[13px] pw-font-normal pw-leading-5 pw-text-[#383857] pw-text-center">
                  <Trans i18nKey={'auth>signIn>signUpCTA'}>
                    Não tem conta ainda?
                    <a
                      href={router.routerToHref(
                        PixwayAppRoutes.SIGN_UP + '?' + queryString
                      )}
                      className="pw-text-brand-primary pw-underline"
                    >
                      Cadastre-se.
                    </a>
                  </Trans>
                </p>
              </>
            ) : null}
            {haveGoogleSignIn ? (
              <div className="pw-flex pw-flex-col pw-items-center pw-justify-center pw-gap-[10px] pw-mt-[10px]">
                <p className="pw-text-black">
                  {translate('auth>metamaskAppErrorModal>or')}
                </p>
                <a
                  className="pw-flex pw-flex-row pw-items-center pw-justify-center pw-bg-white hover:pw-bg-[#303030] hover:pw-bg-opacity-[8%] pw-rounded-[20px] pw-text-[#1f1f1f] pw-font-roboto pw-text-sm pw-h-[40px] pw-p-[0_12px] pw-w-[200px] pw-border pw-border-[#747775] pw-border-solid"
                  href={googleLink}
                >
                  <div className="pw-h-[17px] pw-w-[17px] pw-mr-[12px]">
                    <GoogleIcon />
                  </div>
                  <span className="pw-mt-[1px]">
                    {translate('auth>signWithoutLayout>signGoogle')}
                  </span>
                </a>
              </div>
            ) : null}
            {haveAppleSignIn ? (
              <div className="pw-flex pw-flex-col pw-items-center pw-justify-center pw-gap-[10px] pw-mt-[10px]">
                <a
                  className="pw-flex pw-flex-row pw-items-center pw-justify-center pw-bg-white hover:pw-bg-[#303030] hover:pw-bg-opacity-[8%] pw-rounded-[20px] pw-text-[#1f1f1f] pw-font-roboto pw-text-sm pw-h-[40px] pw-p-[0_12px] pw-w-[200px] pw-border pw-border-[#747775] pw-border-solid"
                  href={appleLink}
                >
                  <div className="pw-h-[20px] pw-w-[20px] pw-mr-[12px]">
                    <AppleIcon width={20} height={17} />
                  </div>
                  <span className="pw-mt-[1px]">
                    {translate('auth>signWithoutLayout>signinApple')}
                  </span>
                </a>
              </div>
            ) : null}
          </div>
          {appleError || googleError ? (
            <Alert variant="warning">
              {translate('auth>signWithoutLayout>notRegistration')}
            </Alert>
          ) : null}
          <AuthFooter />
        </form>
      </FormProvider>
    );
};
