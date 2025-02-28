/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import addMinutes from 'date-fns/addMinutes';

import { Alert } from '../../../shared/components/Alert';
import { WeblockButton } from '../../../shared/components/WeblockButton/WeblockButton';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import useCountdown from '../../../shared/hooks/useCountdown/useCountdown';
import { useProfile } from '../../../shared/hooks/useProfile/useProfile';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';
import { UseThemeConfig } from '../../../storefront/hooks/useThemeConfig/useThemeConfig';
import { useEmailProtectedLabel } from '../../hooks/useEmailProtectedLabel';
import { usePixwayAuthentication } from '../../hooks/usePixwayAuthentication';
import { useRequestSignInCode } from '../../hooks/useRequestSignInCode/useRequestSignInCode';
import { useSignInWithCode } from '../../hooks/useSignInWithCode/useSignInWithCode';

export const SignInWithCodeWithoutLayout = () => {
  const [inputs, setInputs] = useState(['', '', '', '', '', '']);
  const { query, pushConnect } = useRouterConnect();
  const { mutate: mutateVerify } = useSignInWithCode();
  const { signInWithCode } = usePixwayAuthentication();
  const { companyId: tenantId } = useCompanyConfig();
  const { data: profile } = useProfile();
  const [translate] = useTranslation();
  const { mutate, isSuccess, isLoading, reset } = useRequestSignInCode();
  const [error, setError] = useState('');
  useEffect(() => {
    if (!profile) setNewCountdown(addMinutes(new Date(), 1));
  }, [profile]);
  const emailToUse = query.email as string;

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
  const theme = UseThemeConfig();
  const postSigninURL =
    theme?.defaultTheme?.configurations?.contentData?.postSigninURL;
  useEffect(() => {
    if (isSuccess && !profile) {
      setNewCountdown(addMinutes(new Date(), 1));
      reset();
    }
  }, [isSuccess, reset, profile]);
  const [remainLoading, setRemainLoading] = useState(false);
  const sendCode = () => {
    const code = inputs.join('');
    if (code.length == 6 && emailToUse) {
      setRemainLoading(true);
      setError('');
      mutateVerify(
        { email: emailToUse, code },
        {
          onSuccess() {
            signInWithCode &&
              signInWithCode({ email: emailToUse, code, tenantId }).then(
                (data) => {
                  if (data.error == null) {
                    if (query.callbackUrl?.length)
                      pushConnect(query.callbackUrl as string);
                    if (query.callbackPath?.length)
                      pushConnect(query.callbackPath as string);
                    else if (query.contextSlug?.length)
                      pushConnect(PixwayAppRoutes.COMPLETE_KYC, query);
                    else if (postSigninURL) pushConnect(postSigninURL);
                    else pushConnect('/');
                  }
                }
              );
          },
          onError() {
            setRemainLoading(false);
            setError('Código inválido ou expirado');
          },
        }
      );
    } else {
      setRemainLoading(false);
      setError('código inválido');
    }
  };

  useEffect(() => {
    mutate({
      email: emailToUse ?? '',
      tenantId,
    });
  }, [emailToUse]);

  return (
    <div className="pw-flex pw-flex-col pw-items-center">
      {'TESTE'}
      <p className="pw-font-poppins pw-text-[24px] pw-text-[#35394C] pw-font-[700] pw-text-center">
        {translate('auth>signInWithCodeWithoutLayout>youBeenBefore')}
      </p>
      <p className="pw-text-[#353945] pw-mt-4 pw-mb-6 pw-text-center pw-text-[13px] pw-leading-[20px] pw-font-normal">
        {translate('auth>signInWithCodeWithoutLayout>codeForConfirmIdentity')}
        <span className="pw-block">{formattedEmail}</span>
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
      {error !== '' && (
        <Alert variant="error">
          <p className="pw-text-xs pw-text-red-500 pw-font-poppins">{error}</p>
        </Alert>
      )}

      <WeblockButton
        disabled={inputs.some((i) => i == '') || remainLoading}
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
            email: emailToUse ?? '',
            tenantId,
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
                tenantId,
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
