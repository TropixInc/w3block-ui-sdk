import { User } from 'next-auth';

import { Roles } from '../../enums/Roles';
import { usePixwaySession } from '../usePixwaySession';

export interface SessionUser extends User {
  accessToken: string;
  refreshToken: string;
  roles: Array<Roles>;
  companyId?: string;
}

export const useSessionUser = () => {
  const { data } = usePixwaySession();
  return data?.user as SessionUser | null;
};
