/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';

import { CustomDatePicker } from './CustomDatePicker';
import { CalendarType } from './Calendar';
import useTranslation from '../hooks/useTranslation';

interface DateFilterProps {
  onChangeStartDate?: (date: any) => void;
  onChangeEndDate?: (date: any) => void;
  defaultDate: Date;
  onChangeDefaultDate: (date: Date) => void;
  onCancel: () => void;
  startDate?: Date;
  endDate?: Date;
  typeOfCalendar?: CalendarType;
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  minDate?: Date;
  placeholder?: string;
}

export const DateFilter = ({
  onChangeEndDate,
  onChangeStartDate,
  defaultDate,
  onChangeDefaultDate,
  onCancel,
  startDate,
  endDate,
  typeOfCalendar = CalendarType.INTERVAL,
  onSelectDate,
  selectedDate,
  minDate,
  placeholder,
}: DateFilterProps) => {
  const [translate, i18n] = useTranslation();

  const pickerType = useMemo(() => {
    return typeOfCalendar === CalendarType.SINGLE ? 'unique' : 'range';
  }, [typeOfCalendar]);

  const selectedDateValue = useMemo(() => {
    if (pickerType === 'range') {
      return [startDate || null, endDate || null] as [Date | null, Date | null];
    } else {
      return selectedDate || null;
    }
  }, [pickerType, startDate, endDate, selectedDate]);

  const handleDateChange = (value: Date | [Date | null, Date | null] | null) => {
    if (pickerType === 'range') {
      const range = value as [Date | null, Date | null] | null;
      if (range) {
        const [start, end] = range;
        if (start) onChangeStartDate?.(start);
        else onChangeStartDate?.(null);
        if (end) onChangeEndDate?.(end);
        else onChangeEndDate?.(null);
      } else {
        onChangeStartDate?.(null);
        onChangeEndDate?.(null);
      }
    } else {
      const singleDate = value as Date | null;
      if (singleDate && onSelectDate) {
        onSelectDate(singleDate);
      }
    }
  };

  return (
    <CustomDatePicker
      type={pickerType}
      selectedDate={selectedDateValue}
      onChangeSelectedDate={handleDateChange}
      minDate={minDate}
      language={i18n.language || 'pt-BR'}
      placeholder={placeholder || translate('contractDetails>RoyaltiesArea>date')}
      className="sm:pw-max-w-[350px]"
      fullWidth
    />
  );
};
