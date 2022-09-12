import { createContext, ReactNode, useMemo } from 'react';

interface Props {
  children?: ReactNode;
  w3blockKeyAPIUrl: string;
  w3blockIdAPIUrl: string;
  w3blockIdBaseUrl: string;
}

export const W3blockAPIContext = createContext({
  w3blockKeyAPIUrl: '',
  w3blockIdAPIUrl: '',
  w3blockIdBaseUrl: '',
});

export const W3blockApiProvider = ({
  children,
  w3blockIdAPIUrl,
  w3blockKeyAPIUrl,
  w3blockIdBaseUrl,
}: Props) => {
  const value = useMemo(() => {
    return {
      w3blockKeyAPIUrl,
      w3blockIdAPIUrl,
      w3blockIdBaseUrl,
    };
  }, [w3blockIdAPIUrl, w3blockKeyAPIUrl, w3blockIdBaseUrl]);
  return (
    <W3blockAPIContext.Provider value={value}>
      {children}
    </W3blockAPIContext.Provider>
  );
};
