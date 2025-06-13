import { createContext } from 'react';

export interface IW3blockwalletContext {
  isConnected: string;
}

export const W3blockwalletContext = createContext({} as IW3blockwalletContext);
