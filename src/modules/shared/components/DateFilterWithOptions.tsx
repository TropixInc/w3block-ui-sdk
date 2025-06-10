/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

import { format } from 'date-fns';



import { useTranslation } from 'react-i18next';
import { BaseButton } from './Buttons';
import Calendar, { CalendarType } from './Calendar';
import { SelectInput } from './SelectInput';


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
  const [translate] = useTranslation();
  const [openCalendarModal, setOpenCalendarModal] = useState(false);

  const [isSelectingInterval, setIsSelectingInterval] = useState(false);
  const [startInterval, setStartInterval] = useState<Date | undefined>(
    undefined
  );
  const [endInterval, setEndInterval] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (!startDate) {
      setStartInterval(undefined);
    }
    if (!endDate) {
      setEndInterval(undefined);
    }
  }, [endDate, startDate]);

  const formatedInitDate =
    startInterval && format(new Date(startInterval), 'dd MMM yyyy');

  const formatedEndDate =
    endInterval && format(new Date(endInterval), 'dd MMM yyyy');

  const handleSelectDate = () => {
    onChangeStartDate && startInterval && onChangeStartDate(startInterval);
    onChangeEndDate && endInterval && onChangeEndDate(endInterval);
    setOpenCalendarModal(false);
  };

  const handleCancelSelectDate = () => {
    setStartInterval && setStartInterval(undefined);
    setEndInterval && setEndInterval(undefined);
    onCancel();
    setOpenCalendarModal(false);
  };

  const renderPlaceholder = () => {
    if (typeOfCalendar === CalendarType.INTERVAL) {
      if (startInterval && endInterval) {
        return `${formatedInitDate} - ${isSelectingInterval ? '' : formatedEndDate
          }`;
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
    const lastDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      1,
      0,
      0,
      0,
      -1
    );
    onChangeStartDate && onChangeStartDate(firstDay);
    onChangeEndDate && onChangeEndDate(lastDay);
  };

  const getLastMonthDateRange = () => {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    const lastDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      1,
      0,
      0,
      0,
      -1
    );
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
          if (value !== 'custom') {
            setStartInterval(undefined);
            setEndInterval(undefined);
          }
        }}
      />
      {openCalendarModal ? (
        <div className="pw-absolute pw-top-9 pw-w-full pw-z-20 pw-bg-white pw-px-4 pw-py-5 pw-shadow-[0px_4px_15px_#00000011] pw-border pw-border-[#B9D1F3] pw-rounded-lg">
          <Calendar
            isSelectingInterval={isSelectingInterval}
            canSelectPastDay
            setIsSelectingInterval={setIsSelectingInterval}
            defaultDate={defaultDate}
            onChangeMonth={onChangeDefaultDate}
            onSelectDate={onSelectDate}
            selectedDate={selectedDate}
            selectionType={typeOfCalendar}
            intervalStart={new Date(startInterval ?? '')}
            intervalEnd={new Date(endInterval ?? '')}
            setIntervalStart={(data) =>
              setStartInterval && setStartInterval(data)
            }
            setIntervalEnd={(data) => setEndInterval && setEndInterval(data)}
            minCalendarDate={minDate}
          />
          <div className="pw-w-full pw-flex pw-gap-x-2 pw-justify-between pw-mt-1">
            <BaseButton
              variant="outlined"
              className="pw-w-full pw-h-9 pw-flex pw-items-center pw-justify-center"
              onClick={() => handleCancelSelectDate()}
            >
              <p className="pw-text-sm pw-text-[#8BAEE2] pw-font-semibold">
                {translate('components>cancelButton>cancel')}
              </p>
            </BaseButton>
            <BaseButton
              variant="filled"
              className="pw-w-full pw-h-9 pw-flex pw-items-center pw-justify-center pw-text-black"
              onClick={() => handleSelectDate()}
            >
              <p className="pw-text-sm pw-font-semibold">
                {translate('shared>myProfile>confirm')}
              </p>
            </BaseButton>
          </div>
        </div>
      ) : null}
    </div>
  );
};
