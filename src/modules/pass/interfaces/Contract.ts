import { ChainScan } from '../../shared/enums/ChainId';
import { contractStatus } from '../../shared/enums/contractStatus';

import { ContractFeature } from '../enums/ContractFeature';

interface OperatorContract {
  address: string;
  role: string;
}

export interface ParticipantsContract {
  name: string;
  payee: string;
  share: number;
  color?: string;
}

interface RoyaltContract {
  address: string;
  chainId: number;
  companyId: string;
  createdAt: string;
  fee: number;
  id: string;
  status: string;
  updatedAt: string;
  platform?: ParticipantsContract;
  blockchain: Array<ParticipantsContract>;
  participants: Array<ParticipantsContract>;
}

interface Metadata {
  confirmedAt: string;
  nftAddress: string;
  royaltyAddress: string;
  royaltyIsContract: boolean;
}

export interface Contract {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  chainAddress: string;
  address: string;
  chainId: number;
  name: string;
  description?: string;
  externalLink?: string;
  image?: string;
  operators?: Array<OperatorContract>;
  royalty?: RoyaltContract;
  royaltyId?: string;
  symbol?: string;
  features: Array<ContractFeature>;
  status: contractStatus;
  contractAction?: {
    sender?: string;
    metadata?: Metadata;
    chainId: ChainScan;
    companyId: string;
    createdAt: string;
    executeAt: string;
    id: string;
    status: string;
    txHash: string | null;
    txId: string | null;
    type: string;
    updatedAt: string;
  };
}
