import { useEffect, useState } from 'react';

interface WindowLocation {
  host: string;
  hostname: string;
  href: string;
  pathname: string;
  search: string;
}

const getLocation = (): WindowLocation => {
  if (typeof window === 'undefined') {
    return {
      host: '',
      hostname: '',
      href: '',
      pathname: '/',
      search: '',
    };
  }
  return {
    host: window.location.host,
    hostname: window.location.hostname,
    href: window.location.href,
    pathname: window.location.pathname,
    search: window.location.search,
  };
};

const EMPTY_LOCATION: WindowLocation = {
  host: '',
  hostname: '',
  href: '',
  pathname: '/',
  search: '',
};

/**
 * Hook SSR-safe para acessar window.location no Next.js.
 * Retorna valores vazios durante SSR e preenche no client após montagem.
 */
export const useWindowLocation = (): WindowLocation => {
  const [location, setLocation] = useState<WindowLocation>(EMPTY_LOCATION);

  useEffect(() => {
    setLocation(getLocation());
  }, []);

  return location;
};
