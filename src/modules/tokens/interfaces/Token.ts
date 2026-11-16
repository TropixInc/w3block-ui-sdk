export interface Token {
  category: string;
  image: string;
  name: string;
  id: string;
  contractAddress: string;
  chainId: number;
  collectionData: {
    id: string;
    name: string;
    pass: boolean;
  };
  editionId: string;
  editionNumber: number
}
