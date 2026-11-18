import classNames from 'classnames';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}

/** Controle segmentado com botões reais (Agendados / Recebidos / Todos). */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: Props<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={classNames(
        'pw-inline-flex pw-w-full sm:pw-w-auto pw-rounded-lg pw-bg-[#f1f3f6] pw-p-[3px] pw-gap-[2px]',
        className
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={classNames(
              'pw-flex-1 sm:pw-flex-none pw-h-[36px] sm:pw-h-[32px] pw-px-3.5 pw-rounded-md pw-text-[13px] pw-font-medium pw-border-0 pw-cursor-pointer pw-transition-colors',
              active
                ? 'pw-bg-white pw-text-[#0f1729] pw-shadow-[0_1px_3px_rgba(0,0,0,.08)]'
                : 'pw-bg-transparent pw-text-[#4a5567] hover:pw-text-[#0f1729]'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
