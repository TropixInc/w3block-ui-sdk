/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react';

import { ResetPasswordPayload } from '../../api/resetPassword';
import { SignInPayload, SignInWithCodePayload } from '../../api/signIn';

export interface IW3blockAuthenticationContext {
  signIn: (payload: SignInPayload) => Promise<any>;
  changePasswordAndSignIn: (payload: ResetPasswordPayload) => Promise<any>;
  signOut: (payload?: { callbackUrl?: string }) => Promise<any>;
  signInWithCode?: (payload: SignInWithCodePayload) => Promise<any>;
  signInAfterSignUp?: (payload: {
    email: string;
    tenantId: string;
  }) => Promise<any>;
  signInWithGoogle?: (payload: {
    companyId: string;
    code: string;
    referrer?: string;
    callbackUrl?: string | undefined;
  }) => Promise<any>;
}

export const W3blockAuthenticationContext = createContext(
  {} as IW3blockAuthenticationContext
);
