import { useEffect, useMemo, useState } from 'react';

import { useUserWallet } from '../../../shared/hooks/useUserWallet/useUserWallet';
import { OrderPreviewResponse } from '../../interface/interface';

interface UseCheckoutCurrencyAllowanceProps {
  orderPreview: OrderPreviewResponse | null;
  couponCodeInput: string | undefined;
  getOrderPreviewFn: (
    couponCode?: string,
    onSuccess?: (data: OrderPreviewResponse) => void
  ) => void;
}

export function useCheckoutCurrencyAllowance({
  orderPreview,
  couponCodeInput,
  getOrderPreviewFn,
}: UseCheckoutCurrencyAllowanceProps) {
  const [poolCurrencyAllowanceStatus, setPoolCurrencyAllowanceStatus] =
    useState(false);
  const [currencyAllowanceCountdown, setCurrencyAllowanceCountdown] =
    useState(true);
  const [currencyAllowanceStatusResponse, setCurrencyAllowanceStatusResponse] =
    useState<OrderPreviewResponse>();
  const [timestamp, setTimestamp] = useState(0);
  const [resetError, setResetError] = useState(false);

  const currencyAllowanceState = useMemo(() => {
    if (currencyAllowanceStatusResponse) {
      return currencyAllowanceStatusResponse?.currencyAllowanceState;
    } else {
      return orderPreview?.currencyAllowanceState;
    }
  }, [currencyAllowanceStatusResponse, orderPreview?.currencyAllowanceState]);

  const { mainWallet: wallet } = useUserWallet();

  const canBuy = useMemo(
    () =>
      parseFloat(wallet?.balance ?? '0') <
      parseFloat(orderPreview?.totalPrice ?? '0'),
    [orderPreview?.totalPrice, wallet]
  );

  useEffect(() => {
    if (poolCurrencyAllowanceStatus) {
      validateCurrencyAllowanceStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolCurrencyAllowanceStatus]);

  const validateCurrencyAllowanceStatus = async () => {
    if (poolCurrencyAllowanceStatus) {
      const interval = setInterval(() => {
        getOrderPreviewFn(couponCodeInput, (data) => {
          if (
            Date.now() - timestamp > 30 * 1000 &&
            (data?.currencyAllowanceState === 'required' ||
              data?.currencyAllowanceState === 'processing')
          ) {
            setResetError(true);
            clearInterval(interval);
            setPoolCurrencyAllowanceStatus(false);
            setCurrencyAllowanceCountdown(false);
          } else if (
            data?.currencyAllowanceState === 'processing' &&
            currencyAllowanceCountdown
          ) {
            setCurrencyAllowanceCountdown(false);
          } else if (data?.currencyAllowanceState === 'allowed') {
            clearInterval(interval);
            setPoolCurrencyAllowanceStatus(false);
            setCurrencyAllowanceStatusResponse(data);
            setCurrencyAllowanceCountdown(false);
          }
        });
      }, 6000);
    }
  };

  return {
    poolCurrencyAllowanceStatus,
    setPoolCurrencyAllowanceStatus,
    currencyAllowanceState,
    canBuy,
    timestamp,
    setTimestamp,
    resetError,
    setResetError,
    currencyAllowanceCountdown,
  };
}
