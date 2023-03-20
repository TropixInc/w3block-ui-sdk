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
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  rules: string;
  type: TokenPassBenefitType;
  useLimit: number;
  eventStartsAt: string;
  eventEndsAt?: string;
  checkInStartsAt?: string;
  checkInEndsAt?: string;
  linkUrl: string;
  tokenPass: TokenPassEntity;
  tokenPassId: string;
  status: BenefitStatus;
  tokenPassBenefitAddresses?: BenefitAddress[];
}

export interface BenefitsByEditionNumberDTO {
  checkInEndsAt: string;
  checkInStartsAt: string;
  createdAt: string;
  description: string;
  dynamicQrCode: boolean;
  eventEndsAt: string;
  eventStartsAt: string;
  id: string;
  linkRules: string;
  linkUrl: string;
  name: string;
  rules: string;
  status: BenefitStatus;
  statusMessage: string;
  tokenPass: TokenPassEntity;
  tokenPassBenefitUsage: TokenPassBenefitUsesDTO;
  tokenPassBenefitAddresses?: BenefitAddress[];
  type: TokenPassBenefitType;
  updatedAt: string;
  useAvailable: number;
  useLimit: number;
  tokenPassId: string;
}

interface TokenPassBenefitUsesDTO {
  createdAt: string;
  editionNumber: number;
  id: string;
  tokenPassBenefitId: string;
  updatedAt: string;
  uses: number;
}

export enum TokenPassBenefitType {
  DIGITAL = 'digital',
  PHYSICAL = 'physical',
}

export interface TokenPassEntity {
  id: string;
  tokenName: string;
  tenantId: string;
  contractAddress: string;
  chainId: string;
  name: string;
  description: string;
  rules: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  tokenPassBenefits: TokenPassBenefits[];
}

export interface TokenPassBenefits {
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
  linkRules: string;
  dynamicQrCode: boolean;
  tokenPassId: string;
  tokenPassBenefitAddresses: BenefitAddress[];
  tokenPassBenefitOperators: tokenPassBenefitOperators[];
}

interface tokenPassBenefitOperators {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tokenPassBenefitId: string;
}
