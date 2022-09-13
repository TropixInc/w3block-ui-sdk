import { createContext, ReactNode, useMemo } from 'react';

interface Props {
  children?: ReactNode;
  w3blockKeyAPIUrl: string;
  w3blockIdAPIUrl: string;
  w3blockCommerceAPIUrl: string;
}

export const W3blockAPIContext = createContext({
  w3blockKeyAPIUrl: '',
  w3blockIdAPIUrl: '',
  w3blockCommerceAPIUrl: '',
});

export const W3blockApiProvider = ({
  children,
  w3blockIdAPIUrl,
  w3blockKeyAPIUrl,
  w3blockCommerceAPIUrl,
}: Props) => {
  const value = useMemo(() => {
    return {
      w3blockKeyAPIUrl,
      w3blockIdAPIUrl,
      w3blockCommerceAPIUrl,
    };
  }, [w3blockIdAPIUrl, w3blockKeyAPIUrl, w3blockCommerceAPIUrl]);
  return (
    <W3blockAPIContext.Provider value={value}>
      {children}
    </W3blockAPIContext.Provider>
  );
};
