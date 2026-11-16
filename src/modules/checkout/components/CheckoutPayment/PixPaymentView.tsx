import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import { QRCodeSVG } from 'qrcode.react';

import CopyIcon from '../../../shared/assets/icons/copyIcon.svg';
import { Alert } from '../../../shared/components/Alert';
import { useIsMobile } from '../../../shared/hooks/useIsMobile';
import useTranslation from '../../../shared/hooks/useTranslation';

interface PixPaymentViewProps {
  pixImage?: string;
  pixPayload?: string;
  errorPix: string;
  countdown: {
    minutes: number;
    seconds: number;
    isActive: boolean;
  };
}

export const PixPaymentView = ({
  pixImage,
  pixPayload,
  errorPix,
  countdown,
}: PixPaymentViewProps) => {
  const [translate] = useTranslation();
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);
  const [, copyClp] = useCopyToClipboard();

  if (errorPix !== '') {
    return (
      <div className="pw-bg-white pw-p-4 sm:pw-p-6 pw-flex pw-justify-center pw-items-center pw-shadow-brand-shadow pw-rounded-lg">
        <div className="pw-flex pw-justify-center pw-items-center pw-h-full">
          <div className="pw-max-w-[600px] pw-flex pw-flex-col pw-items-center pw-justify-center pw-mt-10 sm:pw-mt-15 sm:pw-mb-15 pw-mb-10 pw-px-4">
            <Alert variant="error" className="!pw-gap-3">
              <Alert.Icon />
              {errorPix}
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pw-bg-white pw-p-4 sm:pw-p-6 pw-flex pw-justify-center pw-items-center pw-shadow-brand-shadow pw-rounded-lg">
      <div className="pw-flex pw-justify-center pw-items-center pw-h-full">
        <div className="pw-max-w-[600px] pw-flex pw-flex-col pw-items-center pw-justify-center pw-mt-10 sm:pw-mt-15 sm:pw-mb-15 pw-mb-10 pw-px-4">
          <p className="pw-text-center pw-max-w-[450px] pw-text-slate-500 pw-text-sm pw-font-[500] pw-mx-auto pw-mt-4">
            {translate('checkout>checkoutPayment>deliveryItemsExplain')}
          </p>
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
          <p className="pw-text-center pw-font-normal pw-text-black pw-mt-6">
            {translate('checkout>checkoutPayment>scanCode')}
          </p>
          {pixImage ? (
            <img src={`data:image/png;base64, ${pixImage}`} />
          ) : (
            <QRCodeSVG
              value={String(pixPayload)}
              size={300}
              className="pw-my-6"
            />
          )}
          {pixPayload && (
            <>
              <p className="pw-text-center pw-text-xs pw-text-slate-600">
                {translate('checkout>checkoutPayment>copyCode')}
              </p>
              <p
                onClick={() => {
                  setCopied(true);
                  copyClp(pixPayload);
                }}
                className="pw-flex pw-gap-2 pw-text-center pw-text-brand-primary pw-text-xs pw-cursor-pointer pw-px-6 pw-mb-8 hover:pw-font-[900] pw-break-all"
              >
                {pixPayload}
                <CopyIcon
                  width={isMobile ? 60 : 35}
                  height={isMobile ? 60 : 35}
                />
              </p>
              {copied && (
                <Alert variant="success" className="!pw-gap-3">
                  <Alert.Icon />
                  {translate('checkout>checkoutPayment>codeCopied')}
                </Alert>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
