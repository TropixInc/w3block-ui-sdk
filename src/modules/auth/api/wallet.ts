import { W3blockIdSDK } from '@w3block/sdk-id';
import { AxiosError } from 'axios';

export interface RequestWalletBody {
  address: string;
  chainId: number;
}

export interface ClaimWalletBody {
  signature: string;
}

const withAuthenticatedSDK = async <T>(
  token: string,
  companyId: string,
  baseURL: string,
  refreshToken: string,
  action: (sdk: W3blockIdSDK, companyId: string) => Promise<T>
) => {
  try {
    const sdk = new W3blockIdSDK({
      autoRefresh: false,
      baseURL,
    });

    if (refreshToken && token) {
      await sdk.authenticate({
        refreshToken: refreshToken,
        authToken: token,
        tenantId: companyId,
      });
    }

    return await action(sdk, companyId);
  } catch (error: any) {
    if (error.isAxiosError) {
      const axiosError = error as AxiosError;
      return { data: axiosError.response?.data };
    } else {
      return error;
    }
  }
};

export const requestWalletMetamask = async (
  token: string,
  companyId: string,
  baseURL: string,
  refreshToken: string,
  body: RequestWalletBody
) =>
  withAuthenticatedSDK(token, companyId, baseURL, refreshToken, (sdk, tenant) =>
    sdk.api.users.requestMetamask(tenant, body)
  );

export const claimWalletMetamask = async (
  token: string,
  companyId: string,
  baseURL: string,
  refreshToken: string,
  body: ClaimWalletBody
) =>
  withAuthenticatedSDK(token, companyId, baseURL, refreshToken, (sdk, tenant) =>
    sdk.api.users.claimMetamask(tenant, body)
  );

export const claimWalletVault = async (
  token: string,
  companyId: string,
  baseURL: string,
  refreshToken: string
) =>
  withAuthenticatedSDK(token, companyId, baseURL, refreshToken, (sdk, tenant) =>
    sdk.api.users.createVault(tenant)
  );
