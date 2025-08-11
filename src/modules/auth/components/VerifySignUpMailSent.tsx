import { useEffect } from 'react';
import { Trans } from 'react-i18next';
import { useLocalStorage } from 'react-use';

import classNames from 'classnames';
import addMinutes from 'date-fns/addMinutes';
import isAfter from 'date-fns/isAfter';


import MailSent from '../../shared/assets/icons/mailSent.svg';
import { LocalStorageFields } from '../../shared/enums/LocalStorageFields';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import useCountdown from '../../shared/hooks/useCountdown';
import { useEmailProtectedLabel } from '../hooks/useEmailProtectedLabel';
import { useRequestConfirmationMail } from '../hooks/useRequestConfirmationMail';
import { AuthFooter } from './AuthFooter';
import { AuthLayoutBaseClasses, AuthLayoutBase } from './AuthLayoutBase';
import useTranslation from '../../shared/hooks/useTranslation';

interface PasswordChangeMailSentProps {
  email: string;
  tenantId?: string;
  classes?: AuthLayoutBaseClasses;
  isPostSignUp?: boolean;
}

export const VerifySignUpMailSent = ({
  email,
  tenantId,
  classes = {},
  isPostSignUp = false,
}: PasswordChangeMailSentProps) => {
  const { logoUrl: logo, connectProxyPass } = useCompanyConfig();
  const [translate] = useTranslation();
  const { mutate, isSuccess, isLoading, reset } = useRequestConfirmationMail();
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
      setCountdownDate(addMinutes(new Date(), 1));
      reset();
    }
  }, [isSuccess, setCountdownDate, reset]);

  const callbackPath =
    connectProxyPass +
    (isPostSignUp
      ? PixwayAppRoutes.COMPLETE_SIGNUP
      : PixwayAppRoutes.SIGN_UP_MAIL_CONFIRMATION);

  return (
    <AuthLayoutBase
      logo={logo}
      title={translate('auth>emailConfirmation>mailResentStepTitle')}
      classes={{
        root: classNames('!pw-px-5 sm:!pw-px-5', classes.root ?? ''),
        contentContainer: classNames(
          '!pw-pt-0 sm:!pw-pt-[35px] sm:!pw-px-[87.5px] !pw-shadow-none sm:!pw-shadow-[1px_1px_10px_rgba(0,0,0,0.2)] !pw-bg-transparent sm:!pw-bg-white !pw-px-0 sm:!pw-px-[35px] !pw-max-w-none sm:!pw-max-w-[514px]',
          classes.contentContainer ?? ''
        ),
        logo: classNames('w-[130px] h-[130px]', classes.logo ?? ''),
      }}
    >
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
              disabled={isActive || isLoading}
              className="pw-font-semibold pw-text-[14px] pw-leading-[21px] pw-underline pw-text-brand-primary pw-font-poppins disabled:pw-text-[#676767] disabled:hover:pw-no-underline"
              onClick={() => mutate({ email, tenantId, callbackPath })}
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

        <p className="pw-text-[#353945] pw-text-center pw-text-[13px] pw-leading-[15.85px] pw-mt-[23px] mb-[18px]">
          <Trans i18nKey="auth>emailConfirmation>linkExpiresMessage">
            O link expira em 15 minutos
            <button
              disabled={isActive || isLoading}
              className="pw-font-poppins pw-underline pw-font-semibold pw-leading-[19.5px] disabled:pw-text-[#676767]"
              onClick={() =>
                mutate({
                  email,
                  tenantId,
                  callbackPath,
                })
              }
            >
              Reenviar código
            </button>
            para enviar outro
          </Trans>
        </p>
      </div>

      <AuthFooter />
    </AuthLayoutBase>
  );
};
