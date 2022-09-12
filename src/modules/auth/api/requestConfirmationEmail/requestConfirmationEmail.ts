import { W3blockIdSDK } from '@w3block/sdk-id';
import { AxiosError } from 'axios';

export interface RequestConfirmationEmailBody {
  email: string;
  tenantId: string;
  callbackUrl: string;
}

export const requestConfirmationEmail = async (
  token: string,
  companyId: string,
  baseURL: string,
  refreshToken: string,
  body: RequestConfirmationEmailBody
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

    return await sdk.api.auth.requestConfirmationEmail(body);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.isAxiosError) {
      const axiosError = error as AxiosError;
      return { data: axiosError.response?.data };
    } else {
      return error;
    }
  }
};
