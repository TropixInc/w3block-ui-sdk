import { SessionProvider, SessionProviderProps } from 'next-auth/react';

export const PixwaySessionProvider = ({
  children,
  ...rest
}: SessionProviderProps) => {
  return <SessionProvider {...rest}>{children}</SessionProvider>;
};
