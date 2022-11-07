import { useEffect } from 'react';
import { Trans } from 'react-i18next';

import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import useTranslation from '../../../shared/hooks/useTranslation';
import { ReactComponent as MailError } from '../../assets/icons/mailError.svg';
import { useRequestPasswordChange } from '../../hooks';
import { AuthFooter } from '../AuthFooter';

interface Props {
  email: string;
  onSendEmail?: () => void;
  tenantId?: string;
  isPostSignUp?: boolean;
}

export const VerifySignUpTokenExpiredWithoutLayout = ({
  email,
  onSendEmail,
  isPostSignUp = false,
}: Props) => {
  const { mutate, isLoading, isSuccess } = useRequestPasswordChange();
  const [translate] = useTranslation();

  useEffect(() => {
    if (isSuccess && onSendEmail) onSendEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const callbackPath = isPostSignUp
    ? PixwayAppRoutes.COMPLETE_SIGNUP
    : PixwayAppRoutes.SIGN_UP_MAIL_CONFIRMATION;
  return (
    <div className="pw-flex pw-items-center pw-flex-col pw-mt-6">
      <p className="pw-text-[#353945] pw-text-[13px] pw-leading-[15.85px] pw-mb-6">
        {translate('auth>expiredLink>linkNotValidatedMessage')}
      </p>

      <span className="pw-text-brand-primary pw-text-sm pw-leading-[21px]">
        <Trans i18nKey="auth>emailConfirmation>resendEmailAction">
          <button
            onClick={() =>
              mutate({
                email,
                callbackPath,
                verificationType: 'numeric',
              })
            }
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
  );
};
