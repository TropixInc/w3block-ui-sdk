import { useEffect, useRef, useState } from 'react';

import { CreateOrderResponse } from '../../interface/interface';

interface GetStatusMutation {
  mutate: (
    variables: { companyId: string; orderId: string },
    options?: { onSuccess?: (data: CreateOrderResponse) => void }
  ) => void;
}

interface UseCheckoutStatusPollingProps {
  orderId: string;
  isCoinPayment: boolean;
  hasPassShareCode: boolean;
  companyId: string;
  getStatus: GetStatusMutation;
}

export function useCheckoutStatusPolling({
  orderId,
  isCoinPayment,
  hasPassShareCode,
  companyId,
  getStatus,
}: UseCheckoutStatusPollingProps) {
  const [poolStatus, setPoolStatus] = useState(true);
  const [countdown, setCountdown] = useState(true);
  const [statusResponse, setStatusResponse] = useState<CreateOrderResponse>();
  const [codeQr, setCodeQr] = useState('');
  const [error, setError] = useState('');
  const statusPollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!poolStatus || !orderId || (!isCoinPayment && !hasPassShareCode)) {
      return;
    }

    statusPollingIntervalRef.current = setInterval(() => {
      getStatus.mutate(
        { companyId, orderId },
        {
          onSuccess: (data: CreateOrderResponse) => {
            if (isCoinPayment) {
              if (data.status === 'pending' && countdown) {
                setCountdown(false);
              } else if (data.status === 'failed') {
                setCountdown(false);
                if (statusPollingIntervalRef.current) {
                  clearInterval(statusPollingIntervalRef.current);
                  statusPollingIntervalRef.current = null;
                }
                setPoolStatus(false);
                setStatusResponse(data);
                setError(data?.failReason ?? '');
              } else if (
                data.status === 'concluded' ||
                data.status === 'delivering'
              ) {
                if (statusPollingIntervalRef.current) {
                  clearInterval(statusPollingIntervalRef.current);
                  statusPollingIntervalRef.current = null;
                }
                setPoolStatus(false);
                setStatusResponse(data);
                setCodeQr(`${window?.location?.origin}/order/${data.deliverId}`);
              }
            } else if (data?.passShareCodeInfo?.status === 'generated') {
              if (statusPollingIntervalRef.current) {
                clearInterval(statusPollingIntervalRef.current);
                statusPollingIntervalRef.current = null;
              }
              setPoolStatus(false);
              setStatusResponse(data);
            }
          },
        }
      );
    }, 3000);

    return () => {
      if (statusPollingIntervalRef.current) {
        clearInterval(statusPollingIntervalRef.current);
        statusPollingIntervalRef.current = null;
      }
    };
  }, [poolStatus, orderId, isCoinPayment, hasPassShareCode, companyId, countdown, getStatus]);

  return { statusResponse, codeQr, error };
}
