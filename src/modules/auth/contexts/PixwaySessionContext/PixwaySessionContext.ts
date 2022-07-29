import { createContext } from 'react';

export interface PixwaySessionContextInterface {
  token?: string;
  companyId?: string;
  user?: {
    name?: string;
  };
}

export const PixwaySessionContext =
  createContext<PixwaySessionContextInterface>({});
