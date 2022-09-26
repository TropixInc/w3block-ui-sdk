import { UserRoleEnum } from '@w3block/sdk-id';
import { User } from 'next-auth';

export interface SessionUser extends User {
  accessToken: string;
  refreshToken: string;
  roles: Array<UserRoleEnum>;
  companyId?: string;
}
