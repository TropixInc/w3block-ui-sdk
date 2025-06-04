/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import addMinutes from 'date-fns/addMinutes';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { usePixwayAuthentication } from '../hooks/usePixwayAuthentication';
import { useVerifySignUp } from '../hooks/useVerifySignUp';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useProfile } from '../../shared/hooks/useProfile';
import { Alert } from '../../shared/components/Alert';
import { BaseButton } from '../../shared/components/Buttons';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import useCountdown from '../../shared/hooks/useCountdown';
import { useEmailProtectedLabel } from '../hooks/useEmailProtectedLabel';
import { useRequestConfirmationMail } from '../hooks/useRequestConfirmationMail';



interface VerifySignUpWithCodeWithoutLayoutProps {
  emailLocal?: string;
  password?: string;
  skipWallet?: boolean;
  postSigninURL?: string;
}

export const VerifySignUpWithCodeWithoutLayout = ({
  emailLocal,
  password,
  skipWallet,
  postSigninURL,
}: VerifySignUpWithCodeWithoutLayoutProps) => {
  const [inputs, setInputs] = useState(['', '', '', '', '', '']);
  const { query, pushConnect } = useRouterConnect();
  const { signIn } = usePixwayAuthentication();
  const { mutate: mutateVerify, isLoading: isLoadingVerify } =
    useVerifySignUp();
  const { companyId } = useCompanyConfig();
  const { data: profile } = useProfile();
  const [translate] = useTranslation();
  const { mutate, isSuccess, isLoading, reset } = useRequestConfirmationMail();
  const [error, setError] = useState('');
  useEffect(() => {
    if (!profile) setNewCountdown(addMinutes(new Date(), 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);
  const emailToUse = profile?.data?.email ?? emailLocal;
  const formattedEmail = useEmailProtectedLabel(emailToUse ?? '');

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

  const { minutes, seconds, setNewCountdown, isActive } = useCountdown();

  useEffect(() => {
    if (isSuccess && !profile) {
      setNewCountdown(addMinutes(new Date(), 1));
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, reset, profile]);

  const [remainLoading, setRemainLoading] = useState(false);
  const sendCode = () => {
    const code = inputs.join('');
    if (code.length == 6 && emailToUse) {
      setError('');
      setRemainLoading(true);
      mutateVerify(
        { email: emailToUse, token: code },
        {
          onSuccess(data: any) {
            if (data.data.verified && password) {
              signIn({ email: emailToUse, password, companyId }).then(
                (data: { error: null; }) => {
                  if (data.error === null) {
                    if (query.callbackPath?.length) {
                      pushConnect(query.callbackPath as string);
                    } else if (query.callbackUrl?.length) {
                      pushConnect(query.callbackUrl as string);
                    } else if (query.contextSlug?.length) {
                      pushConnect(PixwayAppRoutes.COMPLETE_KYC, {
                        ...query,
                      });
                    } else if (postSigninURL) {
                      pushConnect(postSigninURL);
                    } else if (!skipWallet)
                      pushConnect(
                        PixwayAppRoutes.CONNECT_EXTERNAL_WALLET,
                        query
                      );
                    else pushConnect('/');
                  }
                }
              );
            } else {
              setRemainLoading(false);
              setError('Código inválido ou expirado');
            }
          },
        }
      );
    } else {
      setRemainLoading(false);
      setError('código inválido');
    }
  };

  return (
    <div className="pw-flex pw-flex-col pw-items-center">
      <p className="pw-font-poppins pw-text-[24px] pw-text-[#35394C] pw-font-[700] pw-text-center">
        {translate('auth>codeVerify>necessaryVerification')}
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
      {error !== '' ? (
        <Alert variant="error" className="pw-mt-2">
          {error}
        </Alert>
      ) : null}

      <BaseButton
        disabled={inputs.some((i) => i == '') || isLoadingVerify}
        onClick={sendCode}
        className="pw-mt-4 pw-text-white"
        fullWidth={true}
      >
        {translate('components>advanceButton>continue')}
      </BaseButton>

      <button
        disabled={isActive || remainLoading}
        className="pw-font-semibold pw-text-[14px] pw-leading-[21px] pw-mt-5 pw-underline pw-text-brand-primary pw-font-poppins disabled:pw-text-[#676767] disabled:hover:pw-no-underline"
        onClick={() =>
          mutate({
            email: emailToUse ?? '',
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
        <Trans i18nKey="auth>setCode>linkExpiresMessage">
          O código expira em 15 minutos
          <button
            disabled={isLoading || isActive}
            className="pw-font-poppins pw-underline pw-font-semibold pw-leading-[19.5px] disabled:pw-text-[#676767]"
            onClick={() =>
              mutate({
                email: emailToUse ?? '',
                verificationType: 'numeric',
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
