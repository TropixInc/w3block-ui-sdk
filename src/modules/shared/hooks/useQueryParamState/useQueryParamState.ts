import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useRouterConnect } from '../useRouterConnect';

export const useQueryParamState = <Data extends string | Array<string>>(
  name: string,
  initialValue: string | undefined
): [value: Data, setValue: (newValue: Data) => void] => {
  const router = useRouterConnect();
  const queryRef = useRef(router.query);
  queryRef.current = router.query;
  const { [name]: value } = router.query;

  const setValue = useCallback(
    (newValue: string | Array<string>) => {
      router.push({
        query: {
          ...queryRef.current,
          [name]: newValue,
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name]
  );

  useEffect(() => {
    if (initialValue !== undefined && value === undefined && router.isReady) {
      router.replace({
        query: {
          ...queryRef.current,
          [name]: initialValue,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return useMemo(() => [value as Data, setValue], [value, setValue]);
};
