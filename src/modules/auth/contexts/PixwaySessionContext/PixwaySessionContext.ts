import { createContext } from 'react';

import { SessionContextValue } from 'next-auth/react';

export interface PixwaySessionContextInterface {
  token?: string;
  companyId?: string;
  user?: {
    name?: string;
  };
}

export const PixwaySessionContext = createContext<SessionContextValue>({
  data: null,
  status: 'unauthenticated',
});
