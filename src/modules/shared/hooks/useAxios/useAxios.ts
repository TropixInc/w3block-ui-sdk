import { useMemo } from 'react';

import { usePixwayAuthentication } from '../../../auth/hooks/usePixwayAuthentication';
import { getPublicAPI, getSecureApi, validateJwtToken } from '../../config/api';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { usePixwayAPIURL } from '../usePixwayAPIURL/usePixwayAPIURL';
import { useToken } from '../useToken';

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
    [W3blockAPI.DIRECTORY, apisUrl.w3blockDirectoryApiUrl],
  ]);
  const baseUrl = apiBaseURLMap.get(type) ?? '';
  return useMemo(() => {
    if (token && !validateJwtToken(token)) {
      signOut();
    }
    return token ? getSecureApi(token, baseUrl) : getPublicAPI(baseUrl);
  }, [token, baseUrl]);
};
