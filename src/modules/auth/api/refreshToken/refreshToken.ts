import { getSecureApi } from '../../../shared/config/api';

export interface RefreshTokenBody {
  refreshToken: string;
}

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export const refreshTokenRequest = async (
  token: string,
  baseURL: string,
  body: RefreshTokenBody
) => {
  return await getSecureApi(token, baseURL).post<RefreshTokenResponse>(
    '/auth/refresh-token',
    body
  );
};
