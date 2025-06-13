import { forwardRef, HTMLProps, ReactNode, useMemo, useRef } from 'react';

import classNames from 'classnames';
import {
  addMonths,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
  subMonths,
  isValid,
  set,
} from 'date-fns';
import useEachWeekInMonth from '../hooks/useEachWeekOfMonth';
import CalendarMenu from './CalendarMenu';



export interface DatePickerInterval {
  start: Date;
  end: Date;
}

export enum CalendarType {
  SINGLE,
  INTERVAL,
  BOTH,
}

interface CalendarProps {
  intervalStart?: Date;
  intervalEnd?: Date;
  setIntervalStart?: (date: Date | undefined) => void;
  setIntervalEnd?: (date: Date | undefined) => void;
  onSelectDate?: (date: Date) => void;
  onSelectInterval?: (interval: DatePickerInterval) => void;
  isSelectingInterval: boolean;
  setIsSelectingInterval: (status: boolean) => void;
  defaultDate: Date;
  selectedDate?: Date;
  selectedInterval?: DatePickerInterval;
  onChangeMonth: (date: Date) => void;
  canSelectPastDay?: boolean;
  maxCalendarDate?: Date;
  minCalendarDate?: Date;
  selectionType: CalendarType;
  isOpen?: boolean;
}

interface DateCellProps {
  date: Date;
  intervalStart?: Date;
  intervalEnd?: Date;
  isPastDate: boolean;
  selectedDate?: Date;
  children?: ReactNode;
  className?: string;
}

type DateButtonProps = HTMLProps<HTMLButtonElement> & {
  isIntervalHead: boolean;
  isToday: boolean;
  isSelectedDate: boolean;
  children?: ReactNode;
  className?: string;
};

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

const DateCell = ({
  date,
  intervalEnd,
  intervalStart,
  isPastDate: _,
  selectedDate,
  children,
  className = '',
}: DateCellProps) => {
  const getStateClasses = () => {
    if (date && selectedDate && isSameDay(selectedDate, date)) {
      return 'pw-bg-[##3EF2B1] pw-rounded-full pw-text-[#353945]';
    }
    const isIntervalStart = intervalStart && isSameDay(date, intervalStart);
    const isIntervalEnd = intervalEnd && isSameDay(date, intervalEnd);
    if (isIntervalStart) {
      return '!pw-bg-[#E9F0FB] pw-rounded-l-[32px] pw-text-[#353945]';
    }
    if (isIntervalEnd) {
      return '!pw-bg-[#E9F0FB] pw-rounded-r-[32px] pw-text-[#353945]';
    }
    if (
      date &&
      intervalEnd &&
      intervalStart &&
      isBefore(date, intervalEnd) &&
      isAfter(date, intervalStart)
    ) {
      return '!pw-bg-[#E9F0FB]';
    }
    return '';
  };
  const stateClasses = getStateClasses();

  return <li className={classNames(stateClasses, className)}>{children}</li>;
};

const DateButton = forwardRef<HTMLButtonElement, DateButtonProps>(
  (
    { isToday, isSelectedDate, children, className = '', type: _, ...rest },
    ref
  ) => (
    <button
      ref={ref}
      className={classNames(
        isSelectedDate
          ? 'pw-bg-[#5682C3] pw-text-white'
          : isToday
          ? 'pw-bg-[#E6E8EC]'
          : '',
        className,
        'hover:pw-bg-[#5682C3] hover:pw-text-white'
      )}
      type="button"
      {...rest}
    >
      {children}
    </button>
  )
);

const Calendar = ({
  selectedDate,
  intervalStart,
  intervalEnd,
  onSelectDate,
  canSelectPastDay = false,
  selectionType,
  setIntervalStart,
  setIntervalEnd,
  isSelectingInterval,
  setIsSelectingInterval,
  onChangeMonth,
  defaultDate,
  minCalendarDate,
  maxCalendarDate,
}: CalendarProps) => {
  const today = startOfDay(new Date());
  const year = getYear(defaultDate);
  const month = getMonth(defaultDate);
  const monthWeeks = useEachWeekInMonth(defaultDate);
  const firstDayButtonRef = useRef<HTMLButtonElement>(null);

  const currentMonthWeeks = useMemo(() => {
    const firstWeek = monthWeeks[0]?.filter((date) => date.isCurrentMonth);
    const lastWeek = monthWeeks[monthWeeks.length - 1].filter(
      (date) => date.isCurrentMonth
    );
    const middleMonthWeeks = [...monthWeeks.slice(1, -1)];
    return [
      Array(7 - firstWeek.length)
        .fill(undefined)
        .concat(firstWeek),
      ...middleMonthWeeks,
      lastWeek,
    ];
  }, [monthWeeks]);

  const canSelectInterval =
    selectionType === CalendarType.BOTH ||
    selectionType === CalendarType.INTERVAL;

  const onMouseDown = (date: Date) => {
    if (canSelectInterval) {
      if (
        isSelectingInterval &&
        intervalStart &&
        (isAfter(date, intervalStart) || isSameDay(date, intervalStart))
      ) {
        if (isValid(intervalEnd)) {
          setIntervalEnd &&
            setIntervalEnd(set(date, { hours: 23, minutes: 59 }));
          setIsSelectingInterval(false);
        }
      } else {
        setIntervalStart && setIntervalStart(set(date, { hours: 0 }));
        setIntervalEnd && setIntervalEnd(set(date, { hours: 23, minutes: 59 }));
        setIsSelectingInterval(true);
      }
    } else {
      onSelectDate && onSelectDate(date);
    }
  };

  const onMouseOver = (date: Date) => {
    if (
      intervalStart &&
      isSelectingInterval &&
      (isAfter(date, intervalStart) || isSameDay(date, intervalStart))
    ) {
      setIntervalEnd && setIntervalEnd(set(date, { hours: 23, minutes: 59 }));
    }
  };

  const onGoToNextMonth = () => {
    onChangeMonth(addMonths(defaultDate, 1));
  };

  const onGoToPreviousMonth = () => {
    onChangeMonth(subMonths(defaultDate, 1));
  };

  const canSelectDate = (date: Date) => {
    if (!canSelectPastDay && isBefore(date, today)) return false;
    if (maxCalendarDate) {
      if (!isBefore(date, maxCalendarDate)) return false;
    }
    if (minCalendarDate) {
      if (!isAfter(date, minCalendarDate)) return false;
    }
    return true;
  };

  return (
    <div>
      <CalendarMenu
        date={defaultDate}
        next={onGoToNextMonth}
        previous={onGoToPreviousMonth}
        previousEnabled={
          minCalendarDate
            ? isAfter(subMonths(defaultDate, 1), minCalendarDate)
            : true
        }
        nextEnabled={
          maxCalendarDate
            ? isBefore(addMonths(defaultDate, 1), maxCalendarDate)
            : true
        }
        className="pw-mb-3"
      />
      <ul className={`pw-grid pw-grid-rows-${currentMonthWeeks.length + 1}`}>
        <li>
          <ul className="pw-grid pw-grid-cols-7 pw-h-full">
            {weekDays.map((weekDay) => (
              <li
                className="pw-text-xs pw-leading-normal pw-flex pw-items-center pw-justify-center pw-w-8 pw-h-8 pw-text-[#718096]"
                key={`${weekDay}-1`}
              >
                {weekDay}
              </li>
            ))}
          </ul>
        </li>

        {currentMonthWeeks.map((week, weekIndex) => (
          <li key={`${year}-${month}-${weekIndex}`}>
            <ul className="pw-grid pw-grid-cols-7 pw-h-full !pw-gap-x-0 pw-text-black">
              {week.map((day, dayIndex) =>
                day ? (
                  <DateCell
                    isPastDate={isBefore(day.value, today)}
                    intervalStart={intervalStart}
                    intervalEnd={intervalEnd}
                    selectedDate={selectedDate}
                    date={day.value}
                    key={`${year}-${month}-${weekIndex}-${day.number}`}
                    className="pw-flex pw-items-center pw-justify-center pw-select-none pw-w-full pw-min-w-8 pw-h-8 pw-p-0.5"
                  >
                    <DateButton
                      ref={day.number === 1 ? firstDayButtonRef : undefined}
                      isIntervalHead={
                        (intervalStart
                          ? isSameDay(day.value, intervalStart)
                          : false) ||
                        (intervalEnd
                          ? isSameDay(day.value, intervalEnd)
                          : false)
                      }
                      isToday={isSameDay(day.value, today)}
                      isSelectedDate={
                        selectedDate
                          ? isSameDay(day.value, selectedDate)
                          : false
                      }
                      className="pw-rounded-full pw-w-full pw-h-full"
                      disabled={!canSelectDate(day.value)}
                      onClick={() => onMouseDown(day.value)}
                      onMouseOver={() => onMouseOver(day.value)}
                    >
                      {day.number}
                    </DateButton>
                  </DateCell>
                ) : (
                  <li key={`${year}-${month}-${weekIndex}-void-${dayIndex}`} />
                )
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

DateButton.displayName = 'DateButton';

export default Calendar;
