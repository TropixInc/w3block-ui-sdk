import { useEffect, useState } from 'react';
import { useRouterConnect } from './useRouterConnect';



export const useQuery = () => {
  const router = useRouterConnect();
  const [query, setQuery] = useState('');
  const queryString = new URLSearchParams(router?.query).toString();
  useEffect(() => {
    setQuery(queryString);
  }, [router]);
  return query;
};
