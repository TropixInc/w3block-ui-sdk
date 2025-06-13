import { createContext } from 'react';

import { SessionContextValue } from 'next-auth/react';
import { Session } from 'next-auth/core/types';


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
  update: function (data?: any): Promise<Session | null> {
    throw new Error('Function not implemented.');
  }
});
