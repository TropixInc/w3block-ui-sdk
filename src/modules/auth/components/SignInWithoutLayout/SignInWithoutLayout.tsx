/* eslint-disable react-hooks/exhaustive-deps */
import { lazy, useEffect, useMemo, useState } from 'react';
import { FormProvider, useController, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useLocalStorage } from 'react-use';

import { yupResolver } from '@hookform/resolvers/yup';
import { KycStatus } from '@w3block/sdk-id';
import classNames from 'classnames';
import { object, string } from 'yup';

import { Alert } from '../../../shared/components/Alert';
import { Spinner } from '../../../shared/components/Spinner';
import { LocalStorageFields } from '../../../shared/enums/LocalStorageFields';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useGetGoogleRedirectLink } from '../../../shared/hooks/useGetGoogleRedirectLink';
import { useGetTenantInfoByHostname } from '../../../shared/hooks/useGetTenantInfoByHostname';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { useProfile } from '../../../shared/hooks/useProfile/useProfile';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import { useTimedBoolean } from '../../../shared/hooks/useTimedBoolean';
import { useUtms } from '../../../shared/hooks/useUtms/useUtms';
import { UseThemeConfig } from '../../../storefront/hooks/useThemeConfig/useThemeConfig';
import GoogleIcon from '../../assets/icons/googleIcon.svg?react';
import { usePasswordValidationSchema } from '../../hooks/usePasswordValidationSchema';
import { usePixwayAuthentication } from '../../hooks/usePixwayAuthentication';
import { AuthFooter } from '../AuthFooter';
import { SignUpFormWithoutLayout } from '../SignUpFormWithoutLayout';
const AuthButton = lazy(() =>
  import('../AuthButton').then((m) => ({ default: m.AuthButton }))
);
const AuthTextController = lazy(() => {
  return import('../AuthTextController').then((m) => ({
    default: m.AuthTextController,
  }));
});
const AuthValidationTip = lazy(() => {
  return import('../AuthValidationTip').then((m) => ({
    default: m.AuthValidationTip,
  }));
});

interface Form {
  email: string;
  password: string;
  twoFactor: string;
  companyId: string;
}

interface SignInWithoutLayoutProps {
  defaultRedirectRoute: string;
  routeToAttachWallet?: string;

  routerToAttachKyc?: string;
  hasSignUp?: boolean;
}

export const SigInWithoutLayout = ({
  defaultRedirectRoute,
  routeToAttachWallet = PixwayAppRoutes.CONNECT_EXTERNAL_WALLET,
  routerToAttachKyc = PixwayAppRoutes.COMPLETE_KYC,
  hasSignUp = true,
}: SignInWithoutLayoutProps) => {
  const { companyId } = useCompanyConfig();
  const { data: companyInfo } = useGetTenantInfoByHostname();
  const googleLink = useGetGoogleRedirectLink();
  const isPasswordless = companyInfo?.configuration?.passwordless?.enabled;
  const haveGoogleSignIn = companyInfo?.configuration?.googleSignIn?.enabled;
  const [translate] = useTranslation();
  const { signIn, signInWithGoogle } = usePixwayAuthentication();
  const passwordSchema = usePasswordValidationSchema({
    isPasswordless,
    messageConfig: {
      pattern: translate('companyAuth>signIn>invalidPasswordFeedback'),
    },
  });
  const { data: session } = usePixwaySession();
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingErrorMessage, showErrorMessage] = useTimedBoolean(6000);
  const router = useRouterConnect();
  const { data: profile } = useProfile();
  const [callbackUrl, setCallbackUrl] = useLocalStorage<string>(
    LocalStorageFields.AUTHENTICATION_CALLBACK,
    ''
  );
  const query =
    Object.keys(router.query).length > 0 &&
    (profile?.data.kycStatus === KycStatus.Pending || !profile?.data.mainWallet)
      ? router.query
      : '';

  const queryString = new URLSearchParams(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (router.query as any) ?? {}
  ).toString();

  const code = useMemo(() => {
    return router?.query?.code as string;
  }, [router]);

  const isGoogleSignIn = useMemo(() => {
    return router?.query?.scope?.includes('googleapis');
  }, [router]);

  const callback = useMemo(() => {
    if (router?.query.callbackUrl?.length)
      return router?.query.callbackUrl as string;
    if (router?.query.callbackPath?.length)
      return router?.query.callbackPath as string;
    else if (router?.query.contextSlug?.length)
      return (
        PixwayAppRoutes.COMPLETE_KYC +
        (queryString && queryString != '' ? '?' : '') +
        queryString
      );
    else return '/';
  }, [router]);

  const utms = useUtms();
  const [googleError, setGoogleError] = useState(false);
  useEffect(() => {
    if (code && isGoogleSignIn) {
      signInWithGoogle &&
        signInWithGoogle({
          code,
          companyId,
          callbackUrl: callback,
          referrer: utms.utm_source ?? undefined,
        }).then((res) => {
          if (!res.ok) {
            setGoogleError(true);
          } else {
            router.pushConnect(callback);
          }
        });
    }
  }, [code, isGoogleSignIn]);

  const { defaultTheme } = UseThemeConfig();
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
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { fieldState } = useController({
    control: methods.control,
    name: 'password',
  });

  const skipWallet = defaultTheme?.configurations?.contentData?.skipWallet;

  const checkForCallbackUrl = () => {
    if (profile && !profile.data.verified) {
      return PixwayAppRoutes.VERIfY_WITH_CODE;
    } else if (profile?.data.kycStatus === KycStatus.Pending) {
      return routerToAttachKyc;
    } else if (!profile?.data.mainWallet && !skipWallet) {
      return routeToAttachWallet;
    } else if (router.query.callbackPath) {
      return router.query.callbackPath as string;
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

  useEffect(() => {
    if (session && profile && !isPasswordless) {
      router.pushConnect(getRedirectUrl(), query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, router, profile]);

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

  if (code && isGoogleSignIn && !googleError)
    return (
      <div className="pw-w-full pw-flex pw-items-center pw-justify-center">
        <Spinner />
      </div>
    );
  else if (isPasswordless)
    return <SignUpFormWithoutLayout title="Insira seu e-mail" />;
  else
    return (
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
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
              className={classNames('pw-mb-1')}
              type="submit"
              fullWidth
              disabled={!methods.formState.isValid || isLoading}
            >
              {translate('loginPage>formSubmitButton>signIn')}
            </AuthButton>
            {hasSignUp ? (
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
            ) : null}
            {haveGoogleSignIn ? (
              <div className="pw-flex pw-flex-col pw-items-center pw-justify-center pw-gap-[10px] pw-mt-[10px]">
                {googleError ? (
                  <Alert variant="warning">
                    Parece que você ainda não possui uma conta, por favor
                    cadastre-se pela plataforma.
                  </Alert>
                ) : (
                  <>
                    <p className="pw-text-black">ou</p>
                    <a
                      className="pw-flex pw-flex-row pw-items-center pw-justify-center pw-bg-white hover:pw-bg-[#303030] hover:pw-bg-opacity-[8%] pw-rounded-[20px] pw-text-[#1f1f1f] pw-font-roboto pw-text-sm pw-h-[40px] pw-p-[0_12px] pw-w-[200px] pw-border pw-border-[#747775] pw-border-solid"
                      href={googleLink}
                    >
                      <div className="pw-h-[20px] pw-w-[20px] pw-mr-[12px]">
                        <GoogleIcon />
                      </div>
                      <span>Sign in with Google</span>
                    </a>
                  </>
                )}
              </div>
            ) : null}
          </div>
          <AuthFooter />
        </form>
      </FormProvider>
    );
};
