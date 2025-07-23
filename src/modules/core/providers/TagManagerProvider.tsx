/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, createContext, useMemo } from 'react';

interface Props {
  gtag?(event: any, params?: object): void;
  children?: ReactNode;
}

interface ContextProps {
  gtag?(event: any, params?: object): void;
}

// Check if context already exists (for symlink development)
const globalKey = '__TAG_MANAGER_CONTEXT__';
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

export const TagManagerContext = context;

export const TagManagerProvider = ({ gtag, children }: Props) => {
  const value = useMemo(() => {
    return { gtag };
  }, [gtag]);
  return (
    <TagManagerContext.Provider value={value}>
      {children}
    </TagManagerContext.Provider>
  );
};
