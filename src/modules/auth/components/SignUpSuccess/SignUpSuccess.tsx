import { Trans } from 'react-i18next';

import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import useTranslation from '../../../shared/hooks/useTranslation';
import { AuthButton } from '../AuthButton';
import { AuthFooter } from '../AuthFooter';
import { AuthLayoutBase } from '../AuthLayoutBase';

interface Props {
  email: string;
}

export const SignUpSuccess = ({ email }: Props) => {
  const { logoUrl } = useCompanyConfig();
  const [translate] = useTranslation();

  return (
    <AuthLayoutBase
      logo={logoUrl}
      title={translate('auth>signUpForm>formTitle')}
      classes={{
        contentContainer:
          'pw-px-[15px] pw-pt-[35px] pw-pb-[39px] sm:!pw-p-[35px]',
        title: 'sm:!pw-hidden',
      }}
    >
      <div className="pw-text-[#35394C] sm:!pw-mt-6">
        <h1 className="pw-mb-6 pw-text-center pw-text-2xl pw-leading-[29px] pw-font-bold px- sm:pw-px-0">
          Conta criada com sucesso!
        </h1>
        <p className="pw-text-center pw-mb-6 pw-text-sm sm:pw-text-[13px] pw-leading-[15px] sm:pw-leading-[17px] pw-px-[70px] sm:pw-px-0">
          <Trans i18nKey="auth>signUp>emailSent" values={{ email }}>
            Enviamos um link para confirmar seu email:
            <span className="pw-block">email</span>
          </Trans>
        </p>

        <AuthButton fullWidth className="pw-mb-6">
          {translate('loginPage>formSubmitButton>signIn')}
        </AuthButton>
        <AuthFooter />
      </div>
    </AuthLayoutBase>
  );
};
