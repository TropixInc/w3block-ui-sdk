import { createContext } from 'react';

import { SessionContextValue } from 'next-auth/react';
import { Session } from 'next-auth';


export interface PixwaySessionContextInterface {
  token?: string;
  companyId?: string;
  user?: {
    name?: string;
  };
}

// Check if context already exists (for symlink development)
const globalKey = '__PIXWAY_SESSION_CONTEXT__';
declare global {
  interface Window {
    [key: string]: any;
  }
}

let context: React.Context<SessionContextValue>;

if (typeof window !== 'undefined' && window[globalKey]) {
  context = window[globalKey];
} else {
  context = createContext<SessionContextValue>({
    data: null,
    status: 'unauthenticated',
    update: function (data?: any): Promise<Session | null> {
      throw new Error('Function not implemented.');
    }
  });
  if (typeof window !== 'undefined') {
    window[globalKey] = context;
  }
}

export const PixwaySessionContext = context;
