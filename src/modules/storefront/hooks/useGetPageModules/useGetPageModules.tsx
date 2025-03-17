import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect/useRouterConnect';
import { getProductSlug } from '../../utils/getProductSlug';
export const useGetPageModules = (disabled = false) => {
  const { status } = usePixwaySession();
  const [href, setHref] = useState('');
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { query } = useRouterConnect();
  const [productSlug, setProductSlug] = useState('');

  useEffect(() => {
    if (window) {
      setProductSlug(
        getProductSlug(window ? window?.location?.href : '') ?? ''
      );
    }
  }, []);

  useEffect(() => {
    if (window) {
      if (!productSlug) {
        setHref('https://foodbusters.stg.w3block.io/' + '?' + Date.now());
        //setHref('https://hashdex.stg.w3block.io/'+ '?' + Date.now());
        //setHref(window.location.href);
      }
    }
  }, [productSlug]);

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
        !productSlug &&
        !href.includes('/checkout/') &&
        status != 'loading' &&
        !query?.preview &&
        !disabled,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
};
