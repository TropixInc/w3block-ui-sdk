/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, createContext, useMemo } from 'react';

interface Props {
  gtag?(event: any, params?: object): void;
  children?: ReactNode;
}

interface ContextProps {
  gtag?(event: any, params?: object): void;
}

export const TagManagerContext = createContext({} as ContextProps);

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
