import { DefaultSession } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: string | undefined;
    refreshToken?: string;
    user: {
      accessToken: string | undefined;
      refreshToken?: string;
    } & DefaultSession['user'];
    id: string | undefined;
    sub: string | undefined;
    error: string | undefined;
  }

  interface User {
    id: string;
    email?: string;
    name?: string;
    accessToken: string | undefined;
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    accessToken: string | undefined;
    refreshToken?: string;
    error: string | undefined;
    sub: string | undefined;
    picture: string | undefined;
    name: string | undefined;
    email: string | undefined;
    accessTokenExpires: number | undefined;
    user: {
      accessToken: string | undefined;
    } & DefaultJWT['user'];
  }
}
