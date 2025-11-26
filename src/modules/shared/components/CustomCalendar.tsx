'use client';

import { useMemo, useEffect, useCallback, useState } from 'react';
import ReactDatePicker, { ReactDatePickerCustomHeaderProps, registerLocale, setDefaultLocale } from 'react-datepicker';
import { ptBR, enUS } from 'date-fns/locale';
import { format, getMonth, getYear } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import useTranslation from '../hooks/useTranslation';
import { BaseSelect } from './BaseSelect';
import XIcon from '../assets/icons/xFilled.svg';
import ChevronLeftIcon from '../assets/icons/chevronLeftFilled.svg';

/* registerLocale("en", enUS);
registerLocale("ptBR", ptBR); */

export type PickerType = 'unique' | 'range';

export interface CustomCalendarProps {
  type?: PickerType; // default = "unique"
  minDate?: Date;
  maxDate?: Date;
  isPastSelect?: boolean; // se true, bloquear datas anteriores a hoje
  className?: string;
  // quando type = "unique": Date | null
  // quando type = "range": [Date | null, Date | null] | null
  selectedDate: Date | [Date | null, Date | null] | null;
  onChangeSelectedDate: (
    value: Date | [Date | null, Date | null] | null
  ) => void;
  language: string;
  onClose: () => void; // callback para fechar o calendário
}

// Tipos de compatibilidade
export type DateValueSingle = Date | null;
export type DateValueRange = { startDate: Date | null; endDate: Date | null } | null;
export type CustomDatePickerType = PickerType;
export type CustomCalendarType = CustomCalendarProps;

const normalizeDate = (date: Date | null | undefined): Date | null => {
  if (!date) return null;
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const normalizeStartDate = (date: Date | null | undefined): Date | null => {
  if (!date) return null;
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const normalizeEndDate = (date: Date | null | undefined): Date | null => {
  if (!date) return null;
  const normalized = new Date(date);
  normalized.setHours(23, 59, 59, 999);
  return normalized;
};

const getToday = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const compareDates = (a: Date, b: Date): number => {
  return a.getTime() - b.getTime();
};

export const CustomCalendar = ({
  type = 'unique',
  minDate,
  maxDate,
  isPastSelect = false,
  className = '',
  selectedDate,
  onChangeSelectedDate,
  language,
  onClose,
}: CustomCalendarProps) => {
  const today = useMemo(() => getToday(), []);
  const [translate] = useTranslation();

  // Estado temporário para range (só aplicado ao confirmar)
  const [tempRange, setTempRange] = useState<[Date | null, Date | null] | null>(
    type === 'range' ? (selectedDate as [Date | null, Date | null] | null) : null
  );

  // Estado temporário para single date (só aplicado ao confirmar)
  const [tempSingleDate, setTempSingleDate] = useState<Date | null>(
    type === 'unique' ? (selectedDate as Date | null) : null
  );

  // Sincroniza o estado temporário quando selectedDate mudar externamente
  useEffect(() => {
    if (type === 'range') {
      setTempRange(selectedDate as [Date | null, Date | null] | null);
    } else if (type === 'unique') {
      setTempSingleDate(selectedDate as Date | null);
    }
  }, [selectedDate, type]);

  // Estilos globais do calendário (aprox. da 2ª imagem)
  useEffect(() => {
    const styleId = 'react-datepicker-custom-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .react-datepicker {
          font-family: inherit;
          font-size: 0.875rem;
          border: none;
          background-color: transparent;
        }
        .react-datepicker__month-container {
          float: none;
          width: 100%;
        }
        .react-datepicker__header {
          background-color: transparent;
          border: none;
          padding: 0 0 1rem 0;
          margin-bottom: 0.5rem;
        }
        .react-datepicker__day-names {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .react-datepicker__day-name {
          color: #64748b;
          width: 2.25rem;
          text-align: center;
          font-size: 0.75rem;
          font-weight: 400;
        }
        .react-datepicker__week {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }
        .react-datepicker__day {
          color: #0f172a;
          width: 2.25rem;
          height: 2.25rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background-color 0.15s ease, color 0.15s ease;
        }
        .react-datepicker__day:hover:not(.react-datepicker__day--disabled) {
          background-color: #f1f5f9;
        }
        .react-datepicker__day--disabled {
          color: #cbd5e1;
          cursor: not-allowed;
        }
        .react-datepicker__day--outside-month {
          color: #cbd5e1;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--in-range,
        .react-datepicker__day--in-selecting-range {
          background-color: #8BAEE2;
          color: #0D2557;
        }
        .react-datepicker__day--range-start,
        .react-datepicker__day--range-end {
          background-color: #d4d4d8;
          color: #0f172a;
          font-weight: 500;
        }
        .react-datepicker__sr-only {
          display: none;
        }
        .react-datepicker__aria-live {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      const style = document.getElementById(styleId);
      if (style) style.remove();
    };
  }, []);

  const resolvedMinDate = useMemo(() => {
    const normalizedMin = normalizeDate(minDate);

    if (!isPastSelect) {
      return normalizedMin || undefined;
    }

    // Se isPastSelect é true, o minDate deve ser pelo menos hoje
    if (!normalizedMin) {
      return today;
    }

    return compareDates(normalizedMin, today) > 0 ? normalizedMin : today;
  }, [minDate, isPastSelect, today]);

  const resolvedMaxDate = useMemo(
    () => normalizeDate(maxDate) || undefined,
    [maxDate]
  );

  // Filtra datas passadas quando isPastSelect é true e não há minDate
  const filterDate = (date: Date): boolean => {
    if (resolvedMinDate) return true;

    if (isPastSelect) {
      const dateToCheck = normalizeDate(date);
      if (!dateToCheck) return false;
      return dateToCheck.getTime() >= today.getTime();
    }

    return true;
  };

  // Header custom para ficar parecido com a 2ª imagem
  const years = useMemo(() => {
    const currentYear = getYear(today);
    const start = currentYear - 10;
    const end = currentYear + 10;
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [today]);

  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) =>
        format(new Date(2020, i, 1), 'MMMM', { locale: language === 'pt-BR' ? ptBR : enUS })
      ),
    [language]
  );

  const renderHeader = (props: ReactDatePickerCustomHeaderProps) => {
    const {
      date,
      decreaseMonth,
      increaseMonth,
      changeYear,
      changeMonth,
      prevMonthButtonDisabled,
      nextMonthButtonDisabled,
    } = props;

    return (
      <div className="pw-flex pw-flex-col pw-gap-3 pw-mb-4">
        <div className="pw-flex pw-justify-end">
          <button
            type="button"
            onClick={onClose}
            className="pw-flex pw-items-center pw-justify-center pw-rounded-full"
            aria-label="Fechar calendário"
          >
            <XIcon style={{ fill: "#5682C3" }} className="pw-w-3 pw-h-3" />
          </button>
        </div>
        <div className="pw-flex pw-items-center pw-justify-between pw-relative">
          <button
            type="button"
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            className="pw-flex pw-items-center pw-justify-center"
            aria-label="Mês anterior"
          >
            <ChevronLeftIcon className="pw-w-4 pw-h-4" />
          </button>

          <div className="pw-flex pw-items-center pw-justify-center pw-gap-2">
            <div className="pw-flex-1">

              <BaseSelect
                value={getMonth(date)}
                className="!pw-outline-none !pw-border-none"
                onChangeValue={(e) => changeMonth(Number(e))}
                options={months.map((month, index) => ({ value: index, label: month as string }))}
                classes={{ root: 'pw-w-full', rootSize: '!pw-min-w-[150px]' }}
              />
            </div>
            <BaseSelect
              className="!pw-w-[80px] !pw-min-w-[80px] !pw-outline-none !pw-border-none"
              value={getYear(date)}
              onChangeValue={(e) => changeYear(Number(e))}
              options={years.map((year) => ({ value: year, label: year.toString() as string }))}
              classes={{ rootSize: '!pw-w-[80px] !pw-min-w-[80px]', input: '!pw-outline-none !pw-border-none' }}
            />
          </div>

          <button
            type="button"
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            className="pw-flex pw-items-center pw-justify-center"
            aria-label="Próximo mês"
          >
            <ChevronLeftIcon className="pw-w-4 pw-h-4 pw-rotate-180" />
          </button>
        </div>

      </div>
    );
  };

  // Handlers
  const handleSingleDateChange = useCallback(
    (date: Date | null) => {
      setTempSingleDate(date);
    },
    []
  );

  const handleConfirmSingle = useCallback(() => {
    // Aplica a data temporária ao estado externo
    onChangeSelectedDate(tempSingleDate);
    onClose();
  }, [tempSingleDate, onChangeSelectedDate, onClose]);

  const handleCancelSingle = useCallback(() => {
    // Limpa o estado temporário e externo
    setTempSingleDate(null);
    onChangeSelectedDate(null);
    onClose();
  }, [onChangeSelectedDate, onClose]);

  const handleRangeDateChange = useCallback(
    (dates: [Date | null, Date | null] | null) => {
      // Atualiza apenas o estado temporário, não o estado externo
      setTempRange(dates || [null, null]);
    },
    []
  );

  const handleConfirmRange = useCallback(() => {
    // Normaliza as datas: inicial com 00:00:00 e final com 23:59:59
    if (tempRange) {
      const [startDate, endDate] = tempRange;
      const normalizedRange: [Date | null, Date | null] = [
        normalizeStartDate(startDate),
        normalizeEndDate(endDate),
      ];
      onChangeSelectedDate(normalizedRange);
    } else {
      onChangeSelectedDate([null, null]);
    }
    onClose();
  }, [tempRange, onChangeSelectedDate, onClose]);

  const handleCancelRange = useCallback(() => {
    // Limpa o estado temporário e externo
    setTempRange([null, null]);
    onChangeSelectedDate([null, null]);
    onClose();
  }, [onChangeSelectedDate, onClose]);



  const calendarContent = useMemo(() => {
    const currentLocale = language === 'pt-BR' ? ptBR : enUS;

    if (type === 'range') {
      const [startDate, endDate] = tempRange || [null, null];

      return (
        <div className="pw-bg-white pw-w-full pw-p-2 pw-z-10 pw-rounded-lg">
          <ReactDatePicker
            inline
            selected={startDate}
            onChange={handleRangeDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            minDate={resolvedMinDate}
            maxDate={resolvedMaxDate}
            filterDate={filterDate}
            locale={language === 'pt-BR' ? ptBR : enUS}
            dateFormat="dd/MM/yyyy"
            calendarClassName="pw-w-full"
            renderCustomHeader={renderHeader}
            formatWeekDay={(dayName) => dayName.substring(0, 3)}
            dayNamesHeader
          />

          <div className="pw-flex pw-gap-3 pw-mt-6">
            <button
              type="button"
              onClick={handleCancelRange}
              aria-label="Cancelar seleção"
              className="pw-flex-1 pw-border pw-border-[#0050FF] pw-text-[#0050FF] pw-bg-white pw-rounded-[8px] pw-py-2.5 pw-px-4 pw-font-medium pw-text-sm hover:pw-bg-[#F5F8FF] focus:pw-outline-none focus:pw-ring-2 focus:pw-ring-[#0050FF] focus:pw-ring-offset-2 transition-colors"
            >
              {translate('shared>customCalendar>clear')}
            </button>
            <button
              type="button"
              onClick={handleConfirmRange}
              aria-label="Confirmar seleção"
              className="pw-flex-1 pw-bg-[#0050FF] pw-text-white pw-rounded-[8px] pw-py-2.5 pw-px-4 pw-font-medium pw-text-sm hover:pw-bg-[#0034A3] focus:pw-outline-none focus:pw-ring-2 focus:pw-ring-[#0050FF] focus:pw-ring-offset-2 transition-colors"
            >
              {translate('shared>myProfile>confirm')}
            </button>
          </div>
        </div>
      );
    }

    // SINGLE
    return (
      <div className="pw-bg-white pw-w-full pw-p-2 pw-z-10 pw-rounded-lg">
        <ReactDatePicker
          inline
          selected={tempSingleDate}
          onChange={handleSingleDateChange}
          minDate={resolvedMinDate}
          maxDate={resolvedMaxDate}
          filterDate={filterDate}
          calendarClassName="pw-w-full"
          renderCustomHeader={renderHeader}
          locale={currentLocale}
        />

        <div className="pw-flex pw-gap-3 pw-mt-6">
          <button
            type="button"
            onClick={handleCancelSingle}
            aria-label="Cancelar seleção"
            className="pw-flex-1 pw-border pw-border-[#0050FF] pw-text-[#0050FF] pw-bg-white pw-rounded-[8px] pw-py-2.5 pw-px-4 pw-font-medium pw-text-sm hover:pw-bg-[#F5F8FF] focus:pw-outline-none focus:pw-ring-2 focus:pw-ring-[#0050FF] focus:pw-ring-offset-2 transition-colors"
          >
            {translate('shared>customCalendar>clear')}
          </button>
          <button
            type="button"
            onClick={handleConfirmSingle}
            aria-label="Confirmar seleção"
            className="pw-flex-1 pw-bg-[#0050FF] pw-text-white pw-rounded-[8px] pw-py-2.5 pw-px-4 pw-font-medium pw-text-sm hover:pw-bg-[#0034A3] focus:pw-outline-none focus:pw-ring-2 focus:pw-ring-[#0050FF] focus:pw-ring-offset-2 transition-colors"
          >
            {translate('shared>myProfile>confirm')}
          </button>
        </div>
      </div>
    );
  }, [
    type,
    language,
    selectedDate,
    tempRange,
    tempSingleDate,
    resolvedMinDate,
    resolvedMaxDate,
    filterDate,
    handleSingleDateChange,
    handleRangeDateChange,
    handleConfirmSingle,
    handleCancelSingle,
    handleConfirmRange,
    handleCancelRange,
    renderHeader,
    onChangeSelectedDate,
    onClose,
  ]);

  return calendarContent;
};

export default CustomCalendar;
