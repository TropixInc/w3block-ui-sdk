import { useEffect, useMemo } from 'react';
import { Trans } from 'react-i18next';
import { useLocalStorage } from 'react-use';

import { addMinutes, isAfter } from 'date-fns';

import {
  requestConfirmationEmail,
  RequestConfirmationEmailBody,
} from '../../../auth/api/requestConfirmationEmail';
import { AuthButton } from '../../../auth/components/AuthButton';
import { ReactComponent as CloseIcon } from '../../assets/icons/closeCircledOutlined.svg';
import { LocalStorageFields } from '../../enums/LocalStorageFields';
import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import useCountdown from '../../hooks/useCountdown/useCountdown';
import { usePixwayAPIURL } from '../../hooks/usePixwayAPIURL/usePixwayAPIURL';
import { useSessionUser } from '../../hooks/useSessionUser';
import useTranslation from '../../hooks/useTranslation';

interface ModalBlockedActionProps {
  email: string;
  tenant: string;
  isOpen?: boolean;
  hideCloseButton?: boolean;
  toggleOpen: (nextValue?: boolean) => void;
  minutesResendEmail: number;
}

export const ModalBlockedAction = ({
  email,
  tenant,
  isOpen = false,
  hideCloseButton = false,
  toggleOpen,
  minutesResendEmail,
}: ModalBlockedActionProps) => {
  const [translate] = useTranslation();
  const user = useSessionUser();
  const [countdownDate, setCountdownDate] = useLocalStorage<Date>(
    LocalStorageFields.EMAIL_CONFIRMATION_LINK_COUNTDOWN_DATE
  );
  const { minutes, seconds, setNewCountdown, isActive } = useCountdown();
  //const { minutesResendEmail } = useContext(W3blockUISdkResendConfirmEmail);
  const { w3blockIdAPIUrl } = usePixwayAPIURL();

  useEffect(() => {
    if (countdownDate && isAfter(new Date(countdownDate), new Date())) {
      setNewCountdown(new Date(countdownDate));
    }
  }, [countdownDate, setNewCountdown]);

  useEffect(() => {
    isOpen && !isActive && resendEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const formattedEmail = useMemo(() => {
    const emailSplitted = email.split('@');
    if (emailSplitted.length === 1) return emailSplitted;
    return emailSplitted[0]
      .substring(0, 3)
      .concat('****@')
      .concat(emailSplitted[1]);
  }, [email]);

  const resendEmail = () => {
    if (user?.email) {
      setCountdownDate(addMinutes(new Date(), minutesResendEmail));

      const body: RequestConfirmationEmailBody = {
        callbackUrl: PixwayAPIRoutes.CALLBACK,
        email: user.email,
        tenantId: tenant,
      };

      requestConfirmationEmail(
        user.accessToken || '',
        tenant,
        w3blockIdAPIUrl,
        user.refreshToken || '',
        body
      );
    }
  };

  return !isOpen ? (
    <></>
  ) : (
    <>
      <div
        className="hidden sm:block fixed left-0 top-0 h-screen w-full bg-[#00000080] z-40"
        onClick={() => toggleOpen()}
      />
      <div className="pw-fixed pw-bg-white pw-px-4 pw-py-6 pw-h-screen sm:pw-h-auto pw-w-full sm:pw-max-w-[656px] sm:pw-rounded-[20px] sm:pw-left-1/2 pw-top-[82px] sm:pw-top-1/2 sm:-pw-translate-x-1/2 sm:-pw-translate-y-1/2 pw-z-10 sm:pw-z-50 pw-flex pw-flex-col pw-shadow-[1px_1px_10px_rgba(0,0,0,0.2)]">
        <div className="pw-w-full pw-flex pw-items-center pw-justify-center pw-relative pw-mb-[24px]">
          <h1 className="pw-text-[#353945] pw-font-bold pw-text-[24px] pw-leading-[29.26px]">
            {translate('auth>modalActionBlocked>verifyEmail>title')}
          </h1>
          {!hideCloseButton && (
            <button
              className="pw-bg-[#F7F7F7] pw-rounded-full pw-w-9 pw-h-9 pw-absolute pw-right-0 pw-top-0 pw-flex pw-items-center pw-justify-center pw-border-[0.71px] pw-border-[#777E8F]"
              onClick={() => toggleOpen()}
            >
              <CloseIcon className="pw-stroke-[#353945]" />
            </button>
          )}
        </div>
        <div className="pw-flex pw-flex-col pw-gap-[24px] pw-justify-center pw-items-center pw-text-center pw-font-normal pw-text-[13px] pw-leading-[16px] pw-text-[#777E8F]">
          <p className="pw-w-[343px]">
            {translate('auth>modalActionBlocked>verifyEmail>forYourSafety')}
          </p>
          <p className="pw-font-semibold pw-w-[278px] pw-text-[12px] pw-leading-[15px] pw-text-[#353945]">
            {translate('auth>modalActionBlocked>verifyEmail>sendEmail')}
            <br />
            {formattedEmail}
          </p>
          <p className="pw-w-[329px]">
            {translate('auth>modalActionBlocked>verifyEmail>linkTimeExpires', {
              minutes: minutesResendEmail,
            })}
            <br />
            <br />
            <Trans
              i18nKey="companyAuth>sendMailToChangePassword>cooldownTimeMessage"
              values={{
                minutes: minutes,
                seconds: seconds.toString().padStart(2, '0'),
              }}
            >
              Espere até
              <span className="pw-font-bold pw-text-[12px] pw-leading-[14.63px]">
                minuto:segundo
              </span>
              minutos para reenviar o código
            </Trans>
          </p>

          <AuthButton
            onClick={resendEmail}
            className="pw-px-[48px] pw-py-[12.5px]"
            disabled={isActive}
          >
            {translate('auth>mailStep>resentCodeButton')}
          </AuthButton>
        </div>
      </div>
    </>
  );
};
