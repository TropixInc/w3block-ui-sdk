import { ChainScan } from '../../shared/enums/ChainId';
import { BenefitStatus } from '../enums/BenefitStatus';

export interface BenefitAddress {
  name: string;
  street: string;
  number: number;
  city: string;
  state: string;
  postalCode: string;
  rules: string;
}

export interface PassBenefitDTO {
  id: string;
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
  tokenPass: TokenPassEntity;
  tokenPassId: string;
  createdAt: string;
  updatedAt: string;
  status: BenefitStatus;
  tokenPassBenefitAddresses?: BenefitAddress[];
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
