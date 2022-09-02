import { QRCodeSVG } from 'qrcode.react';

import { getPublicTokenPageURL } from '../../../tokenization/utils/getPublicTokenPageURL';

interface Props {
  rfid?: string;
  contractAddress?: string;
  tokenId?: string;
  chainId?: number;
  size?: number;
  containerRef?: React.RefObject<HTMLDivElement>;
}

const PublicPageQRCode = ({
  rfid,
  contractAddress,
  tokenId,
  chainId,
  size = 224,
  containerRef,
}: Props) => {
  const publicPagePath = getPublicTokenPageURL({
    chainId,
    contractAddress,
    rfid,
    tokenId,
  });
  const link = `${
    process.env.NEXT_PUBLIC_APP_BASE_PATH ?? ''
  }${publicPagePath}`;

  return (
    <div ref={containerRef}>
      <QRCodeSVG value={link} size={size} level="H" />
    </div>
  );
};

export default PublicPageQRCode;
