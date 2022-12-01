import { ChainScan } from '../../shared/enums/ChainId';

export interface PassBenefitOperatorsDTO {
  userId: string;
  tokenPassBenefit: TokenPassBenefitEntity;
  tokenPassBenefitId: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface TokenPassBenefitEntity {
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
  id: string;
  createdAt: string;
  updatedAt: string;
}

export enum TokenPassBenefitType {
  DIGITAL = 'digital',
  PHYSICAL = 'physical',
}

export interface TokenPassEntity {
  tokenName: string;
  contractAddress: string;
  chainId: ChainScan;
  name: string;
  description: string;
  rules: string;
  imageUrl: string;
  tenantId: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PassBenefitOperatorsByBenefitIdDTO {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tokenPassBenefitId: string;
  tokenPassBenefit: {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    description: string;
    rules: string;
    type: TokenPassBenefitType;
    useLimit: number;
    eventStartsAt: string;
    eventEndsAt: string;
    checkInStartsAt: string;
    checkInEndsAt: string;
    linkUrl: string;
    dynamicQrCode: false;
    tokenPassId: string;
    tokenPass: TokenPassEntity;
  };
  associatedTokens: [
    {
      id: string;
      imageUrl: string;
      tokenName: string;
    }
  ];
  name: string;
  email: string;
  walletAddress: string;
}
