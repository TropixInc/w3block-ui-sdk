import { useEffect } from 'react';
import MailError from '../../shared/assets/icons/mailError.svg';
import { useRequestPasswordChange } from '../hooks/useRequestPasswordChange';
import useTranslation from '../../shared/hooks/useTranslation';

interface Props {
  companyId?: string;
  email: string;
  onSendEmail?: () => void;
  isFirstAccess?: boolean;
}

export const ExpiredTokenWithoutLayout = ({ email, onSendEmail }: Props) => {
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
    </div>
  );
};
