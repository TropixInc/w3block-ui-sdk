import { createContext } from 'react';

interface IEnvironmentContext {
  isProduction: boolean;
}

export const EnvironmentContext = createContext<IEnvironmentContext>({
  isProduction: false,
});
