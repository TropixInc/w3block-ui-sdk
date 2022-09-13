import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from 'react-use';

import { ErrorMessage, useProfile } from '../../../shared';
import { ReactComponent as Loading } from '../../../shared/assets/icons/loading.svg';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import useRouter from '../../../shared/hooks/useRouter';
import useTranslation from '../../../shared/hooks/useTranslation';
import { PRODUCT_CART_INFO_KEY } from '../../config/keys/localStorageKey';
import { useCheckout } from '../../hooks/useCheckout';
import { OrderPreviewCache } from '../../interface/interface';

export const CheckoutPayment = () => {
  const { createOrder: createOrderHook } = useCheckout();
  const iframeRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [translate] = useTranslation();
  const shouldLock = useRef(true);
  const profile = useProfile();
  const [sending, setSending] = useState<boolean>(false);
  const { companyId } = useCompanyConfig();
  const [iframeLink, setIframeLink] = useState('');
  const [productCache] = useLocalStorage<OrderPreviewCache>(
    PRODUCT_CART_INFO_KEY
  );
  const { data: session } = usePixwaySession();
  const [query, setQuery] = useState('');
  useEffect(() => {
    if (shouldLock.current) {
      shouldLock.current = false;
      createOrder();
    }
    setTimeout(() => {
      setQuery(window.location.search);
    }, 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createOrder = () => {
    setLoading(true);
    const orderInfo = productCache;
    if (orderInfo && !iframeLink && !sending && session && profile) {
      setSending(true);
      createOrderHook.mutate(
        {
          companyId,
          createOrder: {
            ...orderInfo,
            destinationWalletAddress:
              profile.data?.data.mainWallet?.address ?? '',
            successUrl:
              window.location.hostname +
              PixwayAppRoutes.CHECKOUT_COMPLETED +
              '?' +
              query.split('?')[0],
          },
        },
        {
          onSuccess: (data) => {
            setLoading(false);
            setIframeLink(data.paymentInfo.paymentUrl);
            setSending(false);
          },
        }
      );
    }
  };

  return (
    <div className="">
      {iframeLink ? (
        <iframe
          onLoad={(e: SyntheticEvent<HTMLIFrameElement>) => {
            if (
              e.currentTarget.contentWindow?.location.hostname ===
              window?.location.hostname
            ) {
              router.push(PixwayAppRoutes.CHECKOUT_COMPLETED + query);
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
            message={translate(
              'checkout>components>warning>problemWithCheckout'
            )}
          />
        </div>
      )}
    </div>
  );
};
