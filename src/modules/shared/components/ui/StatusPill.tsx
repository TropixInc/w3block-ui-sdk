import { ReactNode } from 'react';

import classNames from 'classnames';

import { Tone, TONE_CLASSES } from './tokens';

export interface StatusPillProps {
  tone?: Tone;
  children: ReactNode;
  /** Leading dot in the pill colour (default on). */
  dot?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  title?: string;
}

export const StatusPill = ({
  tone = 'grey',
  children,
  dot = true,
  size = 'md',
  className,
  title,
}: StatusPillProps) => (
  <span
    title={title}
    className={classNames(
      'pw-inline-flex pw-items-center pw-gap-1.5 pw-rounded-full pw-font-semibold pw-whitespace-nowrap pw-align-middle',
      size === 'sm' ? 'pw-text-[10.5px] pw-px-2 pw-py-px' : 'pw-text-[11.5px] pw-px-2.5 pw-py-0.5',
      TONE_CLASSES[tone],
      className
    )}
  >
    {dot ? (
      <span
        aria-hidden
        className="pw-inline-block pw-w-1.5 pw-h-1.5 pw-rounded-full pw-bg-current pw-shrink-0"
      />
    ) : null}
    {children}
  </span>
);
