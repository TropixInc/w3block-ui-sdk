import { User } from 'next-auth';

import { Roles } from './Roles';

export interface SessionUser extends User {
  accessToken: string;
  refreshToken: string;
  roles: Array<Roles>;
  companyId?: string;
}
