/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, createContext, useMemo } from 'react';

interface Props {
  logError?(error: any, extra?: object): void;
  children?: ReactNode;
}

interface ContextProps {
  logError?(error: any, extra?: object): void;
}

// Check if context already exists (for symlink development)
const globalKey = '__ERROR_CONTEXT__';
declare global {
  interface Window {
    [key: string]: any;
  }
}

let context: React.Context<ContextProps>;

if (typeof window !== 'undefined' && window[globalKey]) {
  context = window[globalKey];
} else {
  context = createContext({} as ContextProps);
  if (typeof window !== 'undefined') {
    window[globalKey] = context;
  }
}

export const ErrorContext = context;

export const ErrorProvider = ({ logError, children }: Props) => {
  const value = useMemo(() => {
    return { logError };
  }, [logError]);
  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
};
