import { useMemo } from 'react';

import { addDays, eachWeekOfInterval } from 'date-fns';

const useEachWeekOfInterval = (start: Date, finish: Date) => {
  return useMemo(() => {
    const eachWeekStartDate = eachWeekOfInterval({ start, end: finish });
    const weeks: Array<Array<Date>> = [];
    eachWeekStartDate.forEach((weekStartDate) => {
      const week = [weekStartDate];
      for (let index = 1; index < 7; index++) {
        week.push(addDays(weekStartDate, index));
      }
      weeks.push(week);
    });
    return weeks;
  }, [start, finish]);
};

export default useEachWeekOfInterval;
