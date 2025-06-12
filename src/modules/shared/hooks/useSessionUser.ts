import { UserRoleEnum } from "@w3block/sdk-id";
import { User } from "next-auth";

import { usePixwaySession } from "./usePixwaySession";

export interface SessionUser extends User {
  accessToken: string;
  refreshToken: string;
  roles: Array<UserRoleEnum>;
  companyId?: string;
  email?: string;
}

export const useSessionUser = () => {
  const { data } = usePixwaySession();
  return data?.user as SessionUser | null;
};
