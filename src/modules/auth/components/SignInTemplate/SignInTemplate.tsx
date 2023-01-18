import { useEffect, useState } from 'react';
import { FormProvider, useController, useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import { useLocalStorage } from 'react-use';

import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { object, string } from 'yup';

import { useProfile } from '../../../shared';
import { Alert } from '../../../shared/components/Alert';
import { Link } from '../../../shared/components/Link';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { LocalStorageFields } from '../../../shared/enums/LocalStorageFields';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import { useTimedBoolean } from '../../../shared/hooks/useTimedBoolean';
import useTranslation from '../../../shared/hooks/useTranslation';
import { usePasswordValidationSchema } from '../../hooks/usePasswordValidationSchema';
import { usePixwayAuthentication } from '../../hooks/usePixwayAuthentication';
import { AuthButton } from '../AuthButton';
import { AuthFooter } from '../AuthFooter';
import { AuthLayoutBase, AuthLayoutBaseClasses } from '../AuthLayoutBase';
import { AuthTextController } from '../AuthTextController/AuthTextController';
import { AuthValidationTip } from '../AuthValidationTip';

interface Form {
  email: string;
  password: string;
  twoFactor: string;
  companyId: string;
}

interface SignInTemplateClassses {
  layoutBase?: AuthLayoutBaseClasses;
  signInButton?: string;
}

export interface SignInTemplateProps {
  defaultRedirectRoute: string;
  routeToAttachWallet?: string;
  classes?: SignInTemplateClassses;
  hasSignUp?: boolean;
}

const _SignInTemplate = ({
  defaultRedirectRoute,
  routeToAttachWallet = PixwayAppRoutes.CONNECT_EXTERNAL_WALLET,
  classes = {},
  hasSignUp = true,
}: SignInTemplateProps) => {
  const { companyId, logoUrl: logo, appBaseUrl } = useCompanyConfig();
  const [translate] = useTranslation();
  const { signIn } = usePixwayAuthentication();
  const passwordSchema = usePasswordValidationSchema({
    pattern: translate('companyAuth>signIn>invalidPasswordFeedback'),
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

  const schema = object().shape({
    email: string().required('Campo obrigatório').email('Email inválido'),
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

  useEffect(() => {
    if (session) router.pushConnect(getRedirectUrl());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, router]);

  const { fieldState } = useController({
    control: methods.control,
    name: 'password',
  });

  const checkForCallbackUrl = () => {
    if (!profile?.data.mainWallet) {
      return appBaseUrl + routeToAttachWallet;
    } else if (callbackUrl) {
      const url = callbackUrl;
      setCallbackUrl('');
      return url;
    }
  };

  const getRedirectUrl = () => checkForCallbackUrl() ?? defaultRedirectRoute;

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

  return (
    <AuthLayoutBase
      logo={logo}
      classes={classes.layoutBase ?? {}}
      title={translate('companyAuth>signIn>formTitle')}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="pw-font-montserrat"
        >
          {isShowingErrorMessage ? (
            <Alert
              variant="error"
              className="pw-mb-6 pw-mt-4 pw-flex !pw-justify-start"
            >
              <Alert.Icon className="pw-mr-2 !pw-w-[10px] !pw-h-[10px]" />
              {translate('companyAuth>signIn>loginFailedError')}
            </Alert>
          ) : null}

          <AuthTextController
            name="email"
            label={translate('home>contactModal>email')}
            className="pw-mb-3"
            placeholder={translate('companyAuth>newPassword>enterYourEmail')}
          />
          <AuthTextController
            name="password"
            label={translate('companyAuth>newPassword>passwordFieldLabel')}
            type="password"
            className="pw-mb-6"
            placeholder={translate('companyAuth>newPassword>enterYourPassword')}
            renderTips={() => (
              <div className="pw-flex pw-justify-between pw-items-center pw-gap-x-1.5 pw-mt-2">
                <AuthValidationTip
                  isDirty={fieldState.isDirty}
                  error={fieldState.error}
                />
                <Link
                  href={router.routerToHref(
                    PixwayAppRoutes.REQUEST_PASSWORD_CHANGE
                  )}
                  className="pw-text-[#383857] pw-text-[13px] pw-leading-[19.5px] hover:pw-underline hover:pw-text-[#5682C3] pw-underline"
                >
                  {translate('auth>passwordChange>requestChangeFormTitle')}
                </Link>
              </div>
            )}
          />

          <div className="pw-mb-6">
            <AuthButton
              className={classNames(classes.signInButton ?? '', 'pw-mb-1')}
              type="submit"
              fullWidth
              disabled={!methods.formState.isValid || isLoading}
            >
              {translate('loginPage>formSubmitButton>signIn')}
            </AuthButton>
            {hasSignUp && (
              <p className="pw-text-[13px] pw-font-normal pw-leading-5 text-[#383857] text-center">
                <Trans i18nKey={'auth>signIn>signUpCTA'}>
                  Não tem conta ainda?
                  <Link
                    href={router.routerToHref(PixwayAppRoutes.SIGN_UP)}
                    className="pw-text-brand-primary pw-underline"
                  >
                    Cadastre-se.
                  </Link>
                </Trans>
              </p>
            )}
          </div>
          <AuthFooter />
        </form>
      </FormProvider>
    </AuthLayoutBase>
  );
};

export const SignInTemplate = (props: SignInTemplateProps) => (
  <TranslatableComponent>
    <_SignInTemplate {...props} />
  </TranslatableComponent>
);
