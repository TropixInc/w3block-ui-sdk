import { PixwayAPIRoutes } from "../../shared/enums/PixwayAPIRoutes";
interface Config {
  tokenId?: string;
  contractAddress?: string;
  chainId?: string;
  rfid?: string;
}

export const getPublicTokenDataQueryKey = (config: Config = {}) => {
  const { rfid, tokenId, chainId, contractAddress } = config;
  return rfid
    ? [PixwayAPIRoutes.METADATA_BY_RFID, rfid]
    : [
        PixwayAPIRoutes.METADATA_BY_CHAINADDRESS_AND_TOKENID,
        chainId,
        contractAddress,
        tokenId,
      ];
};
