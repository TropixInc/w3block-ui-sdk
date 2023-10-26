import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect/useRouterConnect';
export const useGetPageModules = (disabled = false) => {
  const { status } = usePixwaySession();
  const [href, setHref] = useState('');
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { query } = useRouterConnect();
  useEffect(() => {
    if (window) {
      if (!window.location.href.includes('/product/slug')) {
        // setHref(
        //   'https://foodbusters.stg.w3block.io/athlete/123/teste' +
        //     '?' +
        //     Date.now()
        // );
        //setHref('https://hashdex.stg.w3block.io/'+ '?' + Date.now());
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
      retry: 0,
      enabled:
        href != undefined &&
        href != '' &&
        !href.includes('/product/slug') &&
        !href.includes('/checkout/') &&
        status != 'loading' &&
        !query?.preview &&
        !disabled,
      refetchOnWindowFocus: false,
    }
  );
};
