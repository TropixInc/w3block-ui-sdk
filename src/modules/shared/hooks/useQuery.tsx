import { useEffect, useState } from 'react';
import { useRouterConnect } from './useRouterConnect';



export const useQuery = () => {
  const router = useRouterConnect();
  const [query, setQuery] = useState('');
  useEffect(() => {
    setQuery(router.asPath.split('?')[1]);
  }, [router]);
  return query;
};
