import { useRef } from 'react';

interface Params {
  docValue?: string;
}

export const IframeInput = ({ docValue }: Params) => {
  const iframeRef = useRef(null);
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
        <button
          type="submit"
          className="pw-mt-3 pw-break-all pw-text-black pw-text-center pw-text-sm"
        >
          {'Ao finalizar, '}
          <span className="pw-underline pw-text-blue-500">
            {'clique aqui '}
          </span>
          {'para continuar'}
        </button>
      </>
    );
  }
  return null;
};
