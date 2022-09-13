import { useCallback, useMemo } from 'react';
import { useCounter, useHarmonicIntervalFn } from 'react-use';

export const useCountdown = (): [
  value: number,
  setCountdown: (timer: number) => void
] => {
  const [value, { dec, set, get }] = useCounter();

  useHarmonicIntervalFn(() => {
    if (get() > 0) dec();
  }, 1000);

  const setCountdown = useCallback(
    (timer: number) => {
      if (timer > 0) {
        set(timer);
      }
    },
    [set]
  );

  return useMemo(() => [value, setCountdown], [value, setCountdown]);
};
