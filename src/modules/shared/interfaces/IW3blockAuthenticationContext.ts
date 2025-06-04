import { SignInPayload, SignInWithCodePayload } from "./ISignin";
import { ResetPasswordPayload } from "./ResetPasswordPayload";

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