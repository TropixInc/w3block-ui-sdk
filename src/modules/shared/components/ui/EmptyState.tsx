import { ReactNode } from 'react';

import classNames from 'classnames';

import { UI } from './tokens';

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  /** A button or link that gets the user out of the empty state. */
  action?: ReactNode;
  icon?: ReactNode;
  /** Render without the card chrome (when already inside a card). */
  bare?: boolean;
  className?: string;
}

const DefaultIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
    <rect x="3" y="5" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 9h16" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const EmptyState = ({
  title,
  description,
  action,
  icon,
  bare,
  className,
}: EmptyStateProps) => (
  <div
    className={classNames(
      'pw-flex pw-flex-col pw-items-center pw-text-center pw-gap-1.5 pw-py-10 pw-px-4',
      !bare && classNames(UI.card),
      className
    )}
  >
    <span className="pw-grid pw-place-items-center pw-w-10 pw-h-10 pw-rounded-xl pw-bg-[#EAF1FC] pw-text-[#2F6FD0] pw-mb-1">
      {icon ?? <DefaultIcon />}
    </span>
    <p className={classNames('pw-text-[14px] pw-font-semibold pw-m-0', UI.text)}>
      {title}
    </p>
    {description ? (
      <p
        className={classNames(
          'pw-text-[12.5px] pw-leading-snug pw-max-w-[38ch] pw-m-0',
          UI.textMuted
        )}
      >
        {description}
      </p>
    ) : null}
    {action ? <div className="pw-mt-3">{action}</div> : null}
  </div>
);
