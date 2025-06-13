import { useCallback, useMemo, useState } from 'react';
import { useTimeoutFn } from 'react-use';

export const useTimedBoolean = (timer: number): [boolean, () => void] => {
  const [value, setValue] = useState(false);

  const [_, __, reset] = useTimeoutFn(() => setValue(false), timer);

  const activate = useCallback(() => {
    setValue(true);
    reset();
  }, [reset]);

  return useMemo(() => {
    return [value, activate];
  }, [value, activate]);
};
