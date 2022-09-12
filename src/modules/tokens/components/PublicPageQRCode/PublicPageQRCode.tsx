import { QRCodeSVG } from 'qrcode.react';

import { usePixwayAPIURL } from '../../../shared/hooks/usePixwayAPIURL/usePixwayAPIURL';
import { getPublicTokenPageURL } from '../../utils/getPublicTokenPageURL';

interface Props {
  rfid?: string;
  contractAddress?: string;
  tokenId?: string;
  chainId?: number;
  size?: number;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export const PublicPageQRCode = ({
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
  const apisUrl = usePixwayAPIURL();
  const link = `${apisUrl.w3blockIdBaseUrl}${publicPagePath}`;

  return (
    <div ref={containerRef}>
      <QRCodeSVG value={link} size={size} level="H" />
    </div>
  );
};
