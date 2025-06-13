import { useEffect } from 'react';
import { Trans } from 'react-i18next';
import { useLocalStorage } from 'react-use';

import addMinutes from 'date-fns/addMinutes';
import isAfter from 'date-fns/isAfter';

import KeyIconOutlined from '../../assets/icons/keyIconOutlined.svg';
import { LocalStorageFields } from '../../shared/enums/LocalStorageFields';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import useCountdown from '../../shared/hooks/useCountdown';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { useEmailProtectedLabel } from '../hooks/useEmailProtectedLabel';
import { useRequestPasswordChange } from '../hooks/useRequestPasswordChange';
import { AuthButton } from './AuthButton';
import { AuthFooter } from './AuthFooter';
import { AuthLayoutBase } from './AuthLayoutBase';
import useTranslation from '../../shared/hooks/useTranslation';


interface PasswordChangeMailSentProps {
  email: string;
}

export const PasswordChangeMailSent = ({
  email,
}: PasswordChangeMailSentProps) => {
  const { logoUrl: logo } = useCompanyConfig();
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const { mutate, isSuccess, isLoading } = useRequestPasswordChange();
  const { minutes, seconds, setNewCountdown, isActive } = useCountdown();
  const [countdownDate, setCountdownDate] = useLocalStorage<Date>(
    LocalStorageFields.PASSWORD_LINK_CONFIRMATION_COUNTDOWN_DATE
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
    }
  }, [isSuccess, setCountdownDate]);

  return (
    <AuthLayoutBase
      logo={logo}
      title={translate('auth>passwordChangeMailStep>formTitle')}
      classes={{
        root: '!pw-px-5 sm:!pw-px-5',
        contentContainer:
          '!pw-pt-0 sm:!pw-pt-[35px] sm:!pw-px-[35px] !pw-shadow-none sm:!pw-shadow-[1px_1px_10px_rgba(0,0,0,0.2)] !pw-bg-transparent sm:!pw-bg-white !pw-px-0 sm:!pw-px-[35px] !pw-max-w-none sm:!pw-max-w-[514px]',
        logo: 'w-[130px] h-[130px]',
      }}
    >
      <div className="pw-pt-0 pw-pb-6 sm:pw-my-6 pw-flex pw-flex-col pw-items-center pw-leading-[23px] pw-text-lg">
        <p className="pw-font-medium pw-text-[#35394C] pw-mb-6 pw-text-center">
          <Trans
            i18nKey="companyAuth>requestPaswordChange>linkSentToMail"
            values={{ email: formattedEmail }}
          >
            Enviamos um email para:
            <span className="">email</span>
          </Trans>
        </p>
        <div className="pw-mb-[29px]">
          <div className="pw-flex pw-justify-center">
            <button
              disabled={isActive || isLoading}
              className="pw-font-semibold pw-text-[15px] pw-leading-[22px] pw-underline pw-text-brand-primary disabled:pw-text-[#676767] disabled:hover:pw-no-underline"
              onClick={() => mutate({ email })}
            >
              {translate('auth>mailStep>resentCodeButton')}
            </button>
          </div>

          {isActive ? (
            <p className="pw-text-[#35394C] pw-text-base pw-leading-4 pw-text-center pw-mt-[21px] pw-font-bold">
              <Trans
                i18nKey="companyAuth>sendMailToChangePassword>cooldownTimeMessage"
                values={{
                  minutes: minutes,
                  seconds: seconds.toString().padStart(2, '0'),
                }}
              >
                Espere até
                <span className="pw-font-bold">minuto:segundo</span>
                minutos para reenviar o código
              </Trans>
            </p>
          ) : null}
        </div>
        <div className="pw-relative">
          <span className="pw-absolute pw-rounded-full pw-w-[24.51px] pw-h-[24.51px] pw-bg-brand-primary pw-left-[20.48px] pw-top-[29.23px]" />
          <KeyIconOutlined className="pw-max-w-[169.6px] pw-max-h-[83px] pw-stroke-brand-primary" />
        </div>

        <p className="pw-font-medium pw-text-[#35394C] pw-text-center pw-mt-[29px] mb-6">
          {translate('auth>mailStep>linkExpirationMessage')}
        </p>
        <AuthButton
          onClick={() => router.pushConnect(PixwayAppRoutes.SIGN_IN)}
          fullWidth
        >
          {translate('components>advanceButton>continue')}
        </AuthButton>
      </div>

      <AuthFooter />
    </AuthLayoutBase>
  );
};
