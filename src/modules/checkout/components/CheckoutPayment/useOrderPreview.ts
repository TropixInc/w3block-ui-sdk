import { useEffect, useState } from 'react';
import { useInterval } from 'react-use';

import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useCheckout } from '../../hooks/useCheckout';
import { OrderPreviewCache, OrderPreviewResponse } from '../../interface/interface';
import { ORDER_PREVIEW_POLL_INTERVAL_MS } from './constants';

interface UseOrderPreviewParams {
  productCache: OrderPreviewCache | undefined;
  onPreviewUpdate: (data: OrderPreviewResponse) => void;
}

export function useOrderPreview({
  productCache,
  onPreviewUpdate,
}: UseOrderPreviewParams) {
  const { getOrderPreview } = useCheckout();
  const { companyId } = useCompanyConfig();
  const [myOrderPreview, setMyOrderPreview] =
    useState<OrderPreviewResponse | null>();
  const [isPolling, setIsPolling] = useState(true);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  const fetchPreview = () => {
    if (!productCache || !isPolling) return;

    getOrderPreview.mutate(
      {
        productIds: productCache.orderProducts.map((p) =>
          p?.productTokenId
            ? {
                productId: p.productId,
                productTokenId: p.productTokenId ?? '',
                variantIds: p.variantIds,
                quantity: p.quantity,
                selectBestPrice: p.selectBestPrice,
              }
            : {
                productId: p.productId,
                variantIds: p.variantIds,
                quantity: p.quantity,
                selectBestPrice: p.selectBestPrice,
              }
        ),
        payments: [
          {
            currencyId: productCache.currencyId,
            amountType: 'percentage',
            amount: '100',
            paymentMethod: productCache?.choosedPayment?.paymentMethod,
          },
        ],
        currencyId: productCache.currencyId,
        companyId,
        couponCode: productCache.couponCode,
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess(data: any) {
          onPreviewUpdate(data);
          setMyOrderPreview(data);
        },
      }
    );
  };

  useEffect(() => {
    if (productCache && isPolling && !initialFetchDone) {
      fetchPreview();
      setInitialFetchDone(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCache]);

  useInterval(
    () => {
      if (isPolling) fetchPreview();
    },
    ORDER_PREVIEW_POLL_INTERVAL_MS
  );

  return {
    myOrderPreview,
    stopPolling: () => setIsPolling(false),
  };
}
