import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDebounce } from 'react-use';

import classNames from 'classnames';
import { object, string } from 'yup';
import Link from 'next/link';
import { Alert } from '../../shared/components/Alert';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { usePasswordValidationSchema } from '../hooks/usePasswordValidationSchema';
import { SignUpFormData } from '../interface/SignUpFormData';
import { AuthButton } from './AuthButton';
import { AuthFooter } from './AuthFooter';
import { AuthLayoutBaseClasses, AuthLayoutBase } from './AuthLayoutBase';
import PasswordInput from './PasswordInput';
import { PasswordTips } from './PasswordTips';
import { SignCheckbox } from './SignCheckbox';
import LabelWithRequired from '../../shared/components/LabelWithRequired';

interface Props {
  onSubmit: (data: SignUpFormData) => void;
  isLoading: boolean;
  email?: string;
  error?: string;
  classes?: AuthLayoutBaseClasses;
  privacyRedirect?: string;
  termsRedirect?: string;
}

export const SignUpForm = ({
  onSubmit,
  isLoading,
  email,
  error,
  classes = {},
  privacyRedirect,
  termsRedirect,
}: Props) => {
  const { logoUrl } = useCompanyConfig();
  const router = useRouterConnect();
  const passwordSchema = usePasswordValidationSchema({});
  const [translate] = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptsPolicyTerms, setAcceptsPolicyTerms] = useState(false);
  const [acceptsTermsOfUse, setAcceptsTermsOfUse] = useState(false);
  const [errorPassword, setErrorPassword] = useState<Array<string>>([]);
  const [isErrorConfirmPassword, setIsErrorConfirmPassword] = useState(false);

  const schema = object().shape({
    email: string().email(),
    password: passwordSchema,
  });

  useDebounce(
    () => {
      const data = {
        email,
        password,
      };

      schema
        .validate(data)
        .then(() => {
          setErrorPassword([]);
        })
        .catch((err) => {
          setErrorPassword(err.errors);
        });
    },
    400,
    [password]
  );

  useDebounce(
    () => {
      if (confirmPassword.length) {
        if (confirmPassword !== password) {
          setIsErrorConfirmPassword(true);
        } else {
          setIsErrorConfirmPassword(false);
        }
      }
    },
    400,
    [confirmPassword]
  );

  const handleSubmit = () => {
    onSubmit({
      acceptsPolicyTerms: acceptsPolicyTerms,
      acceptsTermsOfUse: acceptsTermsOfUse,
      confirmation: confirmPassword,
      password: password,
      email: email ?? '',
    });
  };

  return (
    <AuthLayoutBase
      logo={logoUrl}
      title={translate('auth>signUpForm>formTitle')}
      classes={{
        contentContainer: classNames(
          '!pw-px-[22px] sm:!pw-px-[35px] !pw-pb-14 sm:!pw-pb-[35px]',
          classes.contentContainer ?? ''
        ),
        logo: classes.logo ?? '',
      }}
    >
      {error ? (
        <Alert
          variant="error"
          className="pw-flex pw-items-center pw-gap-x-2 pw-my-3"
        >
          <Alert.Icon /> <span className="pw-text-xs">{error}</span>
        </Alert>
      ) : null}
      <div>
        <div className="pw-mt-4">
          <LabelWithRequired>
            {translate('home>contactModal>email')}
          </LabelWithRequired>
          <input
            type="text"
            disabled={Boolean(email)}
            value={email}
            className="pw-mt-1 pw-mb-3 pw-text-base pw-font-normal pw-w-full pw-outline-none pw-border pw-border-stone-800 pw-rounded-lg pw-bg-transparent pw-opacity-40 !pw-px-[10px] !pw-py-[14px] placeholder:!pw-text-[#777E8F] !pw-leading-[18px] disabled:pw-text-[#353945] disabled:pw-bg-[#EFEFEF] pw-text-fill-[#353945] autofill:pw-bg-transparent autofill:pw-shadow-[0_0_0_30px_#ffffff_inset] focus:pw-outline-none"
            placeholder={translate('companyAuth>newPassword>enterYourEmail')}
          />
        </div>
        <div className="pw-mt-4">
          <LabelWithRequired required>
            {translate('companyAuth>newPassword>passwordFieldLabel')}
          </LabelWithRequired>
          <PasswordInput
            onChangeValue={setPassword}
            placeholder={translate('companyAuth>newPassword>enterYourPassword')}
            value={password}
          />
          {password.length
            ? errorPassword?.map((item) => (
                <p
                  className="pw-mt-[2px] pw-font-medium pw-text-xs pw-text-red-600"
                  key={item}
                >
                  {item}
                </p>
              ))
            : null}
        </div>
        <div className="pw-mt-4">
          <LabelWithRequired required>
            {translate(
              'companyAuth>newPassword>passwordConfirmationFieldLabel'
            )}
          </LabelWithRequired>
          <PasswordInput
            onChangeValue={setConfirmPassword}
            placeholder={translate(
              'companyAuth>newPassword>passwordConfirmationFieldLabel'
            )}
            value={confirmPassword}
          />
          {isErrorConfirmPassword ? (
            <p className="pw-mt-[2px] pw-font-medium pw-text-xs pw-text-red-600">
              {translate(
                'signUpForm>passwordConfirmationValidation>passwordDoesntMatch'
              )}
            </p>
          ) : null}
        </div>

        <PasswordTips value={password} className="pw-mt-3 pw-mb-6" />

        <div className="pw-flex pw-flex-col pw-gap-y-[4.5px] pw-mb-[26px]">
          <SignCheckbox
            name="acceptsTermsOfUse"
            label="Aceito os"
            keyTrans="companyAuth>signUp>acceptTermsOfUse"
            linkText="Termos de uso"
            redirectLink={termsRedirect}
            onChangeValue={setAcceptsTermsOfUse}
            value={acceptsTermsOfUse}
          />
          <SignCheckbox
            name="acceptsPolicyTerms"
            keyTrans="companyAuth>signUp>acceptPrivacyPolicy"
            linkText="Política de Privacidade"
            label="Aceito os"
            redirectLink={privacyRedirect}
            onChangeValue={setAcceptsPolicyTerms}
            value={acceptsPolicyTerms}
          />
        </div>

        <AuthButton
          type="submit"
          fullWidth
          className="pw-mb-1"
          onClick={() => handleSubmit()}
          disabled={
            isLoading ||
            Boolean(errorPassword.length) ||
            isErrorConfirmPassword ||
            !acceptsPolicyTerms ||
            !acceptsTermsOfUse ||
            !email?.length
          }
        >
          {translate('components>advanceButton>continue')}
        </AuthButton>
        <p className="pw-font-poppins pw-text-[13px] pw-leading-[19.5px] pw-text-center pw-mb-[27px]">
          <Trans i18nKey={'auth>signUpForm>alreadyHaveAccount'}>
            Já possui uma conta?
            <Link
              className="pw-text-brand-primary pw-underline"
              href={router.routerToHref(PixwayAppRoutes.SIGN_IN)}
            >
              Login
            </Link>
          </Trans>
        </p>
        <AuthFooter />
      </div>
    </AuthLayoutBase>
  );
};
