import { ReactNode, useMemo } from 'react';

import {
  PixwaySessionContext,
  PixwaySessionContextInterface,
} from '../../auth/contexts/PixwaySessionContext';

interface Props {
  children: ReactNode;
  userName?: string;
  companyId: string;
  token?: string;
}

export const PixwaySessionProvider = ({
  children,
  companyId,
  token,
  userName,
}: Props) => {
  const value = useMemo<PixwaySessionContextInterface>(() => {
    return {
      token,
      companyId,
      user: {
        name: userName,
      },
    };
  }, [token, companyId, userName]);

  return (
    <PixwaySessionContext.Provider value={value}>
      {children}
    </PixwaySessionContext.Provider>
  );
};
