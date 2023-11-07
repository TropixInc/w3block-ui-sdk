import { getMonth, getYear } from 'date-fns';

import ChevronLeftFilledIcon from '../../assets/icons/chevronLeftFilled.svg?react';
import ChevronRightFilledIcon from '../../assets/icons/chevronRightFilled.svg?react';

interface Props {
  date: Date;
  previousEnabled?: boolean;
  nextEnabled?: boolean;
  previous: () => void;
  next: () => void;
  className?: string;
}

const monthToNameMap: Map<number, string> = new Map([
  [1, 'Janeiro'],
  [2, 'Fevereiro'],
  [3, 'Março'],
  [4, 'Abril'],
  [5, 'Maio'],
  [6, 'Junho'],
  [7, 'Julho'],
  [8, 'Agosto'],
  [9, 'Setembro'],
  [10, 'Outubro'],
  [11, 'Novembro'],
  [12, 'Dezembro'],
]);

const CalendarMenu = ({
  date,
  previous,
  next,
  previousEnabled = false,
  nextEnabled = false,
  className = '',
}: Props) => (
  <div className={`pw-flex pw-justify-between pw-items-center ${className}`}>
    <h2 className="pw-flex pw-items-center pw-text-[#2d3748]">
      <span className="pw-text-sm pw-font-medium pw-leading-normal">
        {monthToNameMap.get(getMonth(date) + 1)} {getYear(date)}
      </span>
    </h2>
    <div className="pw-flex pw-items-center pw-gap-x-2">
      <button
        onClick={previous}
        disabled={!previousEnabled}
        className="pw-p-1.5"
        type="button"
      >
        <ChevronLeftFilledIcon />
      </button>
      <button
        onClick={next}
        disabled={!nextEnabled}
        className="pw-p-1.5"
        type="button"
      >
        <ChevronRightFilledIcon />
      </button>
    </div>
  </div>
);

export default CalendarMenu;
