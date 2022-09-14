import { createContext } from 'react';

export interface IW3blockUISDKGereralConfigContext {
  companyId: string;
  logoUrl: string;
  appBaseUrl: string;
}

export const W3blockUISDKGereralConfigContext = createContext(
  {} as IW3blockUISDKGereralConfigContext
);
