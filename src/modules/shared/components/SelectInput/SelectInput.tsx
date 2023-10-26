import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';

import ArrowDown from '../../assets/icons/arrowDown.svg?react';

interface SelectInputProps {
  options: { value: string; label: string }[];
  selected: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Selectinput = ({
  options,
  selected,
  onChange,
  className = '',
}: SelectInputProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(ref, () => setIsOpened(false));
  const [isOpened, setIsOpened] = useState(false);
  return (
    <div ref={ref} className={` ${className}`}>
      <div
        onClick={() => setIsOpened(!isOpened)}
        className="pw-flex pw-w-full pw-p-3 pw-justify-between pw-items-center pw-rounded-lg pw-border pw-border-slate-300 pw-bg-white"
      >
        <p className="pw-text-sm pw-text-slate-800">
          {selected == ''
            ? options[0].label
            : options.find((opt) => opt.value == selected)?.label}
        </p>
        <ArrowDown className="pw-stroke-slate-600" />
      </div>
      {isOpened && (
        <div className="pw-relative">
          <div className="pw-absolute pw-bg-white pw-border pw-border-slate-300 pw-rounded-lg pw-w-full pw-mt-1">
            {options.map((option) => (
              <div
                key={option.value}
                className="pw-p-3 pw-text-sm pw-text-slate-800 pw-cursor-pointer hover:pw-bg-slate-100"
                onClick={() => {
                  onChange(option.value);
                  setIsOpened(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
