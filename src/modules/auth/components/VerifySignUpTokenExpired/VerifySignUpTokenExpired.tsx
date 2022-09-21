import { Trans } from 'react-i18next';

import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import useTranslation from '../../../shared/hooks/useTranslation';
import { ReactComponent as MailError } from '../../assets/icons/mailError.svg';
import { AuthFooter } from '../AuthFooter';
import { AuthLayoutBase } from '../AuthLayoutBase';

interface Props {
  onSendEmail?: () => void;
  isLoading: boolean;
}

export const VerifySignUpTokenExpired = ({ onSendEmail, isLoading }: Props) => {
  const { logoUrl } = useCompanyConfig();
  const [translate] = useTranslation();

  return (
    <AuthLayoutBase
      classes={{
        root: '!pw-px-5 sm:!pw-px-5',
        contentContainer:
          '!pw-pt-0 sm:!pw-pt-[35px] sm:!pw-px-[35px] !pw-shadow-none sm:!pw-shadow-[1px_1px_10px_rgba(0,0,0,0.2)] !pw-bg-transparent sm:!pw-bg-white !pw-px-0 sm:!pw-px-[35px] !pw-max-w-none sm:!pw-max-w-[514px]',
        logo: 'w-[130px] h-[130px]',
        title: 'pw-px-2 sm:pw-px-0',
      }}
      logo={logoUrl}
      title={translate('auth>expiredLink>stepTitle')}
    >
      <div className="pw-flex pw-items-center pw-flex-col pw-mt-6">
        <p className="pw-text-[#353945] pw-text-[13px] pw-leading-[15.85px] pw-mb-6">
          {translate('auth>expiredLink>linkNotValidatedMessage')}
        </p>

        <span className="pw-text-brand-primary pw-text-sm pw-leading-[21px]">
          <Trans i18nKey="auth>emailConfirmation>resendEmailAction">
            <button
              onClick={onSendEmail}
              disabled={isLoading}
              className="pw-mb-[29px] pw-font-semibold pw-text-sm pw-leading-[17px] pw-text-brand-primary pw-underline"
            >
              Clique aqui
            </button>
            para reenviar seu código.
          </Trans>
        </span>

        <div className="pw-mb-6">
          <MailError className="pw-w-[187px] pw-h-[187px]" />
        </div>

        <AuthFooter />
      </div>
    </AuthLayoutBase>
  );
};
