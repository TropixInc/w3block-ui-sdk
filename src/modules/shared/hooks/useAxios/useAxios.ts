import { useMemo } from 'react';

import { getPublicAPI, getSecureApi } from '../../config/api';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { usePixwayAPIURL } from '../usePixwayAPIURL/usePixwayAPIURL';
import { useToken } from '../useToken';

export const useAxios = (type: W3blockAPI) => {
  const apisUrl = usePixwayAPIURL();
  const token = useToken();

  const apiBaseURLMap = new Map([
    [W3blockAPI.ID, apisUrl.w3blockIdAPIUrl],
    [W3blockAPI.KEY, apisUrl.w3blockKeyAPIUrl],
    [W3blockAPI.BASE, apisUrl.w3blockIdBaseUrl],
    [W3blockAPI.COMMERCE, apisUrl.w3blockCommerceAPIUrl],
  ]);
  const baseUrl = apiBaseURLMap.get(type) ?? '';

  return useMemo(() => {
    return token ? getSecureApi(token, baseUrl) : getPublicAPI(baseUrl);
  }, [token, baseUrl]);
};
