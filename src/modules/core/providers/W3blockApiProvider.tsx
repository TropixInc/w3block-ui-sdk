import { ReactNode, useMemo } from 'react';
import { createSymlinkSafeContext } from '../../shared/utils/createSymlinkSafeContext';

interface Props {
  children?: ReactNode;
  w3blockKeyAPIUrl: string;
  w3blockIdAPIUrl: string;
  w3blockCommerceAPIUrl: string;
  w3blockPdfAPIUrl: string;
  w3BlockPollApiUrl: string;
  w3BlockPassApiUrl: string;
}

export interface W3blockAPIContextInterface {
  w3blockKeyAPIUrl: string;
  w3blockIdAPIUrl: string;
  w3blockCommerceAPIUrl: string;
  w3blockPdfAPIUrl: string;
  w3BlockPollApiUrl: string;
  w3BlockPassApiUrl: string;
}

export const W3blockAPIContext = createSymlinkSafeContext<W3blockAPIContextInterface>(
  '__W3BLOCK_API_CONTEXT__',
  {
    w3blockKeyAPIUrl: '',
    w3blockIdAPIUrl: '',
    w3blockCommerceAPIUrl: '',
    w3blockPdfAPIUrl: '',
    w3BlockPollApiUrl: '',
    w3BlockPassApiUrl: '',
  }
);

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
