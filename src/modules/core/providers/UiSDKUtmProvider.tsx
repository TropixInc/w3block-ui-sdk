import { ReactNode, useEffect } from 'react';
import { useCookie } from 'react-use';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import { UtmContext } from '../../context/UtmContext';




export const UiSDKUtmProvider = ({
  children,
  expiration,
}: {
  children: ReactNode;
  expiration?: number;
}) => {
  const [utm, setUtm] = useCookie('utm');
  const router = useRouterConnect();
  useEffect(() => {
    try {
      if (router.query.utm_source && router.query.utm_campaign) {
        const newUtm = {
          utm_source: router.query.utm_source as string,
          utm_medium: router.query.utm_medium as string,
          utm_campaign: router.query.utm_campaign as string,
          utm_term: router.query.utm_term as string,
          utm_content: router.query.utm_content as string,
          expires:
            new Date().getTime() + (expiration ? expiration : 1000 * 60 * 60),
        };
        setUtm(JSON.stringify(newUtm), {
          expires:
            new Date().getTime() + (expiration ? expiration : 1000 * 60 * 60),
        });
      }
    } catch (err) {
      console.log('error saving utm: ', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  useEffect(() => {
    if (utm) {
      console.log('utm saved: ', utm);
    }
  }, [utm]);

  return (
    <UtmContext.Provider value={JSON.parse(utm ?? '{}')}>
      {children}
    </UtmContext.Provider>
  );
};
