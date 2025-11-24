/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useMemo } from 'react';
import { useClickAway } from 'react-use';
import { format } from 'date-fns';

import ArrowDown from '../assets/icons/arrowDown.svg';

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
  const ref = useRef<HTMLDivElement>(null);

  const [openCalendarModal, setOpenCalendarModal] = useState(false);
  useClickAway(ref, () => setOpenCalendarModal(false));

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

  const handleCancel = () => {
    if (pickerType === 'range') {
      onChangeStartDate?.(null);
      onChangeEndDate?.(null);
    } else {
      // onSelectDate não é chamado no cancel, apenas limpa via onCancel
    }
    onCancel();
    setOpenCalendarModal(false);
  };

  const renderPlaceholder = () => {
    if (typeOfCalendar === CalendarType.INTERVAL) {
      if (startDate && endDate) {
        const formatedInitDate = format(new Date(startDate), 'dd MMM yyyy');
        const formatedEndDate = format(new Date(endDate), 'dd MMM yyyy');
        return `${formatedInitDate} - ${formatedEndDate}`;
      } else {
        return placeholder
          ? placeholder
          : translate('contractDetails>RoyaltiesArea>date');
      }
    } else if (typeOfCalendar === CalendarType.SINGLE) {
      if (selectedDate) {
        return selectedDate.toLocaleDateString();
      } else {
        return placeholder
          ? placeholder
          : translate('contractDetails>RoyaltiesArea>date');
      }
    } else {
      return translate('contractDetails>RoyaltiesArea>date');
    }
  };

  return (
    <div className="pw-relative pw-flex pw-w-full pw-h-11 pw-flex-col pw-items-center pw-justify-center pw-gap-x-2 pw-bg-white pw-border pw-border-slate-300 pw-px-4 pw-rounded-lg sm:pw-max-w-[350px]">
      <button
        className="pw-w-full pw-items-center pw-flex pw-justify-between pw-text-sm"
        onClick={() => setOpenCalendarModal(!openCalendarModal)}
      >
        {renderPlaceholder()}
        <ArrowDown className="pw-stroke-[#5682C3] pw-stroke-[3px]" />
      </button>
      {openCalendarModal ? (
        <div
          ref={ref}
          className="pw-absolute pw-top-9 pw-min-w-[300px] pw-w-full pw-z-50"
        >
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
