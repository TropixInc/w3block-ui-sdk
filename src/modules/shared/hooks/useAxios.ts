import { useEffect, useMemo } from 'react';
import { validateJwtToken, getSecureApi, getPublicAPI } from '../config/api';
import { W3blockAPI } from '../enums/W3blockAPI';
import { usePixwayAPIURL } from './usePixwayAPIURL';
import { useToken } from './useToken';
import { usePixwayAuthentication } from '../../../modules/auth/hooks/usePixwayAuthentication';
import { signOutExpiredSession } from '../utils/expiredSessionSignOut';

export const useAxios = (type: W3blockAPI) => {
  const apisUrl = usePixwayAPIURL();
  const token = useToken();
  const { signOut } = usePixwayAuthentication();
  const apiBaseURLMap = new Map([
    [W3blockAPI.ID, apisUrl.w3blockIdAPIUrl],
    [W3blockAPI.KEY, apisUrl.w3blockKeyAPIUrl],
    [W3blockAPI.COMMERCE, apisUrl.w3blockCommerceAPIUrl],
    [W3blockAPI.POLL, apisUrl.w3BlockPollApiUrl],
    [W3blockAPI.PASS, apisUrl.w3BlockPassApiUrl],
  ]);
  const baseUrl = apiBaseURLMap.get(type) ?? '';

  const tokenExpired = Boolean(token) && !validateJwtToken(token);

  // An expired token that the host app could not refresh means the session is
  // dead: clear it once (deduplicated across every useAxios on the page) and
  // send the user to sign in with a same-origin callback.
  useEffect(() => {
    if (tokenExpired) signOutExpiredSession(signOut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenExpired]);

  return useMemo(
    () => (token ? getSecureApi(token, baseUrl) : getPublicAPI(baseUrl)),
    [token, baseUrl]
  );
};
