import { ReactNode } from 'react';

import classNames from 'classnames';

import Skeleton from '../Skeleton';
import { Tone, TONE_TEXT, UI } from './tokens';

export interface KpiCardProps {
  label: ReactNode;
  value: ReactNode;
  /** Currency / unit shown after the value in a smaller type. */
  unit?: ReactNode;
  /** One line of context under the value. */
  hint?: ReactNode;
  /** `accent` gives the light-blue background used for the main figure. */
  variant?: 'default' | 'accent';
  /** Colours the value (e.g. `ok` for amounts already received). */
  tone?: Tone;
  loading?: boolean;
  className?: string;
}

export const KpiCard = ({
  label,
  value,
  unit,
  hint,
  variant = 'default',
  tone,
  loading,
  className,
}: KpiCardProps) => (
  <div
    className={classNames(
      UI.card,
      'pw-grid pw-gap-1 pw-px-4 pw-py-3.5 pw-min-w-0',
      variant === 'accent' && UI.surfaceAccent,
      className
    )}
  >
    <span className={UI.label}>{label}</span>
    {loading ? (
      <Skeleton className="pw-h-6 pw-w-24 pw-rounded" />
    ) : (
      <span
        className={classNames(
          'pw-text-[22px] pw-font-semibold pw-leading-none pw-tabular-nums pw-truncate',
          tone ? TONE_TEXT[tone] : UI.text
        )}
      >
        {value}
        {unit ? (
          <small
            className={classNames(
              'pw-text-[11px] pw-font-normal pw-ml-1 pw-align-baseline',
              UI.textMuted
            )}
          >
            {unit}
          </small>
        ) : null}
      </span>
    )}
    {hint ? (
      <span className={classNames('pw-text-[11.5px] pw-leading-snug', UI.textMuted)}>
        {hint}
      </span>
    ) : null}
  </div>
);

/** Responsive row of KPI cards: 2 columns on mobile, auto-fit on desktop. */
export const KpiRow = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={classNames(
      'pw-grid pw-grid-cols-2 sm:pw-grid-cols-[repeat(auto-fit,minmax(180px,1fr))] pw-gap-2 sm:pw-gap-3',
      className
    )}
  >
    {children}
  </div>
);
