import { useEffect } from 'react';
import { Trans } from 'react-i18next';
import { useLocalStorage } from 'react-use';

import { addMinutes, isAfter } from 'date-fns';

import { LocalStorageFields } from '../../../shared/enums/LocalStorageFields';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import useCountdown from '../../../shared/hooks/useCountdown/useCountdown';
import useTranslation from '../../../shared/hooks/useTranslation';
import { ReactComponent as MailSent } from '../../assets/icons/mailSent.svg';
import { useRequestPasswordChange } from '../../hooks';
import { useEmailProtectedLabel } from '../../hooks/useEmailProtectedLabel';
import { useRequestConfirmationMail } from '../../hooks/useRequestConfirmationMail';

interface PasswordChangeMailSentProps {
  email: string;
  tenantId?: string;
  isPostSignUp?: boolean;
}

export const VerifySignUpMailSentWithoutLayout = ({
  email,
  isPostSignUp = false,
}: PasswordChangeMailSentProps) => {
  const [translate] = useTranslation();
  const { connectProxyPass } = useCompanyConfig();
  const { mutate, isSuccess, isLoading, reset } = useRequestPasswordChange();
  const {
    mutate: emailMutate,
    isSuccess: emailSuccess,
    isLoading: emailLoading,
    reset: emailReset,
  } = useRequestConfirmationMail();
  const { minutes, seconds, setNewCountdown, isActive } = useCountdown();
  const [countdownDate, setCountdownDate] = useLocalStorage<Date>(
    LocalStorageFields.EMAIL_CONFIRMATION_LINK_COUNTDOWN_DATE
  );

  const formattedEmail = useEmailProtectedLabel(email);

  useEffect(() => {
    if (countdownDate && isAfter(new Date(countdownDate), new Date())) {
      setNewCountdown(new Date(countdownDate));
    }
  }, [countdownDate, setNewCountdown]);

  useEffect(() => {
    if (isSuccess) {
      setCountdownDate(addMinutes(new Date(), 3));
      reset();
    }
  }, [isSuccess, setCountdownDate, reset]);

  useEffect(() => {
    if (emailSuccess) {
      setCountdownDate(addMinutes(new Date(), 1));
      emailReset();
    }
  }, [emailSuccess, setCountdownDate, emailReset]);

  const callbackPath =
    connectProxyPass +
    (isPostSignUp
      ? PixwayAppRoutes.COMPLETE_SIGNUP
      : PixwayAppRoutes.SIGN_UP_MAIL_CONFIRMATION);

  const handleClick = () => {
    if (isPostSignUp) {
      mutate({
        email,
        callbackPath,
        verificationType: 'numeric',
      });
    } else {
      emailMutate({
        email,
        callbackPath,
      });
    }
  };

  return (
    <div className="pw-pt-0 pw-pb-6 sm:pw-mt-6 pw-flex pw-flex-col pw-items-center pw-leading-[23px] pw-text-lg">
      <p className="pw-text-[#353945] pw-mb-6 pw-text-center pw-text-[13px] pw-leading-[15.85px] pw-font-normal">
        <Trans
          i18nKey="auth>emailConfirmation>mailSentToEmail"
          values={{ email: formattedEmail }}
        >
          Enviamos um email para:
          <span className="pw-block">email</span>
        </Trans>
      </p>
      <div className="pw-mb-[23px]">
        <div className="pw-flex pw-justify-center">
          <button
            disabled={isActive || isLoading || emailLoading}
            className="pw-font-semibold pw-text-[14px] pw-leading-[21px] pw-underline pw-text-brand-primary pw-font-poppins disabled:pw-text-[#676767] disabled:hover:pw-no-underline"
            onClick={handleClick}
          >
            {translate('auth>mailStep>resentCodeButton')}
          </button>
        </div>

        {isActive ? (
          <p className="pw-text-[#353945] pw-text-[13px] pw-leading-[15.85px] pw-text-center pw-mt-[18px]">
            {translate(
              'companyAuth>sendMailToChangePassword>cooldownTimeMessage',
              {
                minutes,
                seconds: seconds.toString().padStart(2, '0'),
              }
            )}
          </p>
        ) : null}
      </div>

      <MailSent className="pw-max-w-[186px] pw-max-h-[178px] pw-stroke-brand-primary" />

      <p className="pw-text-[#353945] pw-text-center pw-text-[13px] pw-leading-[15.85px] pw-mt-[23px] pw-mb-[18px]">
        <Trans i18nKey="auth>emailConfirmation>linkExpiresMessage">
          O link expira em 15 minutos
          <button
            disabled={isActive || isLoading || emailLoading}
            className="pw-font-poppins pw-underline pw-font-semibold pw-leading-[19.5px] disabled:pw-text-[#676767]"
            onClick={handleClick}
          >
            Reenviar código
          </button>
          para enviar outro
        </Trans>
      </p>
    </div>
  );
};
