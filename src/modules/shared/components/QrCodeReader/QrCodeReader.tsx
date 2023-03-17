import { ReactNode, useEffect, useState } from 'react';
import { useLockBodyScroll } from 'react-use';

import classNames from 'classnames';
import { Html5Qrcode } from 'html5-qrcode';
import { QrcodeSuccessCallback } from 'html5-qrcode/esm/core';
import { Html5QrcodeCameraScanConfig } from 'html5-qrcode/esm/html5-qrcode';
import { useRouter } from 'next/router';

import { ReactComponent as LoadingIcon } from '../../../shared/assets/icons/loading.svg';
import { ReactComponent as W3block } from '../../assets/images/w3blockWhite.svg';
import useTranslation from '../../hooks/useTranslation';
import { CloseButton } from '../CloseButton';

interface iProps {
  hasOpen: boolean;
  setHasOpen: () => void;
  returnValue: (i: string) => void;
  onClose: () => void;
}

export const QrCodeReader = ({
  hasOpen,
  setHasOpen,
  returnValue,
  onClose,
}: iProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [translate] = useTranslation();

  useLockBodyScroll(hasOpen);

  const isDevelopment = process.env.NEXT_PUBLIC_ENVIRONMENT === 'development';
  const router = useRouter();
  if (!isDevelopment) router.back();

  useEffect(() => {
    if (hasOpen) {
      const html5QrCode = new Html5Qrcode('reader');

      const onScanFailure = (errorMessage: string) => {
        if (!errorMessage.includes('No MultiFormat Readers')) {
          console.warn(`Code scan error = ${errorMessage}`);
        }
      };

      const config: Html5QrcodeCameraScanConfig = {
        fps: 10,
        qrbox: { width: 255, height: 255 },
      };

      const qrCodeSuccessCallback: QrcodeSuccessCallback = (decodedText) => {
        setIsLoading(true);
        html5QrCode.stop();

        setTimeout(() => {
          setIsLoading(false);
          setHasOpen();
          returnValue(decodedText);
        }, 2000);
      };

      html5QrCode.start(
        { facingMode: 'environment' },
        config,
        qrCodeSuccessCallback,
        onScanFailure
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasOpen]);

  return hasOpen ? (
    <div
      className={classNames(
        'pw-fixed pw-z-50 pw-top-0 pw-left-0 pw-w-screen pw-h-screen pw-flex pw-justify-center pw-items-center pw-font-poppins pw-bg-red-800',
        isLoading ? 'pw-bg-[#353945]' : 'pw-bg-black/90'
      )}
    >
      <div className="pw-flex pw-flex-col pw-justify-center -pw-mt-[100px] pw-items-center pw-gap-[55px] pw-text-white pw-font-bold pw-text-[18px] pw-leading-[23px] pw-text-center">
        <CloseButton onClose={onClose} />
        <W3block className="pw-w-[109px] pw-h-5" />
        <p className="">
          {translate(
            isLoading
              ? 'token>pass>qrCodeReader>scanQrCode'
              : 'token>pass>qrCodeReader>waitScan'
          )}
        </p>
        <Moldura>
          <div id="reader" className="pw-w-[255px] pw-m-1" />
        </Moldura>
        <p className="pw-w-[325px] pw-gap-1\, pw-flex pw-flex-col pw-justify-center pw-items-center">
          {isLoading ? (
            <LoadingIcon className="pw-animate-spin pw-w-[54px] pw-h-[54px]" />
          ) : (
            <></>
          )}
          {translate(
            isLoading
              ? 'token>pass>qrCodeReader>loading'
              : 'token>pass>qrCodeReader>centerQrCode'
          )}
        </p>
      </div>
    </div>
  ) : (
    <div></div>
  );
};

const Moldura = ({ children }: { children: ReactNode }) => {
  return (
    <div className="pw-p-5 pw-flex pw-flex-col">
      <div className="pw-flex pw-justify-between">
        <div className="pw-w-10 pw-h-10 pw-border-l-4 pw-border-t-4 pw-border-white" />
        <div className="pw-w-10 pw-h-10 pw-border-r-4 pw-border-t-4 pw-border-white" />
      </div>
      <div className="pw-flex pw-justify-center pw-items-center -pw-my-6 pw-mx-4">
        {children ?? <div className="pw-bg-white pw-w-full pw-h-full" />}
      </div>
      <div className="flex justify-between">
        <div className="pw-w-10 pw-h-10 pw-border-l-4 pw-border-b-4 pw-border-white" />
        <div className="pw-w-10 pw-h-10 pw-border-r-4 pw-border-b-4 pw-border-white" />
      </div>
    </div>
  );
};
