import { useEffect } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { object, string } from 'yup';

import useTranslation from '../../../shared/hooks/useTranslation';
import { useRequestPasswordChange } from '../../hooks';
import { AuthButton } from '../AuthButton';
import { AuthFooter } from '../AuthFooter';
import { AuthLayoutBase } from '../AuthLayoutBase';
import { AuthTextController } from '../AuthTextController';
import { PasswordChangeMailSent } from '../PasswordChangeMailSent';

interface Form {
  email: string;
}

interface CompanyAuthRequestPasswordChangeTemplateProps {
  logo: string;
  companyId: string;
}

export const CompanyAuthRequestPasswordChangeTemplate = ({
  logo,
  companyId,
}: CompanyAuthRequestPasswordChangeTemplateProps) => {
  const [translate] = useTranslation();
  const router = useRouter();
  const { mutate, isLoading, isError, isSuccess } =
    useRequestPasswordChange(companyId);
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
    <PasswordChangeMailSent
      email={email ?? ''}
      companyId={companyId}
      logo={logo}
    />
  ) : (
    <AuthLayoutBase
      logo={logo}
      title={translate('companyAuth>requestPasswordChange>formTitle')}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="pw-my-6">
          <AuthTextController
            name="email"
            placeholder={translate('companyAuth>newPassword>enterYourEmail')}
            label={translate('home>contactModal>email')}
            className="pw-mb-[21px]"
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
