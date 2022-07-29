import { getPublicAPI } from '../../../shared/config/api';
import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { Roles } from '../../../shared/enums/Roles';

export interface SignInPayload {
  email: string;
  password: string;
  companyId: string;
}

interface UserDataSignIn {
  sub: string;
  email: string;
  role: Roles;
  name: string;
  verified: boolean;
  companyId?: string;
}

export interface SignInResponse {
  token: string;
  refreshToken: string;
  data: UserDataSignIn;
}

export const signIn = (payload: SignInPayload, baseURL: string) => {
  return getPublicAPI(baseURL).post<SignInResponse>(
    PixwayAPIRoutes.SIGN_IN,
    payload
  );
};
