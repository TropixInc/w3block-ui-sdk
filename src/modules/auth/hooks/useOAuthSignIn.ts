/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
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
      signInWithGoogle &&
        signInWithGoogle({
          code,
          companyId,
          callbackUrl: callback ?? '/',
          referrer: utms.utm_source ?? undefined,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }).then((res: { ok: any }) => {
          if (!res.ok) {
            setGoogleError(true);
          } else {
            router.pushConnect(callback);
          }
        });
    }
  }, [code, isGoogleSignIn]);

  useEffect(() => {
    if (code && isAppleSignIn) {
      signInWithApple &&
        signInWithApple({
          code,
          companyId,
          callbackUrl: callback ?? '/',
          referrer: utms.utm_source ?? undefined,
        }).then((res) => {
          if (!res.ok) {
            setAppleError(true);
          } else {
            router.pushConnect(callback);
          }
        });
    }
  }, [isAppleSignIn, code]);

  return { googleError, appleError, isProcessing };
};
