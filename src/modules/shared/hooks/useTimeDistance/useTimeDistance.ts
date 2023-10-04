import { useMemo } from 'react';

import differenceInDays from 'date-fns/differenceInDays';
import differenceInHours from 'date-fns/differenceInHours';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import subDays from 'date-fns/subDays';
import subHours from 'date-fns/subHours';
import subMinutes from 'date-fns/subMinutes';

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
