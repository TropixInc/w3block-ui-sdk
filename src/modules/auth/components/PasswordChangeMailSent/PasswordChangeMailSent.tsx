import { useEffect, useMemo } from 'react';
import { Trans } from 'react-i18next';
import { useLocalStorage } from 'react-use';

import { isAfter, addMinutes } from 'date-fns';
import Image from 'next/image';

import emailImage from '../../../../../shared/assets/images/companyAuthMailSent.png';
import { LocalStorageFields } from '../../../shared/enums/LocalStorageFields';
import useCountdown from '../../../shared/hooks/useCountdown/useCountdown';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useRequestPasswordChange } from '../../hooks';
import { AuthFooter } from '../AuthFooter';
import { AuthLayoutBase } from '../AuthLayoutBase';

interface PasswordChangeMailSentProps {
  email: string;
  companyId: string;
  logo: string;
}

export const PasswordChangeMailSent = ({
  email,
  companyId,
  logo,
}: PasswordChangeMailSentProps) => {
  const [translate] = useTranslation();
  const { mutate, isSuccess, isLoading } = useRequestPasswordChange(companyId);
  const { minutes, seconds, setNewCountdown, isActive } = useCountdown();
  const [countdownDate, setCountdownDate] = useLocalStorage<Date>(
    LocalStorageFields.PASSWORD_LINK_CONFIRMATION_COUNTDOWN_DATE
  );

  const formattedEmail = useMemo(() => {
    const emailSplitted = email.split('@');
    if (emailSplitted.length === 1) return emailSplitted;
    return emailSplitted[0]
      .substring(0, 2)
      .concat('****@')
      .concat(emailSplitted[1]);
  }, [email]);

  useEffect(() => {
    if (countdownDate && isAfter(new Date(countdownDate), new Date())) {
      setNewCountdown(new Date(countdownDate));
    }
  }, [countdownDate, setNewCountdown]);

  useEffect(() => {
    if (isSuccess) {
      setCountdownDate(addMinutes(new Date(), 3));
    }
  }, [isSuccess, setCountdownDate]);

  return (
    <AuthLayoutBase
      logo={logo}
      title={translate('auth>passwordChangeMailStep>formTitle')}
    >
      <div className="pw-my-6 pw-flex pw-flex-col pw-items-center">
        <p className="pw-font-semibold pw-leading-4 pw-text-[#35394C] pw-mb-[21px]">
          <Trans
            i18nKey="companyAuth>requestPaswordChange>linkSentToMail"
            values={{ email: formattedEmail }}
          >
            {translate('auth>passwordChangeMailStep>linkSentMessage')}
            <span className="pw-block pw-text-center pw-mt-0.5">email</span>
          </Trans>
        </p>
        <div className="pw-mb-7">
          <div className="pw-flex pw-justify-center">
            <button
              disabled={isActive || isLoading}
              className="pw-font-bold pw-text-base pw-leading-4 pw-text-[#76DE8D] hover:pw-underline disabled:pw-text-[#676767] disabled:hover:pw-no-underline"
              onClick={() => mutate({ email })}
            >
              {translate('auth>mailStep>resentCodeButton')}
            </button>
          </div>

          {isActive ? (
            <p className="pw-text-[#35394C] pw-text-base pw-leading-4 pw-text-center pw-mt-[21px] pw-font-bold">
              {translate(
                'companyAuth>sendMailToChangePassword>cooldownTimeMessage',
                {
                  minutes: minutes,
                  seconds: seconds.toString().padStart(2, '0'),
                }
              )}
            </p>
          ) : null}
        </div>
        <Image src={emailImage} width={186} height={178} alt="" />
        <p className="pw-font-semibold pw-leading-4 pw-text-[#35394C] pw-text-center pw-mt-[21px]">
          <Trans i18nKey="auth>mailStep>linkExpirationMessage">
            {translate('companyAuth>passwordChangeEmailSent>expirationMessage')}
            <button
              disabled={isActive || isLoading}
              className="pw-font-bold pw-text-base pw-leading-4 pw-text-[#76DE8D] disabled:pw-text-[#676767] disabled:hover:pw-no-underline hover:pw-underline"
              onClick={() => mutate({ email })}
            >
              {translate('companyAuth>passwordChangeEmailSent>resendCode')}
            </button>
            {translate('companyAuth>passwordChangeEmailSent>newSolicitaion')}
          </Trans>
        </p>
      </div>

      <AuthFooter />
    </AuthLayoutBase>
  );
};
