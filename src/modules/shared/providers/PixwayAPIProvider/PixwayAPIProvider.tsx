import { createContext, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  pixwayAPIUrl: string;
}

export const PixwayAPIContext = createContext('');

export const PixwayApiProvider = ({ children, pixwayAPIUrl }: Props) => {
  return (
    <PixwayAPIContext.Provider value={pixwayAPIUrl}>
      {children}
    </PixwayAPIContext.Provider>
  );
};
