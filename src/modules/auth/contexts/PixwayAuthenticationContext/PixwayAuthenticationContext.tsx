import { createContext } from 'react';

import { ResetPasswordPayload } from '../../api/resetPassword';
import { SignInPayload } from '../../api/signIn';

export interface IPixwayAuthenticationContext {
  signIn: (payload: SignInPayload) => Promise<any>;
  changePasswordAndSignIn: (payload: ResetPasswordPayload) => Promise<any>;
}

export const PixwayAuthenticationContext = createContext(
  {} as IPixwayAuthenticationContext
);
