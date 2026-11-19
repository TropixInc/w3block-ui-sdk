/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useState } from 'react';

import classNames from 'classnames';

import ArrowDown from '../assets/icons/arrowDown.svg';
import useTranslation from '../hooks/useTranslation';
import {
  Actions,
  ColumnsTable,
  FormatTypeColumn,
} from '../interfaces/ConfigGenericTable';
import { Alert } from './Alert';
import { GenericButtonActions } from './GenericButtonActions';
import Skeleton from './Skeleton';
import SmartExpansibleLineContainer from './SmartExpansibleLineContainer';
import { UI } from './ui/tokens';

type RenderCell = (item: any, column: ColumnsTable) => ReactNode;

interface CardRoles {
  title?: ColumnsTable;
  badge?: ColumnsTable;
  value?: ColumnsTable;
  metas: ColumnsTable[];
}

/**
 * Picks which column plays which part of the card. Explicit `card` roles win;
 * otherwise a USER column (or the first one) is the title, a MAPPING with
 * tones is the badge and MONEY is the value.
 */
export const resolveCardRoles = (columns: ColumnsTable[]): CardRoles => {
  const visible = columns.filter((column) => column.header.label);
  const explicit = (role: ColumnsTable['card']) =>
    visible.find((column) => column.card === role);
  const title =
    explicit('title') ??
    visible.find(
      (column) =>
        !column.card &&
        (column.format.type === FormatTypeColumn.USER ||
          column.format.type === FormatTypeColumn.USER_BY_HASH)
    ) ??
    visible.find((column) => !column.card);
  const badge =
    explicit('badge') ??
    visible.find(
      (column) =>
        !column.card &&
        column !== title &&
        column.format.type === FormatTypeColumn.MAPPING &&
        Boolean(column.format.tones)
    );
  const value =
    explicit('value') ??
    visible.find(
      (column) =>
        !column.card &&
        column !== title &&
        column !== badge &&
        column.format.type === FormatTypeColumn.MONEY
    );
  const metas = visible.filter(
    (column) =>
      column !== title &&
      column !== badge &&
      column !== value &&
      column.card !== 'hidden'
  );
  return { title, badge, value, metas };
};

interface CardProps {
  item: any;
  roles: CardRoles;
  renderCell: RenderCell;
  actions?: Array<Actions>;
  lineActions?: Actions;
  isLineExplansible?: boolean;
  expansibleComponent?: any;
  handleAction: (event: any, action: any, row: any) => void;
  setIsUpdateList?: (value: boolean) => void;
}

const GenericCard = ({
  item,
  roles,
  renderCell,
  actions,
  lineActions,
  isLineExplansible,
  expansibleComponent,
  handleAction,
  setIsUpdateList,
}: CardProps) => {
  const [translate] = useTranslation();
  const [openExpansible, setOpenExpansible] = useState(false);
  const clickable = Boolean(lineActions);

  return (
    <div
      className={classNames(
        UI.card,
        'pw-p-3 pw-grid pw-gap-1.5 pw-min-w-0 pw-text-[13px]',
        UI.textSecondary
      )}
    >
      <div
        className="pw-flex pw-items-start pw-justify-between pw-gap-2 pw-min-w-0"
        onClick={
          clickable
            ? (e) => handleAction(e, lineActions?.action, item)
            : undefined
        }
        role={clickable ? 'button' : undefined}
      >
        <div className={classNames('pw-min-w-0 pw-flex-1', UI.text)}>
          {roles.title ? renderCell(item, roles.title) : null}
        </div>
        {roles.badge ? (
          <span className="pw-shrink-0">{renderCell(item, roles.badge)}</span>
        ) : null}
      </div>
      {roles.value ? (
        <span
          className={classNames(
            'pw-text-[16px] pw-font-bold pw-tabular-nums',
            UI.text
          )}
        >
          {renderCell(item, roles.value)}
        </span>
      ) : null}
      {roles.metas.map((column) => (
        <div
          key={column.key}
          className="pw-flex pw-items-baseline pw-gap-2 pw-min-w-0 pw-text-[12px]"
        >
          <span className={classNames('pw-shrink-0', UI.textMuted)}>
            {column.header.label}
          </span>
          <span
            className={classNames(
              'pw-min-w-0 pw-flex-1 pw-text-right',
              UI.text
            )}
          >
            {renderCell(item, column)}
          </span>
        </div>
      ))}
      {actions || isLineExplansible ? (
        <div className="pw-flex pw-items-center pw-justify-between pw-gap-2 pw-pt-1">
          {isLineExplansible ? (
            <button
              type="button"
              onClick={() => setOpenExpansible(!openExpansible)}
              aria-expanded={openExpansible}
              className={classNames(UI.buttonSecondary, '!pw-h-8')}
            >
              {openExpansible
                ? translate('shared>genericTable>hideDetails')
                : translate('shared>genericTable>showDetails')}
              <ArrowDown
                className={classNames(
                  'pw-w-3.5 pw-h-3.5 pw-stroke-[#4A5567] pw-transition-transform',
                  openExpansible ? 'pw-rotate-180' : 'pw-rotate-0'
                )}
              />
            </button>
          ) : (
            <span />
          )}
          {actions ? (
            <GenericButtonActions dataItem={item} actions={actions ?? []} />
          ) : null}
        </div>
      ) : null}
      {isLineExplansible && openExpansible && expansibleComponent ? (
        <div className={classNames('pw-pt-2 pw-mt-1 pw-border-t', UI.line)}>
          <SmartExpansibleLineContainer
            expansibleComponent={expansibleComponent}
            rowData={item}
            setOpenExpansible={setOpenExpansible}
            setIsUpdateList={setIsUpdateList}
          />
        </div>
      ) : null}
    </div>
  );
};

interface GenericTableCardsProps {
  items: any[];
  columns: ColumnsTable[];
  renderCell: RenderCell;
  isFetching: boolean;
  actions?: Array<Actions>;
  lineActions?: Actions;
  isLineExplansible?: boolean;
  expansibleComponent?: any;
  handleAction: (event: any, action: any, row: any) => void;
  setIsUpdateList?: (value: boolean) => void;
}

/**
 * Mobile companion of the redesign GenericTable: one card per row, with the
 * columns mapped to title / badge / value / meta lines by `resolveCardRoles`,
 * the row actions and the expansible content inline.
 */
export const GenericTableCards = ({
  items,
  columns,
  renderCell,
  isFetching,
  ...rowProps
}: GenericTableCardsProps) => {
  const [translate] = useTranslation();
  const roles = resolveCardRoles(columns);

  if (isFetching) {
    return (
      <div className="pw-grid pw-gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={`skeleton-card-${i}`}
            className={classNames(UI.card, 'pw-p-3 pw-grid pw-gap-2')}
          >
            <Skeleton className="pw-h-3 pw-w-2/3 pw-rounded" />
            <Skeleton className="pw-h-2.5 pw-w-1/2 pw-rounded" />
            <Skeleton className="pw-h-2.5 pw-w-1/3 pw-rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <Alert variant="information" className="pw-w-full pw-rounded-[10px]">
        {translate('token>pass>notResult')}
      </Alert>
    );
  }

  return (
    <div className="pw-grid pw-gap-2">
      {items.map((item) => (
        <GenericCard
          key={item.id}
          item={item}
          roles={roles}
          renderCell={renderCell}
          {...rowProps}
        />
      ))}
    </div>
  );
};
