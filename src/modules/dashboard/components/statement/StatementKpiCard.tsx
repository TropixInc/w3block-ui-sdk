import classNames from 'classnames';

import { Spinner } from '../../../shared/components/Spinner';

interface Props {
  label: string;
  value: string;
  currency?: string;
  hint?: string;
  loading?: boolean;
  tone?: 'default' | 'positive' | 'accent';
  /** Marca "*" de dado simulado ao lado do rótulo. */
  isMock?: boolean;
  mockHint?: string;
  className?: string;
}

/** Card de resumo das telas de Extrato e Lançamentos futuros. */
export const StatementKpiCard = ({
  label,
  value,
  currency,
  hint,
  loading,
  tone = 'default',
  isMock,
  mockHint,
  className,
}: Props) => (
  <div
    className={classNames(
      'pw-flex pw-flex-col pw-gap-1.5 pw-rounded-[10px] pw-bg-white pw-p-4 pw-shadow-[0_2px_8px_rgba(0,0,0,.06)]',
      tone === 'accent' ? '!pw-bg-[#F5F9FF]' : '',
      className
    )}
  >
    <span
      className={classNames(
        'pw-text-[11px] pw-font-semibold pw-uppercase pw-tracking-[.04em]',
        tone === 'accent' ? 'pw-text-[#2f6fd0]' : 'pw-text-[#6b7280]'
      )}
    >
      {label}
      {isMock ? (
        <span
          className="pw-ml-1 pw-text-[#9a6508] pw-font-bold"
          title={mockHint}
        >
          *
        </span>
      ) : null}
    </span>
    {loading ? (
      <Spinner className="pw-h-5 pw-w-5 !pw-border-2" />
    ) : (
      <span
        className={classNames(
          'pw-text-[22px] sm:pw-text-[24px] pw-font-bold pw-leading-tight',
          tone === 'positive' ? 'pw-text-[#0b7a55]' : 'pw-text-[#0f1729]'
        )}
      >
        {value}
        {currency ? (
          <span className="pw-ml-1 pw-text-[12px] pw-font-normal pw-text-[#6b7280]">
            {currency}
          </span>
        ) : null}
      </span>
    )}
    {hint ? (
      <span className="pw-text-[12px] pw-text-[#6b7280]">{hint}</span>
    ) : null}
  </div>
);
