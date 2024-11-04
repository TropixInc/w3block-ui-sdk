import { useTranslation } from 'react-i18next';

import classNames from 'classnames';

import DeleteIcon from '../../../../../shared/assets/icons/x-circle.svg?react';
import LabelWithRequired from '../../../../../shared/components/LabelWithRequired';

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

export const TimeItem = ({
  index,
  start,
  end,
  onUpdateItem,
  onDeleteItem,
  isChangePanelItems = true,
}: TimeItemProps) => {
  const [translate] = useTranslation();

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;

    if (newStart > end) {
      onUpdateItem(index, { start: `${newStart}:00`, end: `${newStart}:00` });
    } else {
      onUpdateItem(index, { start: `${newStart}:00`, end: `${end}:00` });
    }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;

    if (newEnd >= start) {
      onUpdateItem(index, { start, end: `${newEnd}:00` }); // Atualiza apenas se for válido
    } else {
      null;
    }
  };

  return (
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
        <LabelWithRequired>{translate('pass>timeItem>end')}</LabelWithRequired>
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
  );
};
