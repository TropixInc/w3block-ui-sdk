import { createContext, ReactNode, useMemo } from 'react';

interface Props {
  children?: ReactNode;
  w3blockKeyAPIUrl: string;
  w3blockIdAPIUrl: string;
  w3blockCommerceAPIUrl: string;
  w3blockPdfAPIUrl: string;
}

export const W3blockAPIContext = createContext({
  w3blockKeyAPIUrl: '',
  w3blockIdAPIUrl: '',
  w3blockCommerceAPIUrl: '',
  w3blockPdfAPIUrl: '',
});

export const W3blockApiProvider = ({
  children,
  w3blockIdAPIUrl,
  w3blockKeyAPIUrl,
  w3blockCommerceAPIUrl,
  w3blockPdfAPIUrl,
}: Props) => {
  const value = useMemo(() => {
    return {
      w3blockKeyAPIUrl,
      w3blockIdAPIUrl,
      w3blockCommerceAPIUrl,
      w3blockPdfAPIUrl,
    };
  }, [
    w3blockIdAPIUrl,
    w3blockKeyAPIUrl,
    w3blockCommerceAPIUrl,
    w3blockPdfAPIUrl,
  ]);
  return (
    <W3blockAPIContext.Provider value={value}>
      {children}
    </W3blockAPIContext.Provider>
  );
};
