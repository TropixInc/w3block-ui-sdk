import { ReactNode } from 'react';

import classNames from 'classnames';

import { UI } from './tokens';

export interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Primary / secondary actions, rendered to the right (below the title on mobile). */
  actions?: ReactNode;
  /** Optional "‹ Back" link rendered above the title. */
  back?: { label: ReactNode; href?: string; onClick?: () => void };
  /** Extra content inside the same card, below the title row. */
  children?: ReactNode;
  className?: string;
}

/**
 * Single page header card: title, subtitle and the page's main actions in
 * the same block. Replaces the bare `<p class="pw-text-[23px]">` titles.
 */
export const PageHeader = ({
  title,
  subtitle,
  actions,
  back,
  children,
  className,
}: PageHeaderProps) => {
  const backClass =
    'pw-inline-flex pw-items-center pw-gap-1 pw-text-[12px] pw-font-medium pw-text-[#4A5567] hover:pw-text-[#0F1729] pw-no-underline pw-mb-1';
  return (
    <header
      className={classNames(UI.card, UI.cardPadding, 'pw-w-full', className)}
    >
      <div className="pw-flex pw-flex-col sm:pw-flex-row sm:pw-items-start sm:pw-justify-between pw-gap-3">
        <div className="pw-min-w-0">
          {back ? (
            back.href ? (
              <a href={back.href} onClick={back.onClick} className={backClass}>
                <span aria-hidden>‹</span> {back.label}
              </a>
            ) : (
              <button type="button" onClick={back.onClick} className={backClass}>
                <span aria-hidden>‹</span> {back.label}
              </button>
            )
          ) : null}
          <h1
            className={classNames(
              'pw-text-[20px] sm:pw-text-[22px] pw-font-semibold pw-leading-tight pw-m-0',
              UI.text
            )}
          >
            {title}
          </h1>
          {subtitle ? (
            <p
              className={classNames(
                'pw-text-[13px] pw-leading-snug pw-mt-1 pw-m-0',
                UI.textMuted
              )}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="pw-flex pw-flex-wrap pw-items-center pw-gap-2 pw-shrink-0">
            {actions}
          </div>
        ) : null}
      </div>
      {children ? <div className="pw-mt-4">{children}</div> : null}
    </header>
  );
};
