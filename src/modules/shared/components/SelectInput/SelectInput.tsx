import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useClickAway } from 'react-use';

import classNames from 'classnames';

import ArrowDown from '../../assets/icons/arrowDown.svg?react';

interface SelectInputProps {
  options: { value: string; label: string }[];
  selected: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  isTranslatable?: boolean;
  translatePrefix?: string;
}

export const Selectinput = ({
  options,
  selected,
  onChange,
  className = '',
  placeholder,
  disabled,
  isTranslatable,
  translatePrefix,
}: SelectInputProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(ref, () => setIsOpened(false));
  const [isOpened, setIsOpened] = useState(false);
  const [translate] = useTranslation();
  return (
    <div ref={ref} className={` ${className}`}>
      <div
        onClick={() => setIsOpened(!isOpened)}
        className={classNames(
          'pw-flex pw-w-full pw-p-3 pw-justify-between pw-items-center pw-rounded-lg pw-border pw-border-slate-300 pw-bg-white',
          disabled ? 'pw-opacity-50' : ''
        )}
      >
        <p className="pw-text-sm pw-text-slate-800">
          {selected == ''
            ? placeholder
              ? placeholder
              : options[0].label
            : isTranslatable
            ? translate(
                `${translatePrefix || ''}${
                  options.find((opt) => opt.value == selected)?.label
                }`
              )
            : options.find((opt) => opt.value == selected)?.label}
        </p>
        <ArrowDown className="pw-stroke-slate-600" />
      </div>
      {isOpened && !disabled && (
        <div className="pw-relative  pw-h-full">
          <div className="pw-absolute pw-max-h-[200px] pw-overflow-auto pw-bg-white pw-z-10 pw-bg-white pw-border pw-border-slate-300 pw-rounded-lg pw-w-full pw-mt-1">
            {options.map((option) => (
              <div
                key={option.value}
                className="pw-p-3 pw-text-sm pw-text-slate-800 pw-cursor-pointer hover:pw-bg-slate-100"
                onClick={() => {
                  onChange(option.value);
                  setIsOpened(false);
                }}
              >
                {isTranslatable
                  ? translate(`${translatePrefix || ''}${option.label}`)
                  : option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
