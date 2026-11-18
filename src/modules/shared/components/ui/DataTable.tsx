import { ReactNode } from 'react';

import classNames from 'classnames';

import Skeleton from '../Skeleton';
import { UI } from './tokens';

/** Role a column plays when the table collapses into cards on mobile. */
export type CardRole = 'title' | 'badge' | 'value' | 'meta' | 'action' | 'hidden';

export interface DataTableColumn<Row> {
  key: string;
  header: ReactNode;
  render: (row: Row) => ReactNode;
  align?: 'left' | 'right' | 'center';
  /** Column width as a CSS value (`120px`, `1fr`-like widths are not supported in tables; use `%`). */
  width?: string;
  /** How this column shows inside a mobile card. Default: `meta`. */
  card?: CardRole;
  /** Hide below `sm` in the table (does not affect card mode). */
  hideOnMobile?: boolean;
  className?: string;
}

export interface DataTableViewProps<Row> {
  columns: ReadonlyArray<DataTableColumn<Row>>;
  rows: ReadonlyArray<Row>;
  rowKey: (row: Row, index: number) => string | number;
  onRowClick?: (row: Row) => void;
  /** Shown instead of the body when `rows` is empty. */
  emptyState?: ReactNode;
  loading?: boolean;
  loadingRows?: number;
  /** Pagination / count line rendered under the table. */
  footer?: ReactNode;
  /** Disable the card layout on mobile and keep the (scrollable) table. */
  noCards?: boolean;
  /** Render without the card chrome. */
  bare?: boolean;
  className?: string;
  /** Extra class per row (e.g. dim processing rows). */
  rowClassName?: (row: Row) => string | undefined;
}

const alignClass = (align?: DataTableColumn<unknown>['align']) =>
  align === 'right' ? 'pw-text-right' : align === 'center' ? 'pw-text-center' : 'pw-text-left';

/**
 * Standard table of the internal area: 11px uppercase header, zebra-free
 * rows with a thin divider, and a card layout below `sm` driven by the
 * columns' `card` role (title + badge on the first line, value in bold,
 * meta columns as context lines, actions at the bottom).
 */
export function DataTable<Row>({
  columns,
  rows,
  rowKey,
  onRowClick,
  emptyState,
  loading,
  loadingRows = 4,
  footer,
  noCards,
  bare,
  className,
  rowClassName,
}: DataTableViewProps<Row>) {
  const clickable = Boolean(onRowClick);
  const isEmpty = !loading && rows.length === 0;

  const tableCols = columns;
  const title = columns.find((c) => c.card === 'title');
  const badge = columns.find((c) => c.card === 'badge');
  const value = columns.find((c) => c.card === 'value');
  const actions = columns.filter((c) => c.card === 'action');
  const metas = columns.filter(
    (c) => !c.card || c.card === 'meta'
  );

  const table = (
    <div className="pw-overflow-x-auto">
      <table className="pw-w-full pw-border-collapse pw-text-[13px]">
        <thead>
          <tr>
            {tableCols.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={col.width ? { width: col.width } : undefined}
                className={classNames(
                  UI.label,
                  'pw-font-semibold pw-py-2.5 pw-px-3 pw-border-b',
                  UI.line,
                  alignClass(col.align),
                  col.hideOnMobile && 'pw-hidden sm:pw-table-cell',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: loadingRows }).map((_, i) => (
                <tr key={`skeleton-${i}`}>
                  {tableCols.map((col) => (
                    <td
                      key={col.key}
                      className={classNames('pw-py-3 pw-px-3 pw-border-b', UI.line)}
                    >
                      <Skeleton className="pw-h-3 pw-w-full pw-max-w-[140px] pw-rounded" />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((row, index) => (
                <tr
                  key={rowKey(row, index)}
                  onClick={clickable ? () => onRowClick?.(row) : undefined}
                  tabIndex={clickable ? 0 : undefined}
                  onKeyDown={
                    clickable
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onRowClick?.(row);
                          }
                        }
                      : undefined
                  }
                  className={classNames(
                    'last:[&>td]:pw-border-b-0',
                    clickable && 'pw-cursor-pointer hover:pw-bg-[#F7F8FA]',
                    rowClassName?.(row)
                  )}
                >
                  {tableCols.map((col) => (
                    <td
                      key={col.key}
                      className={classNames(
                        'pw-py-3 pw-px-3 pw-border-b pw-align-middle',
                        UI.line,
                        UI.text,
                        alignClass(col.align),
                        col.align === 'right' && 'pw-tabular-nums',
                        col.hideOnMobile && 'pw-hidden sm:pw-table-cell',
                        col.className
                      )}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );

  const cards = (
    <div className="pw-grid pw-gap-2">
      {loading
        ? Array.from({ length: Math.min(loadingRows, 3) }).map((_, i) => (
            <div key={`skeleton-card-${i}`} className={classNames(UI.card, 'pw-p-3 pw-grid pw-gap-2')}>
              <Skeleton className="pw-h-3 pw-w-2/3 pw-rounded" />
              <Skeleton className="pw-h-4 pw-w-1/3 pw-rounded" />
              <Skeleton className="pw-h-2.5 pw-w-1/2 pw-rounded" />
            </div>
          ))
        : rows.map((row, index) => (
            <div
              key={rowKey(row, index)}
              onClick={clickable ? () => onRowClick?.(row) : undefined}
              role={clickable ? 'button' : undefined}
              tabIndex={clickable ? 0 : undefined}
              className={classNames(
                UI.card,
                'pw-p-3 pw-grid pw-gap-1 pw-min-w-0',
                clickable && 'pw-cursor-pointer active:pw-bg-[#F7F8FA]',
                rowClassName?.(row)
              )}
            >
              {title || badge ? (
                <div className="pw-flex pw-items-center pw-justify-between pw-gap-2 pw-min-w-0">
                  <span className={classNames('pw-text-[13px] pw-font-semibold pw-truncate pw-min-w-0', UI.text)}>
                    {title?.render(row)}
                  </span>
                  {badge ? <span className="pw-shrink-0">{badge.render(row)}</span> : null}
                </div>
              ) : null}
              {value ? (
                <span className={classNames('pw-text-[16px] pw-font-bold pw-tabular-nums', UI.text)}>
                  {value.render(row)}
                </span>
              ) : null}
              {metas.map((col) => {
                const content = col.render(row);
                if (content === null || content === undefined || content === '') return null;
                return (
                  <span
                    key={col.key}
                    className={classNames('pw-text-[12px] pw-truncate', UI.textMuted)}
                  >
                    {col.header ? <>{col.header}: </> : null}
                    {content}
                  </span>
                );
              })}
              {actions.length ? (
                <div className="pw-flex pw-flex-wrap pw-gap-2 pw-pt-1">
                  {actions.map((col) => (
                    <span key={col.key}>{col.render(row)}</span>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
    </div>
  );

  if (isEmpty && emptyState) {
    return <div className={className}>{emptyState}</div>;
  }

  return (
    <div className={classNames(!bare && !noCards && 'sm:pw-bg-white sm:pw-rounded-[10px] sm:pw-shadow-[0_2px_8px_rgba(0,0,0,0.06)]', !bare && noCards && UI.card, className)}>
      {noCards ? (
        <div className={classNames(!bare && 'pw-px-2')}>{table}</div>
      ) : (
        <>
          <div className={classNames('pw-hidden sm:pw-block', !bare && 'pw-px-2')}>{table}</div>
          <div className="sm:pw-hidden">{cards}</div>
        </>
      )}
      {footer ? (
        <div
          className={classNames(
            'pw-flex pw-flex-wrap pw-items-center pw-justify-between pw-gap-2 pw-pt-3 pw-text-[12px] sm:pw-px-4 sm:pw-pb-3',
            UI.textMuted
          )}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}
