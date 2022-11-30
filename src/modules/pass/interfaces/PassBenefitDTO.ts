import { ChainScan } from '../../shared/enums/ChainId';

export interface PassBenefitDTO {
  id: string;
  name: string;
  description: string;
  rules: string;
  type: TokenPassBenefitType;
  useLimit: number;
  eventStartsAt: string;
  eventEndsAt: string;
  linkUrl: string;
  tokenPass: TokenPassEntity;
  tokenPassId: string;
  createdAt: string;
  updatedAt: string;
}

export enum TokenPassBenefitType {
  DIGITAL = 'digital',
  PHYSICAL = 'physical',
}

export interface TokenPassEntity {
  id: string;
  tokenName: string;
  contractAddress: string;
  chainId: ChainScan;
  name: string;
  description: string;
  rules: string;
  imageUrl: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  collectionId: string;
}
