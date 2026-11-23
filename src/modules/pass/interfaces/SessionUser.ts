import { UserRoleEnum } from '@w3block/sdk-id';
import { User } from 'next-auth';

export interface SessionUser extends User {
  accessToken: string;
  /** Only present on hosts that still expose it; the Connect keeps it server-side. */
  refreshToken?: string;
  roles: Array<UserRoleEnum>;
  companyId?: string;
  tenantId?: string;
}
