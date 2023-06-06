export interface MetadataApiInterface<T> {
  id: string;
  createdAt: string;
  updatedAt: string;
  editionNumber: number;
  tokenCollectionId: string;
  companyId: string;
  contractId: string;
  rfid: string;
  status: string;
  contractAddress: string;
  ownerAddress: string;
  chainId: number;
  tokenId: number;
  mintedHash: string;
  mintedAt: string;
  nftMintingId: string;
  name: string;
  description: string;
  mainImage: string;
  tokenData: T;
  errorFields: any;
  tokenCollection: TokenCollection<any>;
  contract: any;
  mintedAddress: string;
}

export interface TokenCollection<T> {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  mainImage: string;
  companyId: string;
  contractId: string;
  subcategoryId: string;
  tokenData: T;
  publishedTokenTemplate: any;
  quantity: number;
  initialQuantityToMint: number;
  rangeInitialToMint: string;
  quantityMinted: number;
  rfids: string[];
  ownerAddress: string;
  similarTokens: boolean;
  pass: false;
}
