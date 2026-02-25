import { useEffect, useRef, useState } from 'react';

import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useTrack } from '../../../storefront/hooks/useTrack';
import useCountdown from '../../../shared/hooks/useCountdown';
import { useCheckout } from '../../hooks/useCheckout';
import { CreateOrderResponse, OrderPreviewCache } from '../../interface/interface';
import { PIX_STATUS_POLL_INTERVAL_MS } from './constants';
import { buildTrackPurchaseData } from './utils';

interface UsePixPollingParams {
  productCache: OrderPreviewCache | undefined;
}

export function usePixPolling({ productCache }: UsePixPollingParams) {
  const { getStatus } = useCheckout();
  const { companyId } = useCompanyConfig();
  const router = useRouterConnect();
  const track = useTrack();
  const [translate] = useTranslation();
  const { minutes, seconds, setNewCountdown, isActive } = useCountdown();

  const [orderId, setOrderId] = useState<string>();
  const [isPolling, setIsPolling] = useState(false);
  const [errorPix, setErrorPix] = useState('');
  const countdownStartedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  };

  const startPolling = (newOrderId: string) => {
    setOrderId(newOrderId);
    setIsPolling(true);
  };

  useEffect(() => {
    if (!isPolling || !orderId) return;

    intervalRef.current = setInterval(() => {
      getStatus.mutate(
        { companyId, orderId },
        {
          onSuccess: (data: CreateOrderResponse) => {
            if (data.status === 'pending' && !countdownStartedRef.current) {
              countdownStartedRef.current = true;
              setNewCountdown(new Date(data.expiresIn));
            } else if (
              ['concluded', 'delivering', 'waiting_delivery'].includes(
                data.status
              )
            ) {
              if (productCache) {
                try {
                  const trackData = buildTrackPurchaseData({
                    productCache,
                    orderData: data,
                    paymentLabel: 'Pix',
                    pricesOverride: productCache.totalPrice,
                  });
                  track('purchase', trackData);
                } catch {
                  /* tracking não-crítico */
                }
              }
              cleanup();
              setIsPolling(false);
              router.pushConnect(
                PixwayAppRoutes.CHECKOUT_COMPLETED,
                router.query
              );
            } else if (
              data.status === 'failed' ||
              data.status === 'cancelled'
            ) {
              cleanup();
              setIsPolling(false);
              setErrorPix(
                translate(
                  'checkout>checkoutPayment>unexpectedPaymentError'
                )
              );
            } else if (data.status === 'expired') {
              cleanup();
              setIsPolling(false);
              setErrorPix(
                translate('checkout>checkoutPayment>pixCodeExpired')
              );
            }
          },
        }
      );
    }, PIX_STATUS_POLL_INTERVAL_MS);

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPolling, orderId]);

  return {
    isPolling,
    errorPix,
    startPolling,
    countdown: { minutes, seconds, isActive },
  };
}
