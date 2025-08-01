/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useMemo } from 'react';
import { createSymlinkSafeContext } from '../../shared/utils/createSymlinkSafeContext';

interface Props {
  logError?(error: any, extra?: object): void;
  children?: ReactNode;
}

interface ContextProps {
  logError?(error: any, extra?: object): void;
}

export const ErrorContext = createSymlinkSafeContext<ContextProps>(
  '__ERROR_CONTEXT__',
  {} as ContextProps
);

export const ErrorProvider = ({ logError, children }: Props) => {
  const value = useMemo(() => {
    return { logError };
  }, [logError]);
  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
};
