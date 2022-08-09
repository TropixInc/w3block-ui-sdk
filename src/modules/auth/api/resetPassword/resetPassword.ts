import { getPublicAPI } from '../../../shared/config/api';
import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { SignInResponse } from '../signIn';

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  confirmation: string;
}

export const resetPassword = (payload: ResetPasswordPayload, baseURL: string) =>
  getPublicAPI(baseURL).post<SignInResponse>(
    PixwayAPIRoutes.RESET_PASSWORD,
    payload
  );
