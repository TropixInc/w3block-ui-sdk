import { User } from 'next-auth';

import { Roles } from './Roles';

export interface SessionUser extends User {
  accessToken: string;
  refreshToken: string;
  role: Roles;
  companyId?: string;
}
