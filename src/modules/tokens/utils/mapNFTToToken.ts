import { NFTByWalletDTO } from '../hooks/useGetNFTsByWallet';
import { Token } from '../interfaces/Token';

export const mapNFTToToken = (nft: NFTByWalletDTO, chainId: number): Token => ({
  category: nft.metadata.atributes?.length
    ? nft.metadata.atributes[0].trait_tyoe
    : '',
  id: nft.id?.tokenId ?? '',
  image: nft.media.length ? nft.media[0].thumbnail || nft.media[0].gateway : '',
  name: nft.title,
  contractAddress: nft.contract?.address ?? '',
  chainId,
});
