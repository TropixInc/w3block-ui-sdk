/* eslint-disable prettier/prettier */
import { useCallback, useEffect, useRef, useState } from 'react';

import  CopyIcon  from '../../shared/assets/icons/copy.svg';
import  DownloadIcon  from '../../shared/assets/icons/download.svg';
import  FrameTopLeftBorder  from '../../shared/assets/icons/frameTopLeftBorderFilled.svg';
import  ScanMePlate  from '../../shared/assets/icons/scanMePlate.svg';

import { ModalBase } from '../../shared/components/ModalBase';
import { useTimedBoolean } from '../../shared/hooks/useTimedBoolean';
import useTruncate from '../hooks/useTruncate';
import { PublicPageQRCode } from './PublicPageQRCode';
import { BaseButton } from '../../shared/components/Buttons';
import useTranslation from '../../shared/hooks/useTranslation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedEdition?: number;
  totalEditions?: number;
  contractAddress?: string;
  chainId?: number;
  tokenId?: string;
  rfid?: string;
  collectionTitle?: string;
  editionId?: string;
}
interface Dimensions {
  width: number;
  height: number;
}

export const QRCodeModal = ({
  isOpen,
  onClose,
  selectedEdition,
  totalEditions,
  rfid,
  contractAddress,
  chainId,
  tokenId,
  collectionTitle,
  editionId,
}: Props) => {
  const [translate] = useTranslation();
  const truncate = useTruncate();
  const [copied, setCopied] = useTimedBoolean(1000);
  const QRCodeContainerRef = useRef<HTMLDivElement>(null);


  const [windowDimensions, setWindowDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  const handleResize = useCallback(() => {
    if (typeof window !== 'undefined') {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  useEffect(() => {
    handleResize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = () => {
    if (QRCodeContainerRef.current) {
      const svg = QRCodeContainerRef.current.children[0];
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      canvas.width = 234;
      canvas.height = 234;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      img.onload = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 234, 234);
        ctx.drawImage(img, 5, 5, 224, 224);
        const canvasData = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = canvasData;
        a.download = 'qrCode.png';
        a.click();
      };
    }
  };

  const handleCopy = () => {
    if (QRCodeContainerRef.current) {
      const svg = QRCodeContainerRef.current.children[0];
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      canvas.width = 234;
      canvas.height = 234;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      img.onload = async () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 234, 234);
        ctx.drawImage(img, 5, 5, 224, 224);

        canvas.toBlob(function (blob) {
          if (blob) {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]);
            setCopied();
          }
        });
      };
    }
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      classes={{
        dialogCard: "pw-w-full pw-max-w-[460px] pw-p-[30px_28px] lg:pw-p-[42px_40px_53px]",
      }}
    >

      <h2 className="pw-font-semibold pw-text-2xl pw-leading-7 pw-mb-2">
        {truncate(collectionTitle ?? '', { maxCharacters: 26 })}
      </h2>
      <p className="pw-font-semibold pw-leading-[19px] pw-text-[#333333] pw-mb-[30px] lg:pw-mb-10" >
        {translate('wallet>tokenQRCodeModal>selectedEdition', {
          selectedEdition,
          totalEditions,
        })}
      </p>

      <div className="pw-flex pw-justify-center">
        <div className="pw-flex pw-items-center pw-flex-col pw-gap-y-[16px] sm:pw-gap-y-[22px]" >
          <div className="pw-relative">
            <ScanMePlate className="pw-fill-[#5682C3] pw-w-[120px] pw-h-[49px] sm:pw-w-[171.9px] sm:pw-h-[70.14px]" />
            <span
              className="pw-absolute pw-bg-[#FFFF] pw-left-[44.91px] pw-top-[11.28px] pw-w-[7px] pw-h-[9.95px] sm:pw-left-[63.91px] sm:pw-top-[17.28px] sm:pw-w-[9.11px] sm:pw-h-[12.95px]"
              style={{
                clipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
              }}
            />
          </div>
          <div className="pw-p-6 pw-relative">
            <FrameTopLeftBorder className="pw-fill-black pw-absolute pw-left-0 pw-top-0 pw-w-[35px] pw-h-[37px]" />
            <FrameTopLeftBorder className="pw-fill-black pw-absolute pw-right-0 pw-top-0 pw-rotate-90 pw-w-[35px] pw-h-[37px]" />
            <FrameTopLeftBorder className="pw-fill-black pw-absolute pw-left-0 pw-bottom-0 pw-rotate-[270deg] pw-w-[35px] pw-h-[37px]" />
            <FrameTopLeftBorder className="pw-fill-black pw-absolute pw-right-0 pw-bottom-0 pw-rotate-180 w-[35px] pw-h-[37px]" />
            <PublicPageQRCode
              size={windowDimensions.height < 768 ? 150 : 224}
              contractAddress={contractAddress}
              chainId={chainId}
              tokenId={tokenId}
              rfid={rfid}
              containerRef={QRCodeContainerRef}
            />
          </div>
        </div>
      </div>

      {editionId ? (
        <div className="pw-text-[#333333] pw-text-[13px] pw-leading-[15px] pw-text-center pw-flex pw-flex-col pw-mt-[16px] sm:pw-mt-[24px]">
          <span className="pw-font-semibold">{translate('tokens>qrCodeModal>identifier')}</span>
          <span className="pw-text-sm">{editionId}</span>
        </div>
      ) : null}

      <div className={'pw-flex pw-justify-between pw-mt-[30px] sm:pw-mt-[30px] lg:pw-mt-[42px]'} >
        <BaseButton
          className="pw-text-sm pw-leading-4 pw-py-0 pw-h-[40px] pw-px-[16px] pw-flex pw-items-center pw-justify-center"
          onClick={handleDownload}
          variant="outlined"
        >
          {translate("wallet>tokenQRCodeModal>saveCode")}
          <DownloadIcon className="pw-ml-[8px] pw-w-[23px] pw-fill-current pw-shrink-0" />
        </BaseButton>

        <BaseButton
          className="pw-text-sm pw-leading-4 pw-py-0 pw-h-[40px] pw-px-[16px] pw-flex pw-items-center pw-justify-center pw-min-w-[169px]"
          onClick={handleCopy}
          variant="outlined"
        >
          {copied ? (
            translate('components>menu>copied')
          ) : (
            <>
              {translate("wallet>tokenQRCodeModal>copyCode")}
              <CopyIcon className="pw-ml-[8px] pw-w-[19px] pw-fill-current pw-shrink-0" />
            </>
          )}
        </BaseButton>
      </div>
    </ModalBase>
  );
};
