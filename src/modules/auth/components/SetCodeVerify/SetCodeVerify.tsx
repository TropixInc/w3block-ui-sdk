import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import { addMinutes } from 'date-fns';

import { WeblockButton } from '../../../shared/components/WeblockButton/WeblockButton';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import useCountdown from '../../../shared/hooks/useCountdown/useCountdown';
import useRouter from '../../../shared/hooks/useRouter';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useEmailProtectedLabel } from '../../hooks/useEmailProtectedLabel';
import { useRequestConfirmationMail } from '../../hooks/useRequestConfirmationMail';

interface SetCodeVerifyProps {
  isPostSignUp?: boolean;
}

export const SetCodeVerify = ({ isPostSignUp }: SetCodeVerifyProps) => {
  const [inputs, setInputs] = useState(['', '', '', '', '', '']);
  const { query, push } = useRouter();
  const email = (query.email as string) ?? '';
  const [translate] = useTranslation();
  const { companyId } = useCompanyConfig();
  const { mutate, isSuccess, isLoading, reset } = useRequestConfirmationMail();
  const [error, setError] = useState('');
  useEffect(() => {
    setNewCountdown(new Date(Date.now() + 900000));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const formattedEmail = useEmailProtectedLabel(email);

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
      setNewCountdown(addMinutes(new Date(), 3));
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, reset]);

  const callbackPath = isPostSignUp
    ? PixwayAppRoutes.COMPLETE_SIGNUP
    : PixwayAppRoutes.SIGN_UP_MAIL_CONFIRMATION;

  const sendCode = () => {
    const code = inputs.join('');
    if (code.length == 6) {
      push(PixwayAppRoutes.COMPLETE_SIGNUP, {
        query: {
          email: email,
          token: code,
        },
      });
    } else {
      setError('código inválido');
    }
  };

  return (
    <div className="pw-flex pw-flex-col pw-items-center">
      <p className="pw-font-poppins pw-text-[24px] pw-text-[#35394C] pw-font-[700]">
        Verificação necessária
      </p>
      <p className="pw-text-[#353945] pw-mt-4 pw-mb-6 pw-text-center pw-text-[13px] pw-leading-[20px] pw-font-normal">
        <Trans
          i18nKey="auth>emailConfirmation>mailSentToEmail"
          values={{ email: formattedEmail }}
        >
          Enviamos um email para:
          <span className="pw-block">email</span>
        </Trans>
      </p>
      <div className="pw-flex pw-gap-x-2">
        {inputs.map((val: string, index: number) => (
          <input
            onChange={(e) => changeInput(index, e)}
            maxLength={1}
            id={`input-${index}`}
            onKeyUp={(e) => keyUp(e, index)}
            value={val}
            className="pw-w-[50px] pw-h-[50px] pw-rounded-lg pw-text-lg pw-px-2 pw-text-center pw-text-[#35394C] pw-font-[700] pw-border pw-border-[#295BA6]"
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
        Continuar
      </WeblockButton>

      <button
        disabled={isActive || isLoading}
        className="pw-font-semibold pw-text-[14px] pw-leading-[21px] pw-mt-5 pw-underline pw-text-brand-primary pw-font-poppins disabled:pw-text-[#676767] disabled:hover:pw-no-underline"
        onClick={() =>
          mutate({ email: email, tenantId: companyId, callbackPath })
        }
      >
        {translate('auth>mailStep>resentCodeButton')}
      </button>
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
      <p className="pw-text-[#353945] pw-text-center pw-text-[13px] pw-leading-[15.85px] pw-mt-[23px] pw-mb-[18px]">
        <Trans i18nKey="auth>emailConfirmation>linkExpiresMessage">
          O link expira em 15 minutos
          <button
            disabled={isActive || isLoading}
            className="pw-font-poppins pw-underline pw-font-semibold pw-leading-[19.5px] disabled:pw-text-[#676767]"
            onClick={() =>
              mutate({
                email: email,
                tenantId: companyId,
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
  );
};
