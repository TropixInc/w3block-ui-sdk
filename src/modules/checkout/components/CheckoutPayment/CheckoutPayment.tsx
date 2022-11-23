import { SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalStorage } from 'react-use';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { ErrorMessage, useProfile } from '../../../shared';
import { ReactComponent as Loading } from '../../../shared/assets/icons/loading.svg';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';
import { PRODUCT_CART_INFO_KEY } from '../../config/keys/localStorageKey';
import { PaymentMethod } from '../../enum';
import { useCheckout } from '../../hooks/useCheckout';
import { OrderPreviewCache } from '../../interface/interface';
import { CheckoutStripeForm } from '../CheckoutStripeForm/CheckoutStripeForm';

export const CheckoutPayment = () => {
  const { createOrder: createOrderHook } = useCheckout();
  const [isStripe, setIsStripe] = useState('');
  const [stripeKey, setStripeKey] = useState('');
  const iframeRef = useRef(null);
  const router = useRouterConnect();
  const [loading, setLoading] = useState<boolean>(true);
  const [translate] = useTranslation();
  const shouldLock = useRef(true);
  const profile = useProfile();
  const [sending, setSending] = useState<boolean>(false);
  const { companyId, appBaseUrl } = useCompanyConfig();
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
            orderProducts: orderInfo.orderProducts,
            signedGasFee: orderInfo.signedGasFee,
            currencyId: orderInfo.currencyId,
            destinationWalletAddress:
              profile.data?.data.mainWallet?.address ?? '',
            successUrl:
              appBaseUrl +
              PixwayAppRoutes.CHECKOUT_COMPLETED +
              '?' +
              query.split('?')[0],
          },
        },
        {
          onSuccess: (data) => {
            setLoading(false);
            if (data.paymentProvider == PaymentMethod.STRIPE) {
              setIsStripe(data.paymentInfo.clientSecret ?? '');
              setStripeKey(data.paymentInfo.publicKey ?? '');
            } else {
              setIframeLink(data.paymentInfo.paymentUrl ?? '');
            }
            setSending(false);
          },
        }
      );
    }
  };

  const stripePromise = useMemo(() => {
    if (isStripe != '' && stripeKey != '') {
      return loadStripe(stripeKey);
    } else return null;
  }, [isStripe, stripeKey]);

  const WichPaymentMethod = () => {
    if (iframeLink) {
      return (
        <iframe
          onLoad={(e: SyntheticEvent<HTMLIFrameElement>) => {
            if (
              e.currentTarget.contentWindow?.location.hostname ===
              window?.location.hostname
            ) {
              router.pushConnect(PixwayAppRoutes.CHECKOUT_COMPLETED + query);
            }
          }}
          ref={iframeRef}
          className="pw-w-full pw-min-h-screen"
          src={iframeLink}
        />
      );
    } else if (isStripe && stripePromise) {
      return (
        <div>
          <Elements stripe={stripePromise} options={{ clientSecret: isStripe }}>
            <CheckoutStripeForm />
          </Elements>
        </div>
      );
    } else if (loading) {
      return (
        <div className="pw-h-screen pw-flex pw-items-center pw-justify-center">
          <Loading className="pw-animate-spin -pw-mt-24 pw-h-15 pw-w-15" />
        </div>
      );
    } else {
      return (
        <div className="pw-h-screen pw-flex pw-items-center pw-justify-center">
          <ErrorMessage
            className="-pw-mt-24"
            message={translate(
              'checkout>components>warning>problemWithCheckout'
            )}
          />
        </div>
      );
    }
  };

  return <div className="">{WichPaymentMethod()}</div>;
};
