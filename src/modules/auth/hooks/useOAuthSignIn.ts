import { useEffect, useState } from 'react';

import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { authFlowLog } from '../utils/authFlowTimer';
import { useUtms } from '../../shared/hooks/useUtms';
import { usePixwayAuthentication } from './usePixwayAuthentication';

interface UseOAuthSignInParams {
  code: string;
  isGoogleSignIn: boolean;
  isAppleSignIn: boolean;
  callback: string;
}

export const useOAuthSignIn = ({
  code,
  isGoogleSignIn,
  isAppleSignIn,
  callback,
}: UseOAuthSignInParams) => {
  const { companyId } = useCompanyConfig();
  const { signInWithGoogle, signInWithApple } = usePixwayAuthentication();
  const router = useRouterConnect();
  const utms = useUtms();
  const [googleError, setGoogleError] = useState(false);
  const [appleError, setAppleError] = useState(false);
  const isProcessing =
    code &&
    ((isGoogleSignIn && !googleError) || (isAppleSignIn && !appleError));

  useEffect(() => {
    if (code && isGoogleSignIn) {
      const timer = authFlowLog("useOAuthSignIn.google", { callback });
      signInWithGoogle &&
        signInWithGoogle({
          code,
          companyId,
          callbackUrl: callback ?? '/',
          referrer: utms.utm_source ?? undefined,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }).then((res: { ok: any }) => {
          if (!res.ok) {
            timer.log("signInWithGoogle falhou");
            setGoogleError(true);
          } else {
            timer.log("signInWithGoogle ok, redirect");
            router.pushConnect(callback);
          }
          timer.end();
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, isGoogleSignIn]);

  useEffect(() => {
    if (code && isAppleSignIn) {
      const timer = authFlowLog("useOAuthSignIn.apple", { callback });
      signInWithApple &&
        signInWithApple({
          code,
          companyId,
          callbackUrl: callback ?? '/',
          referrer: utms.utm_source ?? undefined,
        }).then((res) => {
          if (!res.ok) {
            timer.log("signInWithApple falhou");
            setAppleError(true);
          } else {
            timer.log("signInWithApple ok, redirect");
            router.pushConnect(callback);
          }
          timer.end();
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, isAppleSignIn]);

  return { googleError, appleError, isProcessing };
};
