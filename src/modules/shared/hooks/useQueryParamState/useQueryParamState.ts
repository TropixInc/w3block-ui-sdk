import { useCallback, useEffect, useMemo } from 'react';

import useRouter from '../useRouter';

export const useQueryParamState = <Data extends string | Array<string>>(
  name: string,
  initialValue: string | undefined
): [value: Data, setValue: (newValue: Data) => void] => {
  const router = useRouter();
  const { name: value } = router.query;

  const setValue = useCallback(
    (newValue: string | Array<string>) => {
      router.push({
        query: {
          ...router.query,
          [name]: newValue,
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name]
  );

  useEffect(() => {
    if (initialValue !== undefined) {
      router.replace({
        query: {
          ...router.query,
          [name]: initialValue,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(() => [value as Data, setValue], [value, setValue]);
};
