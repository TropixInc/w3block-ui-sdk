import { useMemo } from 'react';

import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  subHours,
  subMinutes,
  differenceInDays,
  subDays,
} from 'date-fns';

export const useTimeDistance = (from: Date, to: Date) => {
  return useMemo(() => {
    const daysLeft = differenceInDays(to, from);
    const daysSubbed = subDays(to, daysLeft);
    const hoursLeft = differenceInHours(daysSubbed, from);
    const hoursSubbed = subHours(daysSubbed, hoursLeft);
    const minutesLeft = differenceInMinutes(hoursSubbed, from);
    const secondsLeft = differenceInSeconds(
      subMinutes(hoursSubbed, minutesLeft),
      from
    );
    return {
      days: daysLeft,
      hours: hoursLeft,
      minutes: minutesLeft,
      seconds: secondsLeft,
    };
  }, [from, to]);
};
