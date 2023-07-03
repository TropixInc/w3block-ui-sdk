import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';

export const useGetTheme = () => {
  const [href, setHref] = useState('');
  const axios = useAxios(W3blockAPI.COMMERCE);

  useEffect(() => {
    if (window) {
      //setHref(window.location.href);
      //setHref('https://hashdex.stg.w3block.io/' + '?' + Date.now());
      setHref('https://foodbusters.stg.w3block.io/' + '?' + Date.now());
    }
  }, []);

  return useQuery(
    [PixwayAPIRoutes.GET_THEME, href],
    () =>
      axios
        .get(PixwayAPIRoutes.GET_THEME + `?url=${href}`)
        .then((data) => data.data),
    {
      enabled: href != undefined && href != '',
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );
};
