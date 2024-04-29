import { lazy, useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import addMinutes from 'date-fns/addMinutes';

const WeblockButton = lazy(() =>
  import('../../../shared/components/WeblockButton/WeblockButton').then(
    (m) => ({ default: m.WeblockButton })
  )
);

import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import useCountdown from '../../../shared/hooks/useCountdown/useCountdown';
import { useProfile } from '../../../shared/hooks/useProfile/useProfile';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useEmailProtectedLabel } from '../../hooks/useEmailProtectedLabel';
import { usePixwayAuthentication } from '../../hooks/usePixwayAuthentication';
import { useRequestConfirmationMail } from '../../hooks/useRequestConfirmationMail';
import { useVerifySignUp } from '../../hooks/useVerifySignUp';

interface SetCodeVerifyProps {
  isPostSignUp?: boolean;
}

const HOUR_IN_MS = 3600000;

export const SetCodeVerify = ({ isPostSignUp }: SetCodeVerifyProps) => {
  const { signOut } = usePixwayAuthentication();
  const [inputs, setInputs] = useState(['', '', '', '', '', '']);
  const { query, pushConnect } = useRouterConnect();
  const { connectProxyPass } = useCompanyConfig();
  const email = (query.email as string) ?? '';
  const { data: profile, refetch } = useProfile();
  const [translate] = useTranslation();
  const { mutate, isSuccess, isLoading, reset } = useRequestConfirmationMail();
  const [error, setError] = useState('');
  const emailToUse = profile?.data?.email ?? email;
  useEffect(() => {
    if (!profile) setNewCountdown(addMinutes(new Date(), 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);
  const formattedEmail = useEmailProtectedLabel(emailToUse);

  const { mutate: mutateVerify } = useVerifySignUp();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const changeInput = (index: number, e: any) => {
    const inputsToChange = inputs;
    inputsToChange[index] = e.target.value;
    setInputs([...inputsToChange]);
    if (e.nativeEvent.inputType !== 'deleteContentBackward') {
      const next = document.getElementById(`input-${index + 1}`);
      next?.focus();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const keyUp = (e: any, index: number) => {
    if (e.code === 'Backspace' && inputs[index] == '') {
      const previous = document.getElementById(`input-${index - 1}`);
      previous?.focus();
    }
  };

  const { minutes, seconds, setNewCountdown, isActive } = useCountdown();

  useEffect(() => {
    if (isSuccess) {
      setNewCountdown(addMinutes(new Date(), 1));
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, reset]);

  const callbackPath =
    connectProxyPass +
    (isPostSignUp
      ? PixwayAppRoutes.COMPLETE_SIGNUP
      : PixwayAppRoutes.SIGN_UP_MAIL_CONFIRMATION);

  const sendCode = () => {
    const code = inputs.join('');
    if (code.length == 6) {
      if (profile) {
        mutateVerify(
          {
            email: emailToUse,
            token: code,
          },
          {
            onSuccess: () => {
              refetch();
              if (query.callbackPath?.length) {
                pushConnect(query.callbackPath as string);
              } else if (query.callbackUrl?.length) {
                pushConnect(query.callbackUrl as string);
              } else if (query.contextSlug?.length) {
                pushConnect(PixwayAppRoutes.COMPLETE_KYC, {
                  ...query,
                });
              } else {
                pushConnect('/');
              }
            },
            onError() {
              setError('Código inválido ou expirado');
            },
          }
        );
      } else {
        pushConnect(
          PixwayAppRoutes.COMPLETE_SIGNUP +
            `?email=${encodeURIComponent(emailToUse)}&token=${code};${
              Date.now() + HOUR_IN_MS
            }&code=${code}`
        );
      }
    } else {
      setError('código inválido');
    }
  };
  useEffect(() => {
    mutate({
      email: emailToUse,
      verificationType: 'numeric',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailToUse]);

  return (
    <div className="pw-flex pw-flex-col pw-items-center">
      <p className="pw-font-poppins pw-text-[24px] pw-text-[#35394C] pw-font-[700] pw-text-center">
        {translate('auth>codeVerify>necessaryVerification')}
      </p>
      <p className="pw-text-[#353945] pw-mt-4 pw-mb-6 pw-text-center pw-text-[13px] pw-leading-[20px] pw-font-normal">
        <Trans
          i18nKey="auth>emailConfirmation>codeSentToEmail"
          values={{ email: formattedEmail }}
        >
          Enviamos um código para:
          <span className="pw-block">email</span>
        </Trans>
      </p>
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
        <p className="pw-text-xs pw-text-red-500 pw-font-poppins">{error}</p>
      </div>

      <WeblockButton
        disabled={inputs.some((i) => i == '')}
        onClick={sendCode}
        className="pw-mt-4 pw-text-white"
        fullWidth={true}
      >
        {translate('components>advanceButton>continue')}
      </WeblockButton>

      <button
        disabled={isLoading || isActive}
        className="pw-font-semibold pw-text-[14px] pw-leading-[21px] pw-mt-5 pw-underline pw-text-brand-primary pw-font-poppins disabled:pw-text-[#676767] disabled:hover:pw-no-underline"
        onClick={() =>
          mutate({
            email: emailToUse,
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
          O código expira em 15 minutos
          <button
            disabled={isLoading || isActive}
            className="pw-font-poppins pw-underline pw-font-semibold pw-leading-[19.5px] disabled:pw-text-[#676767]"
            onClick={() =>
              mutate({
                email: emailToUse,
                callbackPath,
                verificationType: 'numeric',
              })
            }
          >
            Reenviar código
          </button>
          para enviar outro
        </Trans>
      </p>
      <p className="pw-text-sm pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mt-5 pw-text-end">
        <button
          onClick={() =>
            signOut().then(() => {
              pushConnect(PixwayAppRoutes.HOME);
            })
          }
          className="pw-text-[15px] pw-leading-[18px] pw-text-[#ff5a5a] pw-font-semibold pw-mt-5 pw-underline hover:pw-text-[#993d3d]"
        >
          {translate('shared>exit')}
        </button>{' '}
        {translate('auth>formCompleteKYCWithoutLayout>continueLater')}
      </p>
    </div>
  );
};
