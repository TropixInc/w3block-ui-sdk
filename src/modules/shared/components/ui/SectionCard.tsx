import { ReactNode } from 'react';

import classNames from 'classnames';

import { UI } from './tokens';

export interface SectionCardProps {
  title?: ReactNode;
  /** Small link or button on the right of the title. */
  actions?: ReactNode;
  children: ReactNode;
  /** Remove the inner padding (for tables that bring their own). */
  flush?: boolean;
  className?: string;
}

/** Plain white card with the facelift radius/shadow and an optional title row. */
export const SectionCard = ({ title, actions, children, flush, className }: SectionCardProps) => (
  <section className={classNames(UI.card, !flush && UI.cardPadding, 'pw-min-w-0', className)}>
    {title || actions ? (
      <div
        className={classNames(
          'pw-flex pw-items-center pw-justify-between pw-gap-3 pw-mb-3',
          flush && 'pw-px-4 pw-pt-4'
        )}
      >
        {title ? (
          <h2 className={classNames('pw-text-[14px] pw-font-semibold pw-m-0', UI.text)}>{title}</h2>
        ) : (
          <span />
        )}
        {actions}
      </div>
    ) : null}
    {children}
  </section>
);
