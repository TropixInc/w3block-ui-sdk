import { lazy, useEffect } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { AuthButton } from '../components/AuthButton';
import { AuthFooter } from '../components/AuthFooter';
import { AuthLayoutBase } from '../components/AuthLayoutBase';
import { AuthTextController } from '../components/AuthTextController';
import { AuthValidationTip } from '../components/AuthValidationTip';
import { PasswordChangeMailSent } from '../components/PasswordChangeMailSent';
import { useRequestPasswordChange } from '../hooks/useRequestPasswordChange';


interface Form {
  email: string;
}

const _RequestPasswordChangeTemplate = () => {
  const { logoUrl } = useCompanyConfig();
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const { mutate, isLoading, isError, isSuccess } = useRequestPasswordChange();
  const schema = object().shape({
    email: string()
      .required(translate('components>form>requiredFieldValidation'))
      .email(translate('companyAuth>requestPasswordChange>invalidEmailError')),
  });
  const methods = useForm<Form>({
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { email } = useWatch({ control: methods.control });

  useEffect(() => {
    if (isError) {
      methods.setError('email', {
        message: translate(
          'companyAuth>requestPasswordChange>emailDoesntExistError'
        ),
      });
    }
  }, [isError, methods, translate]);

  useEffect(() => {
    if (isSuccess && router.query.step !== '2') {
      router.replace({
        query: {
          step: 2,
        },
      });
    }
  }, [isSuccess, router, methods]);

  const onSubmit = ({ email }: Form) => {
    mutate({ email });
  };

  const hasSentEmail = router.query.step === '2';

  return hasSentEmail ? (
    <PasswordChangeMailSent email={email ?? ''} />
  ) : (
    <AuthLayoutBase
      logo={logoUrl}
      title={translate('auth>requestPasswordChange>pageTitle')}
      classes={{
        root: '!pw-px-[26px] sm:!pw-px-5',
        contentContainer:
          '!pw-pt-0 sm:!pw-pt-[35px] sm:!pw-px-[35px] !pw-shadow-none sm:!pw-shadow-[1px_1px_10px_rgba(0,0,0,0.2)] !pw-bg-transparent sm:!pw-bg-white !pw-px-0 sm:!pw-px-[35px] !pw-max-w-none sm:!pw-max-w-[514px]',
        logo: 'w-[130px] h-[130px]',
      }}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="pw-pt-0 pw-pb-6 sm:pw-my-6"
        >
          <h2 className="pw-text-center pw-font-medium pw-text-lg pw-leading-[23px] pw-mb-6 pw-text-[#35394C]">
            {translate('companyAuth>requestPasswordChange>formTitle')}
          </h2>

          <AuthTextController
            name="email"
            placeholder={translate('companyAuth>newPassword>enterYourEmail')}
            label={translate('home>contactModal>email')}
            className="pw-mb-[21px]"
            renderTips={({ error, isDirty }) => (
              <div className="flex justify-between">
                <AuthValidationTip error={error} isDirty={isDirty} />
                {error?.message ===
                translate(
                  'companyAuth>requestPasswordChange>emailDoesntExistError'
                ) ? (
                  <Link
                    href={router.routerToHref(PixwayAppRoutes.SIGN_UP)}
                    className="pw-font-poppins pw-text-xs pw-leading-[18px] pw-underline pw-text-[##353945]"
                  >
                    {translate(
                      'changePasswordPage>emailDontExistErrorTip>signUpLink'
                    )}
                  </Link>
                ) : null}
              </div>
            )}
          />

          <AuthButton
            fullWidth
            type="submit"
            disabled={!methods.formState.isValid || isLoading}
            placeholder={translate(
              'companyAuth>requestPasswordChange>emailFieldPlaceholder'
            )}
          >
            {translate('components>genericMessages>advance')}
          </AuthButton>
        </form>
        <AuthFooter />
      </FormProvider>
    </AuthLayoutBase>
  );
};

export const RequestPasswordChangeTemplate = () => (
  <TranslatableComponent>
    <_RequestPasswordChangeTemplate />
  </TranslatableComponent>
);
