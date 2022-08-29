import { W3blockIdSDK } from '@w3block/sdk-id';
import { AxiosError } from 'axios';

export interface RequestWalletBody {
  address: string;
  chainId: number;
}

export interface ClaimWalletBody {
  signature: string;
}

export const requestWalletMetamask = async (
  token: string,
  companyId: string,
  baseURL: string,
  body: RequestWalletBody
) => {
  try {
    const sdk = new W3blockIdSDK({
      autoRefresh: false,
      baseURL,
    });

    return await sdk.api.users.requestMetamask(companyId, body);
  } catch (error: any) {
    if (error.isAxiosError) {
      const axiosError = error as AxiosError;
      return { data: axiosError.response?.data };
    } else {
      return error;
    }
  }
};

export const claimWalletMetamask = async (
  token: string,
  companyId: string,
  baseURL: string,
  body: ClaimWalletBody
) => {
  try {
    const sdk = new W3blockIdSDK({
      autoRefresh: false,
      baseURL,
    });

    return await sdk.api.users.claimMetamask(companyId, body);
  } catch (error: any) {
    if (error.isAxiosError) {
      const axiosError = error as AxiosError;
      return { data: axiosError.response?.data };
    } else {
      return error;
    }
  }
};

export const claimWalletVault = async (
  token: string,
  companyId: string,
  baseURL: string
) => {
  try {
    const sdk = new W3blockIdSDK({
      autoRefresh: false,
      baseURL,
    });

    return await sdk.api.users.createVault(companyId);
  } catch (error: any) {
    if (error.isAxiosError) {
      const axiosError = error as AxiosError;
      return { data: axiosError.response?.data };
    } else {
      return error;
    }
  }
};

export const claimWallet = async (
  token: string,
  companyId: string,
  baseURL: string,
  userId: string
) => {
  try {
    const sdk = new W3blockIdSDK({
      autoRefresh: false,
      baseURL,
    });

    return await sdk.api.users.findAllWalletByUserId(userId, companyId);
  } catch (error: any) {
    if (error.isAxiosError) {
      const axiosError = error as AxiosError;
      return { data: axiosError.response?.data };
    } else {
      return error;
    }
  }
};
