import { useEffect } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';

import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import useRouter from '../../../shared/hooks/useRouter';
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

export interface RequestPasswordChangeTemplateProps {
  logo: string;
  companyId: string;
}

const _RequestPasswordChangeTemplate = ({
  logo,
  companyId,
}: RequestPasswordChangeTemplateProps) => {
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
    <AuthLayoutBase logo={logo} title={'Esqueceu senha'}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="pw-my-6">
          <h2 className="pw-text-center pw-font-medium pw-text-lg pw-leading-[23px] pw-mb-6">
            {translate('companyAuth>requestPasswordChange>formTitle')}
          </h2>
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

export const RequestPasswordChangeTemplate = (
  props: RequestPasswordChangeTemplateProps
) => (
  <TranslatableComponent>
    <_RequestPasswordChangeTemplate {...props} />
  </TranslatableComponent>
);
