import { W3blockIdSDK } from '@w3block/sdk-id';

interface Params {
  baseURL: string;
  authToken?: string | null;
  refreshToken?: string | null;
  tenantId: string;
}

/**
 * `W3blockIdSDK.setAuthToken` is protected; this subclass exposes it so an
 * instance can be bound to an access token without a refresh token.
 */
class SessionIdSdk extends W3blockIdSDK {
  useAccessToken(token: string) {
    this.setAuthToken(token);
    return this;
  }
}

/**
 * Creates a `W3blockIdSDK` bound to the current session.
 *
 * The host app only exposes the access token to the browser (the refresh
 * token stays server-side in the next-auth cookie), so the instance is
 * normally authenticated with the access token alone. `sdk.authenticate`
 * insists on decoding a refresh token, so it is only used when one is
 * actually available (hosts that still expose it). Without a token the
 * instance is returned unauthenticated, for public endpoints.
 */
export const createSessionIdSdk = async ({
  baseURL,
  authToken,
  refreshToken,
  tenantId,
}: Params): Promise<W3blockIdSDK> => {
  const sdk = new SessionIdSdk({ autoRefresh: false, baseURL });
  if (!authToken) return sdk;
  if (refreshToken) {
    await sdk.authenticate({ authToken, refreshToken, tenantId });
    return sdk;
  }
  return sdk.useAccessToken(authToken);
};
