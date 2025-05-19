import { useRef } from 'react';

interface Params {
  docValue?: string;
}

export const IframeInput = ({ docValue }: Params) => {
  const iframeRef = useRef(null);
  const iframe = document?.getElementById('iframe-kyc') as HTMLIFrameElement;
  const iframeURL = iframe?.src;
  if (docValue) {
    return (
      <>
        <iframe
          ref={iframeRef}
          src={docValue}
          id={'iframe-kyc'}
          className="pw-w-full pw-h-full"
          style={{ minHeight: '500px' }}
          allow="autoplay; camera; microphone; gyroscope; magnetometer; geolocation; accelerometer; ambient-light-sensor"
        />
        <div className="pw-mt-3 pw-break-all pw-text-black">{iframeURL}</div>
      </>
    );
  }
  return null;
};
