/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useMemo } from 'react';
import { createSymlinkSafeContext } from '../../shared/utils/createSymlinkSafeContext';

interface Props {
  gtag?(event: any, params?: object): void;
  children?: ReactNode;
}

interface ContextProps {
  gtag?(event: any, params?: object): void;
}

export const TagManagerContext = createSymlinkSafeContext<ContextProps>(
  '__TAG_MANAGER_CONTEXT__',
  {} as ContextProps
);

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
