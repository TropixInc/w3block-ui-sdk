/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, createContext, useMemo } from 'react';

interface Props {
  logError?(error: any, extra?: object): void;
  children?: ReactNode;
}

interface ContextProps {
  logError?(error: any, extra?: object): void;
}

export const ErrorContext = createContext({} as ContextProps);

export const ErrorProvider = ({ logError, children }: Props) => {
  const value = useMemo(() => {
    return { logError };
  }, [logError]);
  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
};
