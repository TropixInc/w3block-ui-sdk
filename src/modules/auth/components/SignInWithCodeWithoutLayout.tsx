/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import addMinutes from 'date-fns/addMinutes';
import { Alert } from '../../shared/components/Alert';
import { WeblockButton } from '../../shared/components/WeblockButton';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import useCountdown from '../../shared/hooks/useCountdown';
import { useProfile } from '../../shared/hooks/useProfile';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { useCodeInput } from '../hooks/useCodeInput';
import { useEmailProtectedLabel } from '../hooks/useEmailProtectedLabel';
import { CodeInputGrid } from './CodeInputGrid';
import { usePixwayAuthentication } from '../hooks/usePixwayAuthentication';
import { useRequestSignInCode } from '../hooks/useRequestSignInCode';
import { useSignInWithCode } from '../hooks/useSignInWithCode';
import useTranslation from '../../shared/hooks/useTranslation';

export const SignInWithCodeWithoutLayout = () => {
  const { inputs, changeInput, handleKeyUp, code, isComplete } = useCodeInput();
  const { query } = useRouterConnect();
  const { mutate: mutateVerify } = useSignInWithCode();
  const { signInWithCode } = usePixwayAuthentication();
  const { companyId: tenantId } = useCompanyConfig();
  const { data: profile } = useProfile();
  const [translate] = useTranslation();
  const { mutate, isSuccess, isPending, reset } = useRequestSignInCode();
  const [error, setError] = useState('');
  useEffect(() => {
    if (!profile) setNewCountdown(addMinutes(new Date(), 1));
  }, [profile]);
  const emailToUse = query.email as string;

  const formattedEmail = useEmailProtectedLabel(emailToUse ?? '');

  const { minutes, seconds, setNewCountdown, isActive } = useCountdown();
  const { redirect } = useAuthRedirect();
  useEffect(() => {
    if (isSuccess && !profile) {
      setNewCountdown(addMinutes(new Date(), 1));
      reset();
    }
  }, [isSuccess, reset, profile]);
  const [remainLoading, setRemainLoading] = useState(false);
  const sendCode = () => {
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
                    redirect();
                  }
                }
              );
          },
          onError() {
            setRemainLoading(false);
            setError(translate('auth>codeVerify>invalidOrExpiredCode'));
          },
        }
      );
    } else {
      setRemainLoading(false);
      setError(translate('auth>codeVerify>invalidCode'));
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
      <p className="pw-font-poppins pw-text-[24px] pw-text-[#35394C] pw-font-[700] pw-text-center">
        {translate('auth>signInWithCodeWithoutLayout>youBeenBefore')}
      </p>
      <p className="pw-text-[#353945] pw-mt-4 pw-mb-6 pw-text-center pw-text-[13px] pw-leading-[20px] pw-font-normal">
        {translate('auth>signInWithCodeWithoutLayout>codeForConfirmIdentity')}
        <span className="pw-block">{formattedEmail}</span>
      </p>
      <CodeInputGrid inputs={inputs} changeInput={changeInput} handleKeyUp={handleKeyUp} />
      {error !== '' && (
        <Alert variant="error">
          <p className="pw-text-xs pw-text-red-500 pw-font-poppins">{error}</p>
        </Alert>
      )}

      <WeblockButton
        disabled={!isComplete || remainLoading}
        onClick={sendCode}
        className="pw-mt-4 pw-text-white"
        fullWidth={true}
      >
        {translate('components>advanceButton>continue')}
      </WeblockButton>

      <button
        disabled={isPending || isActive}
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
            disabled={isPending || isActive}
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
