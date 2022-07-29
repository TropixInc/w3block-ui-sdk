import { useEffect, useState } from 'react';
import { FormProvider, useController, useForm } from 'react-hook-form';
import { useLocalStorage } from 'react-use';

import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { object, string } from 'yup';

import { Link } from '../../../shared';
import { Alert } from '../../../shared/components/Alert';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { LocalStorageFields } from '../../../shared/enums/LocalStorageFields';
import { AppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import useRouter from '../../../shared/hooks/useRouter';
import { useTimedBoolean } from '../../../shared/hooks/useTimedBoolean';
import useTranslation from '../../../shared/hooks/useTranslation';
import { CredentialProviderName } from '../../enums/CredentialProviderName';
import { usePasswordValidationSchema } from '../../hooks/usePasswordValidationSchema';
import { AuthButton } from '../AuthButton';
import { AuthFooter } from '../AuthFooter';
import { AuthLayoutBase } from '../AuthLayoutBase';
import { AuthTextController } from '../AuthTextController/AuthTextController';
import { AuthValidationTip } from '../AuthValidationTip';

interface Form {
  email: string;
  password: string;
  twoFactor: string;
  companyId: string;
}

export interface SignInTemplateProps {
  defaultRedirectRoute: string;
  companyId: string;
  logo: string;
}

const _SignInTemplate = ({
  defaultRedirectRoute,
  companyId,
  logo,
}: SignInTemplateProps) => {
  const [translate] = useTranslation();
  const passwordSchema = usePasswordValidationSchema({
    pattern: translate('companyAuth>signIn>invalidPasswordFeedback'),
  });

  const { data: session } = useSession();
  console.log(session);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingErrorMessage, showErrorMessage] = useTimedBoolean(6000);
  const router = useRouter();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [false, router]);

  const { fieldState } = useController({
    control: methods.control,
    name: 'password',
  });

  const checkForCallbackUrl = () => {
    if (callbackUrl) {
      const url = callbackUrl;
      setCallbackUrl('');
      return url;
    }
  };

  const getRedirectUrl = () => checkForCallbackUrl() ?? defaultRedirectRoute;

  const onSubmit = async (data: Form) => {
    try {
      setIsLoading(true);
      const response = await signIn(
        CredentialProviderName.SIGNIN_WITH_COMPANY_ID,
        {
          redirect: false,
          email: data.email,
          password: data.password,
          companyId: data.companyId,
          callbackUrl: undefined,
        }
      );
      if (!(response as any)?.ok) showErrorMessage();
    } catch {
      showErrorMessage();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayoutBase logo={logo}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="pw-mt-6">
          <div className="pw-mb-6">
            <h1 className="pw-font-bold pw-text-2xl pw-leading-9 pw-text-[#35394C] pw-text-center">
              {translate('companyAuth>signIn>formTitle')}
            </h1>
            {isShowingErrorMessage ? (
              <Alert
                variant="error"
                className="pw-mt-4 pw-flex !p  console.log(session);w-justify-start"
              >
                <Alert.Icon className="pw-mr-2 !pw-w-[10px] !pw-h-[10px]" />
                {translate('companyAuth>signIn>loginFailedError')}
              </Alert>
            ) : null}
          </div>
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
                  href={AppRoutes.REQUEST_PASSWORD_CHANGE}
                  className="pw-text-[#353945] pw-text-xs pw-leading-3 hover:pw-underline hover:pw-text-[#5682C3] pw-underline"
                >
                  {translate('auth>passwordChange>requestChangeFormTitle')}
                </Link>
              </div>
            )}
          />

          <div className="pw-mb-6">
            <AuthButton
              type="submit"
              fullWidth
              disabled={!methods.formState.isValid || isLoading}
            >
              {translate('loginPage>formSubmitButton>signIn')}
            </AuthButton>
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
