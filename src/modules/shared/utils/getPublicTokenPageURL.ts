import { PixwayAppRoutes } from '../enums/PixwayAppRoutes';

interface Config {
  chainId?: number;
  contractAddress?: string;
  rfid?: string;
  tokenId?: string;
}

export const getPublicTokenPageURL = ({
  chainId,
  contractAddress,
  rfid,
  tokenId,
}: Config) => {
  return rfid
    ? PixwayAppRoutes.TOKEN_PUBLIC_RFID.replace('{rfid}', rfid)
    : PixwayAppRoutes.TOKEN_PUBLIC.replace(
        '{contractAddress}',
        contractAddress ?? ''
      )
        .replace('{tokenId}', tokenId ?? '')
        .replace('{chainId}', chainId?.toString() ?? '');
};
