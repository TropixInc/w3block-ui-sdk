/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from 'react';
import { format } from 'date-fns';

import { CustomDatePicker } from './CustomDatePicker';
import { CalendarType } from './Calendar';
import { SelectInput } from './SelectInput';
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

export const DateFilterWithOptions = ({
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
  const [openCalendarModal, setOpenCalendarModal] = useState(false);

  // Determina o tipo do CustomDatePicker baseado no CalendarType
  const pickerType = useMemo(() => {
    return typeOfCalendar === CalendarType.SINGLE ? 'unique' : 'range';
  }, [typeOfCalendar]);

  // Converte startDate/endDate para o formato do CustomDatePicker (tupla)
  const selectedDateValue = useMemo(() => {
    if (pickerType === 'range') {
      return [startDate || null, endDate || null] as [Date | null, Date | null];
    } else {
      return selectedDate || null;
    }
  }, [pickerType, startDate, endDate, selectedDate]);

  // Handler para mudanças no CustomDatePicker
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

  const handleClose = () => {
    setOpenCalendarModal(false);
  };

  const renderPlaceholder = () => {
    if (typeOfCalendar === CalendarType.INTERVAL) {
      if (startDate && endDate) {
        const formatedInitDate = format(new Date(startDate), 'dd MMM yyyy');
        const formatedEndDate = format(new Date(endDate), 'dd MMM yyyy');
        return `${formatedInitDate} - ${formatedEndDate}`;
      } else {
        return placeholder ? placeholder : 'Personalizado';
      }
    } else if (typeOfCalendar === CalendarType.SINGLE) {
      if (selectedDate) {
        return selectedDate.toLocaleDateString();
      } else {
        return placeholder ? placeholder : 'Personalizado';
      }
    } else {
      return 'Personalizado';
    }
  };

  const [selectedOption, setSelectedOption] = useState<string | undefined>('');
  const options = [
    { label: 'Desde o ínicio', value: 'all' },
    { label: 'Este mês', value: 'thisMonth' },
    { label: 'Mês passado', value: 'lastMonth' },
    { label: renderPlaceholder(), value: 'custom' },
  ];

  const getMonthDateRange = () => {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    firstDay.setHours(0, 0, 0, 0);
    const lastDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    );
    lastDay.setHours(23, 59, 59, 999);
    onChangeStartDate && onChangeStartDate(firstDay);
    onChangeEndDate && onChangeEndDate(lastDay);
  };

  const getLastMonthDateRange = () => {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    firstDay.setHours(0, 0, 0, 0);
    const lastDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      0
    );
    lastDay.setHours(23, 59, 59, 999);
    onChangeStartDate && onChangeStartDate(firstDay);
    onChangeEndDate && onChangeEndDate(lastDay);
  };

  return (
    <div className="sm:pw-w-[250px] pw-w-full pw-relative">
      <SelectInput
        className="pw-w-full"
        hideFirstOption
        options={options}
        selected={selectedOption ?? ''}
        onChange={(value: string) => {
          setSelectedOption(value);
          if (value === 'custom') setOpenCalendarModal(!openCalendarModal);
          if (value === 'all') onCancel();
          if (value === 'thisMonth') getMonthDateRange();
          if (value === 'lastMonth') getLastMonthDateRange();
        }}
      />
      {openCalendarModal ? (
        <div className="pw-absolute pw-top-9 pw-w-full pw-z-20">
          <CustomDatePicker
            type={pickerType}
            selectedDate={selectedDateValue}
            onChangeSelectedDate={handleDateChange}
            minDate={minDate}
            language={i18n.language || 'pt-BR'}
            onClose={handleClose}
          />
        </div>
      ) : null}
    </div>
  );
};
