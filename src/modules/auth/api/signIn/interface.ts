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
