import { SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react';

import { ErrorMessage } from '../../../shared';
import { ReactComponent as Loading } from '../../../shared/assets/icons/loading.svg';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyId } from '../../../shared/hooks/useCompanyId';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage/useLocalStorage';
import { usePixwayAPIURL } from '../../../shared/hooks/usePixwayAPIURL/usePixwayAPIURL';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { useQuery } from '../../../shared/hooks/useQuery';
import useRouter from '../../../shared/hooks/useRouter';
import useTranslation from '../../../shared/hooks/useTranslation';
import { createOrderApi } from '../../api/createOrder';
import { CreateOrder } from '../../api/createOrder/interface';
import { PRODUCT_CART_INFO_KEY } from '../../config/keys/localStorageKey';

export const CheckoutPayment = () => {
  const iframeRef = useRef(null);
  const router = useRouter();
  const query = useQuery();
  const [_, setOrderInfos] = useState<CreateOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [translate] = useTranslation();
  const shouldLock = useRef(true);
  const [sending, setSending] = useState<boolean>(false);
  const baseUrl = usePixwayAPIURL();
  const companyId = useCompanyId();
  const [iframeLink, setIframeLink] = useState('');
  const { getItem } = useLocalStorage();
  const { data: session } = usePixwaySession();

  useEffect(() => {
    if (shouldLock.current) {
      shouldLock.current = false;
      createOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createOrder = () => {
    setLoading(true);
    const orderInfo = getItem<CreateOrder>(PRODUCT_CART_INFO_KEY);
    setOrderInfos(orderInfo);
    if (orderInfo && !iframeLink && !sending && session) {
      setSending(true);
      createOrderApi(baseUrl, session.accessToken as string, companyId, {
        ...orderInfo,
        successUrl:
          'http://localhost:3000' +
          PixwayAppRoutes.CHECKOUT_PAYMENT +
          '?' +
          query,
      }).then((res) => {
        setLoading(false);
        if (res) {
          setIframeLink(res.paymentInfo.paymentUrl);
          setSending(false);
        }
      });
    }
  };

  const IframeItem = useMemo(() => {
    return iframeLink ? (
      <iframe
        onLoad={(e: SyntheticEvent<HTMLIFrameElement>) => {
          if (
            e.currentTarget.contentWindow?.location.hostname ===
            window?.location.hostname
          ) {
            router.push(PixwayAppRoutes.CHECKOUT_PROCESSING + query);
          }
        }}
        ref={iframeRef}
        className="pw-w-full pw-min-h-screen"
        src={iframeLink}
      />
    ) : loading ? (
      <div className="pw-h-screen pw-flex pw-items-center pw-justify-center">
        <Loading className="pw-animate-spin -pw-mt-24 pw-h-15 pw-w-15" />
      </div>
    ) : (
      <div className="pw-h-screen pw-flex pw-items-center pw-justify-center">
        <ErrorMessage
          className="-pw-mt-24"
          message={translate('checkout>components>warning>problemWithCheckout')}
        />
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iframeLink, loading]);

  return <div className="">{IframeItem}</div>;
};
