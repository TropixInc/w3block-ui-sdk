/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

import { format } from 'date-fns';

import { OffpixButtonBase } from '../../../tokens/components/DisplayCards/OffpixButtonBase/OffpixButtonBase';
import ArrowDown from '../../assets/icons/arrowDown.svg?react';
import useTranslation from '../../hooks/useTranslation';
import Calendar, { CalendarType } from '../Calendar/Calendar';

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
        return `${formatedInitDate} - ${
          isSelectingInterval ? '' : formatedEndDate
        }`;
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
    <div className="pw-relative pw-flex pw-w-full pw-h-[46px] pw-flex-col pw-items-center pw-justify-center pw-gap-x-2 pw-bg-white pw-border pw-border-slate-300 pw-px-4 pw-rounded-lg sm:pw-max-w-[350px]">
      <button
        className="pw-w-full pw-items-center pw-flex pw-justify-between pw-text-sm"
        onClick={() => setOpenCalendarModal(!openCalendarModal)}
      >
        {renderPlaceholder()}
        <ArrowDown className="pw-stroke-[#5682C3] pw-stroke-[3px]" />
      </button>
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
            <OffpixButtonBase
              variant="outlined"
              className="pw-w-full pw-h-9 pw-flex pw-items-center pw-justify-center"
              onClick={() => handleCancelSelectDate()}
            >
              <p className="pw-text-sm pw-text-[#8BAEE2] pw-font-semibold">
                {translate('components>cancelButton>cancel')}
              </p>
            </OffpixButtonBase>
            <OffpixButtonBase
              variant="filled"
              className="pw-w-full pw-h-9 pw-flex pw-items-center pw-justify-center"
              onClick={() => handleSelectDate()}
            >
              <p className="pw-text-sm pw-font-semibold">
                {translate('shared>myProfile>confirm')}
              </p>
            </OffpixButtonBase>
          </div>
        </div>
      ) : null}
    </div>
  );
};
