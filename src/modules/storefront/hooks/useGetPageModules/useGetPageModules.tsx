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
      if (!window.location.href.includes('/product/slug')) {
        //setHref('https://stg.primesea.io/storefront');
        setHref(window.location.href);
      }
    }
  }, []);

  return useQuery(
    [PixwayAPIRoutes.GET_PAGE, href],
    () =>
      axios
        .get(PixwayAPIRoutes.GET_PAGE + `?url=${href}`)
        .then((data) => data.data),
    {
      enabled:
        href != undefined && href != '' && !href.includes('/product/slug'),
      refetchOnWindowFocus: false,
    }
  );
};
