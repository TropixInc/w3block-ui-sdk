import { useEffect } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';

import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useRouterConnect } from '../../../shared/hooks/useRouterPushConnect';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useRequestPasswordChange } from '../../hooks';
import { AuthButton } from '../AuthButton';
import { AuthTextController } from '../AuthTextController';
import { AuthValidationTip } from '../AuthValidationTip';
import { PasswordChangeEmailSentWithoutLayout } from '../PasswordChangeEmailSentWithoutLayout/PasswordChangeEmailSentWithoutLayout';

interface Form {
  email: string;
}

export const RequestPasswordChangeWithoutLayout = () => {
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const { connectProxyPass } = useCompanyConfig();
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
    <PasswordChangeEmailSentWithoutLayout email={email ?? ''} />
  ) : (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="pw-pt-0 pw-pb-6 sm:pw-my-6"
      >
        <h2 className="pw-text-center pw-font-medium pw-text-lg pw-leading-[23px] pw-mb-6 text-[#35394C]">
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
                <a
                  href={connectProxyPass + PixwayAppRoutes.SIGN_UP}
                  className="pw-font-poppins pw-text-xs pw-leading-[18px] pw-underline pw-text-[##353945]"
                >
                  {translate(
                    'changePasswordPage>emailDontExistErrorTip>signUpLink'
                  )}
                </a>
              ) : null}
            </div>
          )}
        />

        <AuthButton
          fullWidth
          className="pw-mt-6"
          type="submit"
          disabled={!methods.formState.isValid || isLoading}
          placeholder={translate(
            'companyAuth>requestPasswordChange>emailFieldPlaceholder'
          )}
        >
          {translate('components>genericMessages>advance')}
        </AuthButton>
      </form>
    </FormProvider>
  );
};
