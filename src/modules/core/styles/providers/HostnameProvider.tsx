import { createContext, ReactNode, useEffect, useState } from 'react';

interface Props {
  host?: string;
  children: ReactNode;
}

export const HostnameContext = createContext('');

const normalizeHostName = (hostName: string) => hostName.split(':')[0] ?? '';

const HostnameProvider = ({ host = '', children }: Props) => {
  const [hostName, setHostName] = useState(() => {
    if (host) return normalizeHostName(host);
    if (typeof window !== 'undefined') {
      return normalizeHostName(window.location.hostname ?? '');
    }
    return '';
  });

  useEffect(() => {
    if (host && host !== hostName) {
      setHostName(normalizeHostName(host));
    }
  }, [host, hostName]);

  return (
    <HostnameContext.Provider value={hostName}>
      {children}
    </HostnameContext.Provider>
  );
};

export default HostnameProvider;
