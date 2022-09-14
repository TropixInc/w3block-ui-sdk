import { AxiosError } from 'axios';
import jwtDecode from 'jwt-decode';
import { NextAuthOptions, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { SessionUser } from '../../../shared/enums/SessionUser';
import { removeDuplicateSlahes } from '../../../shared/utils/removeDuplicateSlahes';
import { SignInResponse } from '../../api/signIn';
import { CredentialProviderName } from '../../enums/CredentialsProviderName';

const tokenMaxAgeInSeconds = 3600;
const BEFORE_TOKEN_EXPIRES = tokenMaxAgeInSeconds / 2;

async function refreshAccessToken(
  token: JWT & { accessToken?: string; refreshToken?: string },
  baseURL: string
): Promise<JWT & { accessToken?: string; refreshToken?: string }> {
  try {
    const response = await fetch(
      removeDuplicateSlahes(`${baseURL}/${PixwayAPIRoutes.REFRESH_TOKEN}`),
      {
        method: 'POST',
        body: JSON.stringify({
          refreshToken: token.refreshToken ?? '',
        }),
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token.accessToken ?? ''}`,
        },
      }
    );
    const { token: tokenResponse, refreshToken } = await response.json();
    const result = {
      ...token,
      accessToken: tokenResponse,
      refreshToken: refreshToken || token.refreshToken,
      accessTokenExpires: getTokenExpires(tokenResponse, -BEFORE_TOKEN_EXPIRES),
    };

    return result;
  } catch (error: any) {
    if (error.isAxiosError) {
      const axiosError = error as AxiosError;
      console.error({ data: axiosError.response?.data });
    } else {
      console.error(error);
    }

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

interface Config {
  secret: string;
  baseURL: string;
}

export const getNextAuthConfig = ({
  secret,
  baseURL,
}: Config): NextAuthOptions => ({
  secret,
  session: {
    maxAge: tokenMaxAgeInSeconds,
  },
  providers: [
    CredentialsProvider({
      id: CredentialProviderName.SIGNIN_WITH_COMPANY_ID,
      credentials: {
        email: {
          type: 'email',
        },
        password: {
          type: 'password',
        },
        confirmation: {
          type: 'password',
        },
        companyId: {
          type: 'string',
        },
      },
      authorize: async (payload) => {
        try {
          const response = await fetch(
            removeDuplicateSlahes(`${baseURL}/${PixwayAPIRoutes.SIGN_IN}`),
            {
              method: 'POST',
              body: JSON.stringify({
                tenantId: payload?.companyId ?? '',
                email: payload?.email ?? '',
                password: payload?.password ?? '',
              }),
              headers: { 'Content-type': 'application/json' },
            }
          );
          const responseAsJSON = await response.json();
          const user = mapSignInReponseToSessionUser(responseAsJSON);
          return user;
        } catch (err) {
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: CredentialProviderName.CHANGE_PASSWORD_AND_SIGNIN,
      credentials: {
        email: {
          type: 'email',
        },
        password: {
          type: 'password',
        },
        confirmation: {
          type: 'password',
        },
        token: {
          type: 'string',
        },
      },
      authorize: async (payload) => {
        try {
          const response = await fetch(
            removeDuplicateSlahes(
              `${baseURL}/${PixwayAPIRoutes.RESET_PASSWORD}`
            ),
            {
              method: 'POST',
              body: JSON.stringify({
                email: payload?.email ?? '',
                token: payload?.token ?? '',
                confirmation: payload?.confirmation ?? '',
                password: payload?.password ?? '',
              }),
              headers: {
                'Content-type': 'application/json',
              },
            }
          );
          const responseAsJson: SignInResponse = await response.json();
          return mapSignInReponseToSessionUser(responseAsJson);
        } catch (error: any) {
          if (error.isAxiosError) {
            const typedError = error as AxiosError<any>;
            if (typedError.response?.data?.message === 'Invalid token') {
              throw new Error('expired');
            }
            return null;
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user?.accessToken) {
        const apiToken = user?.accessToken as string;

        return {
          sub: token?.sub,
          picture: token?.picture,
          name: token?.name,
          email: token?.email,
          accessToken: apiToken,
          accessTokenExpires: getTokenExpires(apiToken, -BEFORE_TOKEN_EXPIRES),
          refreshToken: user?.refreshToken,
          user,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token, baseURL);
    },
    async session({ session, token }) {
      const user: User = token.user as User;
      session.user = user;
      session.id = user.id;
      session.sub = token.sub;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;
      return session;
    },
  },
  pages: {
    signIn: '/auth/sign-in',
    newUser: '/auth/sign-up',
    verifyRequest: '/auth/mail-confirmation/sign-up',
    signOut: '/auth',
  },
});

const mapSignInReponseToSessionUser = (
  response: SignInResponse
): SessionUser => {
  const { data, token: accessToken, refreshToken } = response;
  return {
    accessToken,
    refreshToken,
    id: data.sub,
    email: data.email,
    roles: data.roles,
    name: data.name,
    companyId: data.companyId,
  };
};

function getTokenExpires(token: string, threshold = 0): number {
  const { exp } = jwtDecode(token) as { exp: number };
  return (+exp + threshold) * 1000 + threshold;
}

export default getNextAuthConfig;
