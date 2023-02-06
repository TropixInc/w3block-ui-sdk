import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';
export const useGetPageModules = () => {
  const [href, setHref] = useState('');
  const axios = useAxios(W3blockAPI.COMMERCE);

  useEffect(() => {
    if (window) {
      setHref(window.location.href);
      //setHref('https://stg.primesea.io/storefront');
    }
  }, []);

  return useQuery(
    [PixwayAPIRoutes.GET_PAGE, href],
    () =>
      axios
        .get(PixwayAPIRoutes.GET_PAGE + `?url=${href}`)
        .then((data) => data.data),
    { enabled: href != undefined && href != '', refetchOnWindowFocus: false }
  );
};
