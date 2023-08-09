import { ReactNode, createContext, useMemo } from 'react';

import { UserPublicResponseDto } from '@w3block/sdk-id';

import { useProfileWithouRedirect } from '../../hooks';
import { useGetDocuments } from '../../hooks/useGetDocuments';

interface UserProfileWithKYC extends UserPublicResponseDto {
  avatarSrc?: string;
}

interface UserContextProps {
  profile?: UserProfileWithKYC;
}

export const UserContext = createContext<UserContextProps>({});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: profile } = useProfileWithouRedirect();
  const { data } = useGetDocuments();

  const avatarSrc = useMemo(() => {
    return data?.items && data?.items.length
      ? data.items[0].asset?.directLink
      : '';
  }, [data]);

  const profileWithKYC = useMemo<UserProfileWithKYC | undefined>(() => {
    if (profile) {
      return {
        ...profile!.data,
        avatarSrc,
      };
    } else {
      return undefined;
    }
  }, [profile]);

  return (
    <UserContext.Provider value={{ profile: profileWithKYC }}>
      {children}
    </UserContext.Provider>
  );
};
