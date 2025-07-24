import { createContext, ReactNode, useMemo } from 'react';

interface Props {
  children?: ReactNode;
  w3blockKeyAPIUrl: string;
  w3blockIdAPIUrl: string;
  w3blockCommerceAPIUrl: string;
  w3blockPdfAPIUrl: string;
  w3BlockPollApiUrl: string;
  w3BlockPassApiUrl: string;
}

// Check if context already exists (for symlink development)
const globalKey = '__W3BLOCK_API_CONTEXT__';
declare global {
  interface Window {
    [key: string]: any;
  }
}

let context: React.Context<{
  w3blockKeyAPIUrl: string;
  w3blockIdAPIUrl: string;
  w3blockCommerceAPIUrl: string;
  w3blockPdfAPIUrl: string;
  w3BlockPollApiUrl: string;
  w3BlockPassApiUrl: string;
}>;

if (typeof window !== 'undefined' && window[globalKey]) {
  context = window[globalKey];
} else {
  context = createContext({
    w3blockKeyAPIUrl: '',
    w3blockIdAPIUrl: '',
    w3blockCommerceAPIUrl: '',
    w3blockPdfAPIUrl: '',
    w3BlockPollApiUrl: '',
    w3BlockPassApiUrl: '',
  });
  if (typeof window !== 'undefined') {
    window[globalKey] = context;
  }
}

export const W3blockAPIContext = context;

export const W3blockApiProvider = ({
  children,
  w3blockIdAPIUrl,
  w3blockKeyAPIUrl,
  w3blockCommerceAPIUrl,
  w3blockPdfAPIUrl,
  w3BlockPollApiUrl,
  w3BlockPassApiUrl,
}: Props) => {
  const value = useMemo(() => {
    return {
      w3blockKeyAPIUrl,
      w3blockIdAPIUrl,
      w3blockCommerceAPIUrl,
      w3blockPdfAPIUrl,
      w3BlockPollApiUrl,
      w3BlockPassApiUrl,
    };
  }, [
    w3blockIdAPIUrl,
    w3blockKeyAPIUrl,
    w3blockCommerceAPIUrl,
    w3blockPdfAPIUrl,
    w3BlockPollApiUrl,
    w3BlockPassApiUrl,
  ]);
  return (
    <W3blockAPIContext.Provider value={value}>
      {children}
    </W3blockAPIContext.Provider>
  );
};
