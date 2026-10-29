import { useState } from 'react';

import classNames from 'classnames';

import { Pagination } from '../../shared/components/Pagination';
import { Spinner } from '../../shared/components/Spinner';
import { useLocale } from '../../shared/hooks/useLocale';
import useTranslation from '../../shared/hooks/useTranslation';
import { useGetWithdrawOrders } from '../hooks/useGetWithdrawOrders';
import { Withdraw } from '../interfaces';
import {
  formatWithdrawAmount,
  formatWithdrawDate,
  formatWithdrawDateTime,
} from '../utils/format';

const HEAD =
  'pw-grid pw-h-11 pw-items-center pw-gap-x-3 pw-border-b pw-border-[#e6e8ec] pw-bg-[#fafbfc] pw-px-4 pw-text-[11px] pw-font-bold pw-uppercase pw-tracking-[0.03em] pw-text-[#8b93a3]';
const ROW =
  'pw-grid pw-items-center pw-gap-x-3 pw-border-t pw-border-[#e6e8ec] pw-bg-white pw-px-4 pw-py-2.5 pw-min-h-[48px] pw-text-[13px] pw-text-[#4a5567]';
const COLUMNS = 'pw-grid-cols-[1.1fr_1.1fr_1.3fr_0.9fr_0.8fr_0.8fr_0.9fr]';
const COLUMNS_COMPACT = 'pw-grid-cols-[1.1fr_1.1fr_1.3fr_0.9fr]';
const NUM = 'pw-text-right pw-tabular-nums';

interface Props {
  withdraw: Withdraw;
  /** Rota de admin (default) ou do usuário (Connect). */
  admin?: boolean;
  pageSize?: number;
  /** Só pedido, compra em, cliente e líquido (popup). */
  compact?: boolean;
  /** Esconde a coluna cliente (visão do estabelecimento pode vir mascarada). */
  hideCustomer?: boolean;
  className?: string;
}

/** Compras conciliadas no saque, com totais e paginação. Cai no mock enquanto a API não existir. */
export const WithdrawOrdersTable = ({
  withdraw,
  admin = true,
  pageSize = 10,
  compact = false,
  hideCustomer = false,
  className,
}: Props) => {
  const [translate] = useTranslation();
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetWithdrawOrders(withdraw, {
    page,
    limit: pageSize,
    admin,
  });

  const items = data?.items ?? [];
  const totals = data?.totals ?? withdraw.totals;
  const totalItems = data?.meta?.totalItems ?? withdraw.ordersCount ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;
  const columns = compact ? COLUMNS_COMPACT : COLUMNS;

  return (
    <div className={classNames('pw-flex pw-flex-col pw-gap-3', className)}>
      {data?.isMock ? (
        <p className="pw-m-0 pw-text-[12px] pw-text-[#b2740a] pw-bg-[#fdf5e6] pw-rounded-lg pw-px-3 pw-py-2">
          {translate('withdraws>mock>ordersNotice')}
        </p>
      ) : null}
      <div className="pw-rounded-[12px] pw-border pw-border-[#e6e8ec] pw-overflow-hidden">
        <div className="pw-overflow-x-auto">
          <div className={compact ? 'pw-min-w-[520px]' : 'pw-min-w-[760px]'}>
            <div className={classNames(HEAD, columns)}>
              <span>{translate('withdraws>orders>order')}</span>
              <span>{translate('withdraws>orders>purchasedAt')}</span>
              <span>
                {hideCustomer ? '' : translate('withdraws>orders>customer')}
              </span>
              {!compact ? (
                <span>{translate('withdraws>orders>releasedAt')}</span>
              ) : null}
              {!compact ? (
                <span className={NUM}>
                  {translate('withdraws>orders>gross')}
                </span>
              ) : null}
              {!compact ? (
                <span className={NUM}>
                  {translate('withdraws>orders>cashback')}
                </span>
              ) : null}
              <span className={NUM}>{translate('withdraws>orders>net')}</span>
            </div>
            {isLoading ? (
              <div className="pw-flex pw-justify-center pw-py-8">
                <Spinner />
              </div>
            ) : isError ? (
              <p className="pw-m-0 pw-px-4 pw-py-6 pw-text-[13px] pw-text-[#e23b3e]">
                {translate('withdraws>orders>loadError')}
              </p>
            ) : items.length ? (
              items.map((item) => (
                <div
                  key={item.loyaltyDeferredId}
                  className={classNames(ROW, columns)}
                >
                  <span
                    className="pw-font-semibold pw-text-[#0f1729] pw-truncate"
                    title={item.orderId ?? ''}
                  >
                    {item.orderId ?? item.loyaltyDeferredId.slice(0, 8)}
                  </span>
                  <span className="pw-tabular-nums">
                    {formatWithdrawDateTime(item.purchasedAt, locale)}
                  </span>
                  <span className="pw-truncate">
                    {hideCustomer
                      ? ''
                      : item.customer?.name ?? item.customer?.email ?? '—'}
                  </span>
                  {!compact ? (
                    <span className="pw-tabular-nums">
                      {formatWithdrawDate(item.releasedAt, locale)}
                    </span>
                  ) : null}
                  {!compact ? (
                    <span className={NUM}>
                      {formatWithdrawAmount(item.grossAmount, locale)}
                    </span>
                  ) : null}
                  {!compact ? (
                    <span className={classNames(NUM, 'pw-text-[#e23b3e]')}>
                      {`−${formatWithdrawAmount(item.cashbackAmount, locale)}`}
                    </span>
                  ) : null}
                  <span
                    className={classNames(
                      NUM,
                      'pw-font-semibold pw-text-[#0f1729]'
                    )}
                  >
                    {formatWithdrawAmount(item.netAmount, locale)}
                  </span>
                </div>
              ))
            ) : (
              <p className="pw-m-0 pw-px-4 pw-py-6 pw-text-[13px] pw-text-[#8b93a3]">
                {translate('withdraws>orders>empty')}
              </p>
            )}
            {totals && items.length ? (
              <div
                className={classNames(
                  ROW,
                  columns,
                  'pw-bg-[#fafbfc] pw-font-semibold pw-text-[#0f1729]'
                )}
              >
                <span>
                  {translate('withdraws>orders>total', { count: totalItems })}
                </span>
                <span />
                <span />
                {!compact ? <span /> : null}
                {!compact ? (
                  <span className={NUM}>
                    {formatWithdrawAmount(totals.gross, locale)}
                  </span>
                ) : null}
                {!compact ? (
                  <span className={classNames(NUM, 'pw-text-[#e23b3e]')}>
                    {`−${formatWithdrawAmount(totals.cashback, locale)}`}
                  </span>
                ) : null}
                <span className={NUM}>
                  {formatWithdrawAmount(totals.net, locale)}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {totalPages > 1 ? (
        <div className="pw-flex pw-items-center pw-justify-end pw-gap-4">
          <span className="pw-text-[12px] pw-text-[#8b93a3]">
            {translate('withdraws>orders>showing', {
              from: (page - 1) * pageSize + 1,
              to: Math.min(page * pageSize, totalItems),
              total: totalItems,
            })}
          </span>
          <Pagination
            currentPage={page}
            pagesQuantity={totalPages}
            onChangePage={setPage}
          />
        </div>
      ) : null}
    </div>
  );
};
