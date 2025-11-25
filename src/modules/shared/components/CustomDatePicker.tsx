'use client';

import { useMemo, useState } from 'react';

import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { Popover } from '@mui/material';

import CalendarIcon from '../assets/icons/calendarIcon.svg';
import { BaseInput } from './BaseInput';
import { CustomCalendar } from './CustomCalendar';
import { PickerType } from './CustomCalendar';

export interface CustomDatePickerProps {
  type?: PickerType; // default = "unique"
  minDate?: Date;
  maxDate?: Date;
  isPastSelect?: boolean;
  className?: string;
  // quando type = "unique": Date | null
  // quando type = "range": [Date | null, Date | null] | null
  selectedDate: Date | [Date | null, Date | null] | null;
  onChangeSelectedDate: (
    value: Date | [Date | null, Date | null] | null
  ) => void;
  language?: string;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  valid?: boolean;
  variant?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  readonly?: boolean;
}

export const CustomDatePicker = ({
  type = 'unique',
  minDate,
  maxDate,
  isPastSelect = false,
  className = '',
  selectedDate,
  onChangeSelectedDate,
  language = 'pt-BR',
  placeholder,
  disabled = false,
  invalid = false,
  valid = false,
  variant = 'medium',
  fullWidth = false,
  readonly = false,
}: CustomDatePickerProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled && !readonly) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const formatDisplayValue = useMemo(() => {
    if (!selectedDate) return '';

    if (type === 'range') {
      const range = selectedDate as [Date | null, Date | null] | null;
      if (range && range[0] && range[1]) {
        const locale = language === 'pt-BR' ? ptBR : enUS;
        const startFormatted = format(range[0], 'dd/MM/yyyy', { locale });
        const endFormatted = format(range[1], 'dd/MM/yyyy', { locale });
        return `${startFormatted} - ${endFormatted}`;
      } else if (range && range[0]) {
        const locale = language === 'pt-BR' ? ptBR : enUS;
        return format(range[0], 'dd/MM/yyyy', { locale });
      }
      return '';
    } else {
      const singleDate = selectedDate as Date | null;
      if (singleDate) {
        const locale = language === 'pt-BR' ? ptBR : enUS;
        return format(singleDate, 'dd/MM/yyyy', { locale });
      }
      return '';
    }
  }, [selectedDate, type, language]);

  const displayPlaceholder = useMemo(() => {
    if (placeholder) return placeholder;
    
    if (type === 'range') {
      return language === 'pt-BR' ? 'Selecione um período' : 'Select a period';
    } else {
      return language === 'pt-BR' ? 'Selecione uma data' : 'Select a date';
    }
  }, [placeholder, type, language]);

  const popoverWidth = useMemo(() => {
    if (type === 'unique' && anchorEl) {
      return anchorEl.offsetWidth;
    }
    return undefined;
  }, [type, anchorEl]);

  return (
    <div 
      className={`pw-relative ${fullWidth ? 'pw-w-full' : ''} ${className} ${disabled ? 'pw-opacity-80' : ''}`}
      style={disabled ? { filter: 'grayscale(100%)' } : undefined}
    >
      <div className="pw-w-full" onClick={handleClick}>
        <BaseInput
          value={formatDisplayValue}
          placeholder={displayPlaceholder}
          disabled={disabled}
          invalid={invalid}
          valid={valid}
          variant={variant}
          fullWidth={fullWidth}
          readonly={readonly}
          searchIcon
          customIcon={<></>}
          button={{
            icon: <CalendarIcon className="pw-stroke-black pw-w-4 pw-h-4" />,
            onClick: () => {},
          }}
          className={`pw-h-8 ${disabled ? '' : 'pw-cursor-pointer'}`}
          readOnly
        />
      </div>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            className: 'pw-shadow-lg pw-rounded-lg pw-overflow-hidden',
            style: popoverWidth ? { width: `${popoverWidth}px` } : undefined,
          },
        }}
      >
        <div className="pw-z-50">
          <CustomCalendar
            type={type}
            minDate={minDate}
            maxDate={maxDate}
            isPastSelect={isPastSelect}
            selectedDate={selectedDate}
            onChangeSelectedDate={onChangeSelectedDate}
            language={language}
            onClose={handleClose}
          />
        </div>
      </Popover>
    </div>
  );
};

export default CustomDatePicker;
