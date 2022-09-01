import { useEffect, useState } from 'react';

import useRouter from '../useRouter';

export const useQuery = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  useEffect(() => {
    setQuery(router.asPath.split('?')[1]);
  }, [router]);
  return query;
};
