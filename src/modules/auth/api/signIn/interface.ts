import { UserRoleEnum } from '@w3block/sdk-id';

export interface SignInPayload {
  email: string;
  password: string;
  companyId: string;
}

interface UserDataSignIn {
  sub: string;
  email: string;
  roles: Array<UserRoleEnum>;
  name: string;
  verified: boolean;
  companyId?: string;
}

export interface SignInResponse {
  token: string;
  refreshToken: string;
  data: UserDataSignIn;
}
