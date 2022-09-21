import { createContext } from 'react';

import { ResetPasswordPayload } from '../../api/resetPassword';
import { SignInPayload } from '../../api/signIn';

export interface IW3blockAuthenticationContext {
  signIn: (payload: SignInPayload) => Promise<any>;
  changePasswordAndSignIn: (payload: ResetPasswordPayload) => Promise<any>;
  signOut: () => void;
}

export const W3blockAuthenticationContext = createContext(
  {} as IW3blockAuthenticationContext
);
