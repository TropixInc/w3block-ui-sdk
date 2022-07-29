import { createContext, ReactNode } from 'react';

import {
  SessionContextValue,
  SessionProvider,
  SessionProviderProps,
} from 'next-auth/react';

interface Props {
  children: ReactNode;
  session: SessionContextValue;
}

const PixwaySessionContext = createContext<SessionContextValue>({
  data: null,
  status: 'unauthenticated',
});

export const PixwaySessionProvider2 = ({ children, session }: Props) => {
  return (
    <PixwaySessionContext.Provider value={session}>
      {children}
    </PixwaySessionContext.Provider>
  );
};

export const PixwaySessionProvider = ({
  children,
  ...rest
}: SessionProviderProps) => {
  return <SessionProvider {...rest}>{children}</SessionProvider>;
};
