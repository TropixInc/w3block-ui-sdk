import { lazy, useEffect, useState } from 'react';
import { FormProvider, useController, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useLocalStorage } from 'react-use';

import { yupResolver } from '@hookform/resolvers/yup';
import { KycStatus } from '@w3block/sdk-id';
import classNames from 'classnames';
import { object, string } from 'yup';

import { Alert } from '../../../shared/components/Alert';
import { LocalStorageFields } from '../../../shared/enums/LocalStorageFields';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useGetTenantInfoByHostname } from '../../../shared/hooks/useGetTenantInfoByHostname';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { useProfile } from '../../../shared/hooks/useProfile/useProfile';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import { useTimedBoolean } from '../../../shared/hooks/useTimedBoolean';
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
  const isPasswordless = companyInfo?.configuration?.passwordless?.enabled;
  const [translate] = useTranslation();
  const { signIn } = usePixwayAuthentication();
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
  const queryString = new URLSearchParams(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (router.query as any) ?? {}
  ).toString();

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

  const checkForCallbackUrl = () => {
    if (profile && !profile.data.verified && !isPasswordless) {
      return PixwayAppRoutes.VERIfY_WITH_CODE;
    } else if (profile?.data.kycStatus === KycStatus.Pending) {
      return routerToAttachKyc;
    } else if (!profile?.data.mainWallet && !isPasswordless) {
      return routeToAttachWallet;
    } else if (router.query.callbackPath) {
      return router.query.callbackPath as string;
    } else if (callbackUrl) {
      const url = callbackUrl;
      setCallbackUrl('');
      return url;
    } else {
      return PixwayAppRoutes.TOKENS;
    }
  };

  const getRedirectUrl = () => checkForCallbackUrl() ?? defaultRedirectRoute;

  const query =
    Object.keys(router.query).length > 0 &&
    (profile?.data.kycStatus === KycStatus.Pending || !profile?.data.mainWallet)
      ? router.query
      : '';

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

  if (isPasswordless)
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
          </div>
          <AuthFooter />
        </form>
      </FormProvider>
    );
};
