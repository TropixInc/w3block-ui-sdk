import { useEffect } from 'react';

import { ReactComponent as MailError } from '../../../../../shared/assets/images/mailError.svg';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useRequestPasswordChange } from '../../hooks';
import { AuthFooter } from '../AuthFooter';
import { AuthLayoutBase } from '../AuthLayoutBase';

interface Props {
  companyId?: string;
  email: string;
  onSendEmail?: () => void;
  isFirstAccess?: boolean;
}

export const ExpiredToken = ({ email, onSendEmail, companyId }: Props) => {
  const { mutate, isLoading, isSuccess } = useRequestPasswordChange(
    companyId ?? ''
  );
  const [translate] = useTranslation();

  const onClickResendEmail = () => {
    mutate({ email });
  };

  useEffect(() => {
    if (isSuccess && onSendEmail) onSendEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <AuthLayoutBase logo="" title={translate('auth>expiredLink>stepTitle')}>
      <div className="pw-flex pw-items-center pw-flex-col pw-mt-6">
        <h1 className="pw-font-bold pw-text-2xl pw-leading-[28px] pw-text-[#353945] pw-text-center pw-mb-6">
          {translate('auth>expiredLink>stepTitle')}
        </h1>

        <p className="pw-text-[#353945] pw-text-sm pw-leading-4 pw-mb-[21px]">
          {translate('auth>expiredLink>linkNotValidatedMessage')}
        </p>
        <button
          onClick={onClickResendEmail}
          disabled={isLoading}
          className="pw-mb-[21px] pw-font-bold pw-text-[#76DE8D] pw-underline"
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
