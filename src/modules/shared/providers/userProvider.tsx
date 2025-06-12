import { ReactNode, createContext, useMemo } from 'react';

import { UserPublicResponseDto } from '@w3block/sdk-id';
import { useProfileWithouRedirect } from '../hooks/useProfile';
import { useGetDocuments } from '../hooks/useGetDocuments';



interface UserProfileWithKYC extends UserPublicResponseDto {
  avatarSrc?: string;
}

interface UserContextProps {
  profile?: UserProfileWithKYC;
}

export const UserContext = createContext<UserContextProps>({});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: profile } = useProfileWithouRedirect();
  const { data } = useGetDocuments({ limit: 50 });

  const avatarSrc = useMemo(() => {
    return data?.items && data?.items.length
      ? data.items.filter(
          (res: { input: { type: string } }) =>
            res.input.type === 'multiface_selfie'
        ).asset?.directLink
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
