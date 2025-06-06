import { lazy, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocalStorage } from 'react-use';

import { addMinutes, isAfter } from 'date-fns';
import { AuthButton } from '../../auth/components/AuthButton';
import { useRequestConfirmationMail } from '../../auth/hooks/useRequestConfirmationMail';
import { useVerifySignUp } from '../../auth/hooks/useVerifySignUp';
import { LocalStorageFields } from '../enums/LocalStorageFields';
import { PixwayAppRoutes } from '../enums/PixwayAppRoutes';
import { useCompanyConfig } from '../hooks/useCompanyConfig';
import useCountdown from '../hooks/useCountdown';
import { useProfile } from '../hooks/useProfile';
import { useSessionUser } from '../hooks/useSessionUser';
import { removeDoubleSlashesOnUrl } from '../utils/removeDuplicateSlahes';
import CloseIcon from '../assets/icons/closeCircledOutlined.svg';
import { BaseButton } from './Buttons';


interface ModalBlockedActionProps {
  email: string;
  isOpen?: boolean;
  hideCloseButton?: boolean;
  toggleOpen: (nextValue?: boolean, refe?: boolean) => void;
  minutesResendEmail: number;
  code?: boolean;
}

export const ModalBlockedAction = ({
  email,
  isOpen = false,
  hideCloseButton = false,
  toggleOpen,
  minutesResendEmail,
  code = false,
}: ModalBlockedActionProps) => {
  const [translate] = useTranslation();
  const [error, setError] = useState('');
  const [inputs, setInputs] = useState(['', '', '', '', '', '']);
  const { appBaseUrl, connectProxyPass } = useCompanyConfig();
  const user = useSessionUser();
  const { refetch } = useProfile();
  const [countdownDate, setCountdownDate] = useLocalStorage<Date>(
    LocalStorageFields.EMAIL_CONFIRMATION_LINK_COUNTDOWN_DATE
  );
  const { minutes, seconds, setNewCountdown, isActive } = useCountdown();
  const { mutate, isLoading } = useRequestConfirmationMail();
  const { mutate: mutateVerify, isLoading: isLoadingVerify } =
    useVerifySignUp();

  useEffect(() => {
    if (countdownDate && isAfter(new Date(countdownDate), new Date())) {
      setNewCountdown(new Date(countdownDate));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdownDate]);

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
      mutate({
        email: user.email,
        verificationType: 'numeric',
        callbackPath: removeDoubleSlashesOnUrl(
          appBaseUrl +
            connectProxyPass +
            PixwayAppRoutes.SIGN_UP_MAIL_CONFIRMATION
        ),
      });
    }
  };

  const changeInput = (index: number, e: any) => {
    const inputsToChange = inputs;
    inputsToChange[index] = e.target.value;
    setInputs([...inputsToChange]);
    if (e.nativeEvent.inputType !== 'deleteContentBackward') {
      const next = document.getElementById(`input-${index + 1}`);
      next?.focus();
    }
  };

  const keyUp = (e: any, index: number) => {
    if (e.code === 'Backspace' && inputs[index] == '') {
      const previous = document.getElementById(`input-${index - 1}`);
      previous?.focus();
    }
  };

  const sendCode = () => {
    const code = inputs.join('');
    if (code.length == 6 && email) {
      mutateVerify(
        { email: email, token: code },
        {
          onSuccess(data: { data: { verified: any; }; }) {
            if (data?.data?.verified) {
              refetch();
              toggleOpen(false);
            } else {
              setError('código inválido');
            }
          },
        }
      );
    } else {
      setError('código inválido');
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
      <div className="pw-fixed pw-bg-white pw-px-4 pw-py-6 pw-h-screen sm:pw-h-auto pw-w-full sm:pw-max-w-[440px] sm:pw-rounded-[20px] sm:pw-left-1/2 pw-top-[82px] sm:pw-top-1/2 sm:-pw-translate-x-1/2 sm:-pw-translate-y-1/2 pw-z-10 sm:pw-z-50 pw-flex pw-flex-col pw-shadow-[1px_1px_10px_rgba(0,0,0,0.2)]">
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
          {code ? (
            <>
              <div className="pw-flex pw-gap-x-2">
                {inputs.map((val: string, index: number) => (
                  <input
                    autoFocus={index == 0}
                    onChange={(e) => changeInput(index, e)}
                    maxLength={1}
                    id={`input-${index}`}
                    onKeyUp={(e) => keyUp(e, index)}
                    value={val}
                    className="sm:pw-w-[50px] sm:pw-h-[50px] pw-w-[40px] pw-h-[40px] pw-rounded-lg pw-text-lg pw-px-2 pw-text-center pw-text-[#35394C] pw-font-[700] pw-border pw-border-[#295BA6]"
                    key={index}
                    type="tel"
                  />
                ))}
              </div>
              <div className="pw-flex pw-w-full">
                <p className="pw-text-xs pw-text-red-500 pw-font-poppins">
                  {error}
                </p>
              </div>

              <BaseButton
                disabled={inputs.some((i) => i == '') || isLoadingVerify}
                onClick={sendCode}
                className="pw-mt-4 pw-text-white"
                fullWidth={true}
              >
                {translate('components>advanceButton>continue')}
              </BaseButton>

              <button
                disabled={isLoading || isActive}
                className="pw-font-semibold pw-text-[14px] pw-leading-[21px] pw-mt-5 pw-underline pw-text-brand-primary pw-font-poppins disabled:pw-text-[#676767] disabled:hover:pw-no-underline"
                onClick={() =>
                  mutate({
                    email: email,
                    verificationType: 'numeric',
                  })
                }
              >
                {translate('auth>mailStep>resentCodeButton')}
              </button>
              {isActive ? (
                <p className="pw-text-[#353945] pw-text-[13px] pw-leading-[15.85px] pw-text-center pw-mt-[18px]">
                  {translate('auth>setCode>cooldownTimeMessage', {
                    minutes,
                    seconds: seconds.toString().padStart(2, '0'),
                  })}
                </p>
              ) : null}
              <p className="pw-text-[#353945] pw-text-center pw-text-[13px] pw-leading-[15.85px] pw-mt-[23px] pw-mb-[18px]">
                <Trans i18nKey="auth>emailConfirmation>linkExpiresMessage">
                  O link expira em 15 minutos
                  <button
                    disabled={isLoading || isActive}
                    className="pw-font-poppins pw-underline pw-font-semibold pw-leading-[19.5px] disabled:pw-text-[#676767]"
                    onClick={() =>
                      mutate({
                        email: email,
                        verificationType: 'numeric',
                      })
                    }
                  >
                    Reenviar código
                  </button>
                  para enviar outro
                </Trans>
              </p>
            </>
          ) : (
            <>
              <p className="pw-w-[329px]">
                {translate(
                  'auth>modalActionBlocked>verifyEmail>linkTimeExpires',
                  {
                    minutes: minutesResendEmail,
                  }
                )}
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
            </>
          )}
        </div>
      </div>
    </>
  );
};
