import { useMemo } from 'react';

import { getPublicAPI, getSecureApi } from '../../config/api';
import { usePixwayAPIURL } from '../usePixwayAPIURL/usePixwayAPIURL';
import { useToken } from '../useToken';

const useAxios = () => {
  const baseUrl = usePixwayAPIURL();
  const token = useToken();
  const axios = useMemo(() => {
    return token ? getSecureApi(token, baseUrl) : getPublicAPI(baseUrl);
  }, [token, baseUrl]);
  return axios;
};
export default useAxios;
