import { SyntheticEvent } from 'react';

import { Alert } from '../../../shared/components/Alert';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';

interface IframePaymentViewProps {
  iframeLink: string;
  paymentMethod?: string;
  errorPix: string;
  countdown: {
    minutes: number;
    seconds: number;
    isActive: boolean;
  };
}

export const IframePaymentView = ({
  iframeLink,
  paymentMethod,
  errorPix,
  countdown,
}: IframePaymentViewProps) => {
  const router = useRouterConnect();
  const [translate] = useTranslation();

  if (paymentMethod === 'pix' && errorPix !== '') {
    return (
      <Alert variant="error" className="!pw-gap-3">
        <Alert.Icon />
        {errorPix}
      </Alert>
    );
  }

  return (
    <>
      {paymentMethod === 'pix' && (
        <p className="pw-text-center pw-max-w-[450px] pw-text-sm pw-mx-auto pw-mt-4">
          {translate('checkout>checkoutPayment>deliveryItemsExplain')}
        </p>
      )}
      <iframe
        onLoad={(e: SyntheticEvent<HTMLIFrameElement>) => {
          if (
            e.currentTarget.contentWindow?.location.hostname ===
            window?.location.hostname
          ) {
            router.pushConnect(
              PixwayAppRoutes.CHECKOUT_COMPLETED,
              router.query
            );
          }
        }}
        className="pw-w-full pw-min-h-screen"
        src={iframeLink}
      />
      {countdown.isActive && (
        <div className="pw-flex pw-gap-2 pw-text-black pw-font-bold pw-mt-6">
          <p>
            {translate('checkout>checkoutPayment>purchaseExpireOn')}:
          </p>
          {countdown.minutes}:
          {countdown.seconds < 10
            ? '0' + countdown.seconds
            : countdown.seconds}
        </div>
      )}
    </>
  );
};
