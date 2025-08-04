import { IW3blockAuthenticationContext } from '../../shared/interfaces/IW3blockAuthenticationContext';
import { ReactNode } from 'react';
import { W3blockAuthenticationContext } from './W3blockAuthenticationContext';


interface Props {
  children: ReactNode;
  value: IW3blockAuthenticationContext;
}

export const W3blockAuthenticationProvider = ({ children, value }: Props) => {
  return (
    <W3blockAuthenticationContext.Provider value={value}>
      {children}
    </W3blockAuthenticationContext.Provider>
  );
};
