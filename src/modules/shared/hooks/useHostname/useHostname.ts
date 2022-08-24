import { useEffect, useState } from 'react';

const normalizeHostName = (hostName: string) => hostName.split(':')[0] ?? '';

export const useHostname = () => {
  const [hostName, setHostname] = useState(() =>
    typeof window !== 'undefined'
      ? normalizeHostName(window.location.hostname)
      : ''
  );

  useEffect(() => {
    if (!hostName && typeof window !== 'undefined') {
      setHostname(normalizeHostName(window.location.hostname));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return hostName;
};
