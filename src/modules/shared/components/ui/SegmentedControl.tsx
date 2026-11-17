import { ReactNode } from 'react';

import classNames from 'classnames';

import { UI } from './tokens';

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  count?: number;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string> {
  options: ReadonlyArray<SegmentedOption<T>>;
  value: T;
  onChange: (value: T) => void;
  /** Stretch to the container width (default on mobile). */
  fullWidth?: boolean;
  ariaLabel?: string;
  className?: string;
}

/**
 * Up to three or four short options. For more, use `FilterChips`.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  fullWidth,
  ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={classNames(
        'pw-inline-flex pw-items-stretch pw-gap-0.5 pw-rounded-lg pw-p-[3px] pw-max-w-full',
        UI.surfaceGrey,
        fullWidth ? 'pw-flex pw-w-full' : '',
        className
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className={classNames(
              'pw-inline-flex pw-items-center pw-justify-center pw-gap-1 pw-h-[30px] pw-px-3 pw-rounded-md pw-text-[12.5px] pw-font-medium pw-whitespace-nowrap pw-min-w-0 pw-transition-colors',
              UI.focusRing,
              fullWidth ? 'pw-flex-1 pw-px-1' : '',
              selected
                ? 'pw-bg-white pw-text-[#0F1729] pw-shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                : 'pw-text-[#4A5567] hover:pw-text-[#0F1729]',
              option.disabled ? 'pw-opacity-50 pw-cursor-not-allowed' : ''
            )}
          >
            <span className="pw-truncate">{option.label}</span>
            {typeof option.count === 'number' ? (
              <span
                className={classNames(
                  'pw-text-[10.5px] pw-tabular-nums',
                  selected ? 'pw-text-[#6B7280]' : 'pw-text-[#8B93A3]'
                )}
              >
                {option.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
