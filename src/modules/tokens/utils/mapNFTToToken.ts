import { NFTByWalletDTO } from '../hooks/useGetNFTsByWallet';
import { Token } from '../interfaces/Token';

export const mapNFTToToken = (nft: NFTByWalletDTO, chainId: number): Token => ({
  category: nft.metadata?.atributes?.length
    ? nft.metadata.atributes[0]?.trait_type
    : '',
  id: nft.id?.tokenId ?? '',
  image: nft.media?.length
    ? nft.media[0].gateway || nft.media[0].thumbnail
    : nft.metadata?.image ?? '',
  name: nft.title || '',
  contractAddress: nft.contract?.address ?? '',
  chainId,
  collectionData: nft.metadata?.collectionData || undefined,
});
