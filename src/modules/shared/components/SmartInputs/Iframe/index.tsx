import { useRef } from 'react';

interface Params {
  docValue?: string;
}

export const IframeInput = ({ docValue }: Params) => {
  const iframeRef = useRef(null);
  if (docValue) {
    return (
      <iframe
        ref={iframeRef}
        src={docValue}
        className="pw-w-full pw-h-full"
        style={{ minHeight: '500px' }}
      />
    );
  }
  return null;
};
