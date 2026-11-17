import { ReactNode } from 'react';

import classNames from 'classnames';

import { UI } from './tokens';

export interface DefinitionItem {
  term: ReactNode;
  value: ReactNode;
  /** Grey value, for "not informed" style entries. */
  muted?: boolean;
  /** Span the full row. */
  wide?: boolean;
}

export interface DefinitionListProps {
  items: ReadonlyArray<DefinitionItem>;
  className?: string;
}

/** Label-over-value grid used by detail screens and read-only forms. */
export const DefinitionList = ({ items, className }: DefinitionListProps) => (
  <dl
    className={classNames(
      'pw-grid pw-grid-cols-1 sm:pw-grid-cols-[repeat(auto-fit,minmax(160px,1fr))] pw-gap-x-5 pw-gap-y-3 pw-m-0',
      className
    )}
  >
    {items.map((item, index) => (
      <div
        key={index}
        className={classNames('pw-grid pw-gap-0.5 pw-min-w-0', item.wide && 'sm:pw-col-span-full')}
      >
        <dt className={UI.label}>{item.term}</dt>
        <dd
          className={classNames(
            'pw-m-0 pw-text-[13.5px] pw-font-medium pw-break-words',
            item.muted ? 'pw-font-normal pw-text-[#8B93A3]' : UI.text
          )}
        >
          {item.value}
        </dd>
      </div>
    ))}
  </dl>
);
