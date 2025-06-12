import { useMemo } from 'react';

import { endOfMonth, getDate, isSameMonth, startOfMonth } from 'date-fns';

import useEachWeekOfInterval from './useEachWeekOfInterval';

export interface WeekDate {
  number: number;
  value: Date;
  isCurrentMonth: boolean;
}

const useEachWeekInMonth = (date: Date): Array<Array<WeekDate>> => {
  const weeksInInterval = useEachWeekOfInterval(
    startOfMonth(date),
    endOfMonth(date)
  );

  return useMemo(
    () =>
      weeksInInterval.map((week) =>
        week.map((day) => ({
          number: getDate(day),
          value: day,
          isCurrentMonth: isSameMonth(date, day),
        }))
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [weeksInInterval]
  );
};

export default useEachWeekInMonth;
