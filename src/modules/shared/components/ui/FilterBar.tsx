import { ReactNode } from 'react';

import classNames from 'classnames';

import { UI } from './tokens';

export interface FilterBarProps {
  children: ReactNode;
  /** Right-aligned content (e.g. "Clear filters"). */
  trailing?: ReactNode;
  /** Render without the card chrome. */
  bare?: boolean;
  className?: string;
}

/** Card that lines up a page's filters (segmented control, selects, search). */
export const FilterBar = ({ children, trailing, bare, className }: FilterBarProps) => (
  <div
    className={classNames(
      'pw-flex pw-flex-wrap pw-items-center pw-gap-2',
      !bare && classNames(UI.card, 'pw-px-4 pw-py-3'),
      className
    )}
  >
    {children}
    {trailing ? <div className="pw-ml-auto pw-flex pw-items-center pw-gap-2">{trailing}</div> : null}
  </div>
);

export interface FilterChipOption<T extends string> {
  value: T;
  label: ReactNode;
}

export interface FilterChipsProps<T extends string> {
  options: ReadonlyArray<FilterChipOption<T>>;
  value: ReadonlyArray<T> | T;
  onToggle: (value: T) => void;
  ariaLabel?: string;
  className?: string;
}

/**
 * Horizontally scrollable chips; single- or multi-select depending on the
 * shape of `value`. The mobile counterpart of selects and multi-selects.
 */
export function FilterChips<T extends string>({
  options,
  value,
  onToggle,
  ariaLabel,
  className,
}: FilterChipsProps<T>) {
  const selected = new Set(Array.isArray(value) ? value : [value]);
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={classNames(
        'pw-flex pw-gap-1.5 pw-overflow-x-auto pw-max-w-full pw-pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:pw-hidden',
        className
      )}
    >
      {options.map((option) => {
        const on = selected.has(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(option.value)}
            className={classNames(
              'pw-inline-flex pw-items-center pw-h-7 pw-px-3 pw-rounded-full pw-border pw-text-[12px] pw-font-medium pw-whitespace-nowrap pw-shrink-0 pw-transition-colors',
              UI.focusRing,
              on
                ? 'pw-bg-brand-primary pw-border-brand-primary pw-text-white'
                : 'pw-bg-white pw-border-[#E6E8EC] pw-text-[#4A5567] hover:pw-border-[#C5C9D1]'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
