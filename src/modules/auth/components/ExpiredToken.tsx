import { useEffect } from 'react';


import MailError from '../../shared/assets/icons/mailError.svg';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useRequestPasswordChange } from '../hooks/useRequestPasswordChange';
import { AuthFooter } from './AuthFooter';
import { AuthLayoutBase } from './AuthLayoutBase';
import useTranslation from '../../shared/hooks/useTranslation';

interface Props {
  companyId?: string;
  email: string;
  onSendEmail?: () => void;
  isFirstAccess?: boolean;
}

export const ExpiredToken = ({ email, onSendEmail }: Props) => {
  const { logoUrl } = useCompanyConfig();
  const { mutate, isLoading, isSuccess } = useRequestPasswordChange();
  const [translate] = useTranslation();

  const onClickResendEmail = () => {
    mutate({ email });
  };

  useEffect(() => {
    if (isSuccess && onSendEmail) onSendEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

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
        <p className="pw-text-[#353945] pw-text-sm pw-leading-4 pw-mb-[21px] pw-font-poppins">
          {translate('auth>expiredLink>linkNotValidatedMessage')}
        </p>
        <button
          onClick={onClickResendEmail}
          disabled={isLoading}
          className="pw-mb-[21px] pw-font-bold pw-text-brand-primary pw-underline"
        >
          {translate('auth>expiredLink>resendCodeButton')}
        </button>

        <div className="pw-mb-6">
          <MailError className="pw-w-[187px] pw-h-[187px]" />
        </div>

        <AuthFooter />
      </div>
    </AuthLayoutBase>
  );
};
