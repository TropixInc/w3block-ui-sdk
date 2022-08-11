import { useEffect, useState } from 'react';

export const useQuery = () => {
  const [query, setQuery] = useState('');
  useEffect(() => {
    if (window) {
      setQuery(window.location.search);
    }
  }, []);
  return query;
};
