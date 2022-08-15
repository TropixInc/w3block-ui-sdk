import { getPublicAPI } from '../../../shared/config/api';

export interface RequestWalletBody {
  address: string;
  chainId: number;
}

interface RequestWalletResponse {
  userId: string;
  address: string;
  chainId: number;
  message: string;
  nonce: number;
}

export interface ClaimWalletBody {
  signature: string;
}

interface ClaimWalletResponse {
  companyId: string;
  ownerId: string;
  address: string;
}

export const requestWalletMetamask = async (
  token: string,
  companyId: string,
  body: RequestWalletBody
) => {
  return await getPublicAPI(token).post<RequestWalletResponse>(
    `/users/${companyId}/wallets/metamask/request`,
    body
  );
};

export const claimWalletMetamask = async (
  token: string,
  companyId: string,
  body: ClaimWalletBody
) => {
  return await getPublicAPI(token).post<ClaimWalletResponse>(
    `/users/${companyId}/wallets/metamask/claim`,
    body
  );
};

export const claimWalletVault = async (token: string, companyId: string) => {
  return await getPublicAPI(token).post<ClaimWalletResponse>(
    `/users/${companyId}/wallets/vault/claim`
  );
};
