import { createSymlinkSafeContext } from '../../shared/utils/createSymlinkSafeContext';

import { SessionContextValue } from 'next-auth/react';
import { Session } from 'next-auth';

export interface PixwaySessionContextInterface {
  token?: string;
  companyId?: string;
  user?: {
    name?: string;
  };
}

export const PixwaySessionContext = createSymlinkSafeContext<SessionContextValue>(
  '__PIXWAY_SESSION_CONTEXT__',
  {
    data: null,
    status: 'unauthenticated',
    update: function (data?: any): Promise<Session | null> {
      throw new Error('Function not implemented.');
    }
  }
);
