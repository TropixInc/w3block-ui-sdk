/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';

import classNames from 'classnames';
import { format } from 'date-fns';

import useDateFnsLocale from '../../../shared/hooks/useDateFnsLocale';
import { useIsMobile } from '../../../shared/hooks/useIsMobile';
import { useLocale } from '../../../shared/hooks/useLocale';
import useTranslation from '../../../shared/hooks/useTranslation';
import {
  SettlementPresentation,
  formatPoints,
  isReleased,
  resolveSettlement,
} from './settlement';
import { SettlementPill } from './SettlementPill';

export interface FutureStatementRow {
  id: string;
  deliverId?: string;
  buyerName?: string;
  establishmentName?: string;
  paidAmount?: string;
  amount: string;
  createdAt?: string;
  releaseAt?: string | null;
  released: boolean;
  settlement: SettlementPresentation | null;
}

const metadataOf = (item: any) =>
  Array.isArray(item?.metadata)
    ? item?.metadata?.[0] ?? {}
    : item?.metadata ?? {};

/** Normaliza um item de GET /loyalties/users/deferred para a linha da tabela. */
export const toFutureStatementRow = (
  item: any,
  options: { lockedOnly?: boolean } = {}
): FutureStatementRow => {
  const metadata = metadataOf(item);
  const releaseAt = item?.withdrawableAt ?? item?.executeAt ?? null;
  // Na aba "Agendados" a API já garante que nada liberou; não deixamos o
  // fallback para executeAt contradizer o filtro.
  const released = options.lockedOnly ? false : isReleased(releaseAt);
  return {
    id: item?.id,
    deliverId: metadata?.commerce?.deliverId ?? metadata?.deliverId,
    buyerName: metadata?.buyerName,
    establishmentName: metadata?.userName ?? metadata?.operatorName,
    paidAmount: metadata?.amount,
    amount: item?.request?.amount ?? item?.amount,
    createdAt: item?.createdAt,
    releaseAt,
    released,
    settlement: resolveSettlement({
      id: item?.id,
      item,
      released,
      releasedAt: releaseAt,
    }),
  };
};

/** A nota "* repasse simulado" só faz sentido se alguma pill é simulada. */
export const hasMockSettlementRows = (
  items: any[],
  options: { lockedOnly?: boolean } = {}
) =>
  items.some((item) => toFutureStatementRow(item, options).settlement?.isMock);

interface Props {
  items: any[];
  currency: string;
  /** Lista filtrada em "Agendados": trata tudo como ainda não liberado. */
  lockedOnly?: boolean;
  pointsPrecision?: 'integer' | 'decimal';
  /** Mostra a coluna Estabelecimento (visão admin). */
  showEstablishment?: boolean;
  onOpenReceipt: (deliverId: string) => void;
  withdrawHref?: (withdrawId: string) => string;
}

const TH =
  'pw-text-left pw-text-[11px] pw-font-semibold pw-uppercase pw-tracking-[.04em] pw-text-[#6b7280] pw-px-3 pw-py-2.5 pw-border-b pw-border-[#e6e8ec] pw-whitespace-nowrap';
const TD =
  'pw-text-[13px] pw-text-[#0f1729] pw-px-3 pw-py-3 pw-border-b pw-border-[#e6e8ec] pw-align-middle';

/** Tabela (desktop) ou cards (celular) dos lançamentos futuros. */
export const FutureStatementTable = ({
  items,
  currency,
  pointsPrecision = 'decimal',
  showEstablishment,
  lockedOnly,
  onOpenReceipt,
  withdrawHref,
}: Props) => {
  const [translate] = useTranslation();
  const locale = useLocale();
  const dateFnsLocale = useDateFnsLocale();
  const isMobile = useIsMobile();

  const rows = useMemo(
    () => items.map((item) => toFutureStatementRow(item, { lockedOnly })),
    [items, lockedOnly]
  );

  const dateTime = (value?: string | null) =>
    value
      ? format(new Date(value), 'dd/MM/yyyy HH:mm', { locale: dateFnsLocale })
      : '—';
  const dateOnly = (value?: string | null) =>
    value
      ? format(new Date(value), 'dd/MM/yyyy', { locale: dateFnsLocale })
      : '—';

  const releaseCell = (row: FutureStatementRow) =>
    row.released ? (
      <span className="pw-text-[#0b7a55]">
        {translate('statement>future>releasedOn', {
          date: dateOnly(row.releaseAt),
        })}
      </span>
    ) : (
      <span>{dateOnly(row.releaseAt)}</span>
    );

  const amountCell = (row: FutureStatementRow, className?: string) => (
    <span
      className={classNames('pw-font-semibold pw-whitespace-nowrap', className)}
    >
      {'+ '}
      {formatPoints(row.amount, pointsPrecision, locale)}
      <span className="pw-ml-1 pw-text-[12px] pw-font-normal pw-text-[#6b7280]">
        {currency}
      </span>
    </span>
  );

  const receiptButton = (row: FutureStatementRow, className?: string) =>
    row.deliverId ? (
      <button
        type="button"
        onClick={() => onOpenReceipt(row.deliverId as string)}
        className={classNames(
          'pw-text-[13px] pw-text-[#0050FF] hover:pw-underline',
          className
        )}
      >
        {translate('statement>future>receipt')}
      </button>
    ) : null;

  if (isMobile) {
    return (
      <div className="pw-flex pw-flex-col pw-gap-3">
        {rows.map((row) => (
          <div
            key={row.id}
            className="pw-flex pw-flex-col pw-gap-2.5 pw-rounded-[10px] pw-bg-white pw-p-4 pw-text-[#0f1729] pw-shadow-[0_2px_8px_rgba(0,0,0,.06)]"
          >
            <div className="pw-flex pw-items-center pw-justify-between pw-gap-2">
              <span className="pw-font-semibold pw-text-[#0f1729]">
                {row.deliverId ? `#${row.deliverId}` : '—'}
              </span>
              <SettlementPill
                presentation={row.settlement}
                withdrawHref={withdrawHref}
              />
            </div>
            {row.buyerName || row.establishmentName ? (
              <span className="pw-text-[12px] pw-text-[#6b7280]">
                {showEstablishment && row.establishmentName
                  ? `${row.establishmentName} · `
                  : ''}
                {row.buyerName}
              </span>
            ) : null}
            <div className="pw-flex pw-justify-between pw-gap-2 pw-text-[13px]">
              <span className="pw-text-[#6b7280]">
                {translate('statement>future>colPurchasedAt')}
              </span>
              <span>{dateTime(row.createdAt)}</span>
            </div>
            <div className="pw-flex pw-justify-between pw-gap-2 pw-text-[13px]">
              <span className="pw-text-[#6b7280]">
                {translate('statement>future>colReleaseAt')}
              </span>
              {releaseCell(row)}
            </div>
            <div className="pw-flex pw-items-center pw-justify-between pw-gap-2">
              {amountCell(row, 'pw-text-[16px]')}
              {receiptButton(row)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="pw-overflow-x-auto pw-rounded-[10px] pw-bg-white pw-px-5 pw-pb-2 pw-shadow-[0_2px_8px_rgba(0,0,0,.06)]">
      <table className="pw-w-full pw-min-w-[820px] pw-border-collapse">
        <thead>
          <tr>
            <th className={TH}>{translate('statement>future>colPurchase')}</th>
            <th className={TH}>{translate('statement>future>colBuyer')}</th>
            {showEstablishment ? (
              <th className={TH}>
                {translate('statement>future>colEstablishment')}
              </th>
            ) : null}
            <th className={TH}>
              {translate('statement>future>colPurchasedAt')}
            </th>
            <th className={TH}>{translate('statement>future>colReleaseAt')}</th>
            <th className={classNames(TH, '!pw-text-right')}>
              {translate('statement>future>colAmount')}
            </th>
            <th className={TH}>
              {translate('statement>future>colSettlement')}
            </th>
            <th className={TH} />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="hover:pw-bg-[#F8FAFC]">
              <td className={classNames(TD, 'pw-font-semibold')}>
                {row.deliverId ? `#${row.deliverId}` : '—'}
                {row.paidAmount ? (
                  <span className="pw-block pw-whitespace-nowrap pw-text-[12px] pw-font-normal pw-text-[#6b7280]">
                    {translate('statement>future>paidAmount', {
                      amount: `R$ ${formatPoints(
                        row.paidAmount,
                        'decimal',
                        locale
                      )}`,
                    })}
                  </span>
                ) : null}
              </td>
              <td className={TD}>{row.buyerName ?? '—'}</td>
              {showEstablishment ? (
                <td className={TD}>{row.establishmentName ?? '—'}</td>
              ) : null}
              <td className={classNames(TD, 'pw-whitespace-nowrap')}>
                {dateTime(row.createdAt)}
              </td>
              <td className={classNames(TD, 'pw-whitespace-nowrap')}>
                {releaseCell(row)}
              </td>
              <td className={classNames(TD, 'pw-text-right pw-tabular-nums')}>
                {amountCell(row)}
              </td>
              <td className={TD}>
                <SettlementPill
                  presentation={row.settlement}
                  withdrawHref={withdrawHref}
                />
              </td>
              <td className={classNames(TD, 'pw-text-right')}>
                {receiptButton(row)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
