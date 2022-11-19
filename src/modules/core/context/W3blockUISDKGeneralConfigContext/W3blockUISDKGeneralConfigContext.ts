import { createContext } from 'react';

export interface IW3blockUISDKGereralConfigContext {
  companyId: string;
  logoUrl: string;
  appBaseUrl: string;
  connectProxyPass?: string;
}

export const W3blockUISDKGereralConfigContext = createContext(
  {} as IW3blockUISDKGereralConfigContext
);
