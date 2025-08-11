import { useEffect, useState } from 'react';

import classNames from 'classnames';
import { isAfter, isValid, parse } from 'date-fns';

import DeleteIcon from '../../../../shared/assets/icons/x-circle.svg?react';
import LabelWithRequired from '../../../../shared/components/LabelWithRequired';
import useTranslation from '../../../../shared/hooks/useTranslation';

interface TimeItemProps {
  index: number;
  start: string;
  end: string;
  onUpdateItem: (
    index: number,
    newItem: { start: string; end: string }
  ) => void;
  onDeleteItem: (index: number) => void;
  isChangePanelItems?: boolean;
}

const isValidTime = (time: string) => {
  // Expected format HH:mm
  const date = parse(time, 'HH:mm', new Date());
  return isValid(date) && /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
};

const isEndTimeAfterStartTime = (startTime: string, endTime: string) => {
  const start = parse(startTime, 'HH:mm', new Date());
  const end = parse(endTime, 'HH:mm', new Date());
  return isAfter(end, start);
};

export const TimeItem = ({
  index,
  start,
  end,
  onUpdateItem,
  onDeleteItem,
  isChangePanelItems = true,
}: TimeItemProps) => {
  const [translate] = useTranslation();
  const [isValid, setIsValid] = useState(true);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;

    if (isValidTime(newStart)) {
      onUpdateItem(index, { start: `${newStart}`, end });
    }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;

    onUpdateItem(index, { start, end: `${newEnd}` });
  };

  useEffect(() => {
    if (start && end) {
      setIsValid(isEndTimeAfterStartTime(start, end));
    }
  }, [start, end]);

  return (
    <div className="pw-w-full">
      <div className="pw-flex pw-w-full pw-gap-x-4 pw-mt-4">
        <div className="pw-w-full">
          <LabelWithRequired>
            {translate('pass>timeItem>start')}
          </LabelWithRequired>
          <input
            className={classNames(
              '!pw-outline-none  pw-w-full  pw-rounded-lg  !pw-text-sm !pw-leading-4 !pw-bg-transparent pw-mb-2',
              isChangePanelItems
                ? 'pw-border-[#94B8ED] pw-border pw-px-4 !pw-h-[48px] !pw-text-[#969696]'
                : 'pw-border-none pw-text-slate-700'
            )}
            type="time"
            value={start}
            disabled={!isChangePanelItems}
            onChange={handleStartChange}
          />
        </div>
        <div className="pw-w-full">
          <LabelWithRequired>
            {translate('pass>timeItem>end')}
          </LabelWithRequired>
          <input
            className={classNames(
              '!pw-outline-none  pw-w-full  pw-rounded-lg !pw-text-sm !pw-leading-4 !pw-bg-transparent pw-mb-2',
              isChangePanelItems
                ? 'pw-border-[#94B8ED] pw-border pw-px-4 !pw-h-[48px] !pw-text-[#969696]'
                : 'pw-border-none pw-text-slate-700'
            )}
            type="time"
            min={start}
            disabled={!isChangePanelItems}
            value={end}
            onChange={handleEndChange}
          />
        </div>
        {isChangePanelItems ? (
          <button onClick={() => onDeleteItem(index)}>
            <DeleteIcon className="pw-w-5 pw-h-5 pw-stroke-red-500" />
          </button>
        ) : null}
      </div>
      {!isValid && (
        <p className="pw-text-red-600 pw-font-semibold text-sm">
          {translate('pass>timeItem>invalidTime')}
        </p>
      )}
    </div>
  );
};
