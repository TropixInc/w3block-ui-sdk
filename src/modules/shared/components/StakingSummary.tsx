import { useMemo, useState } from 'react';

import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';

import { useHasWallet } from '../hooks/useHasWallet';
import { useLocale } from '../hooks/useLocale';
import {
  SummaryDto,
  useRedeemStaking,
  useStakingSummary,
} from '../hooks/useStaking';
import useTranslation from '../hooks/useTranslation';
import { useUserWallet } from '../hooks/useUserWallet/useUserWallet';
import { formatAmount } from '../utils/formatAmount';
import { Alert } from './Alert';
import { BaseButton } from './Buttons';
import { ErrorBox } from './ErrorBox';
import { InternalPagesLayoutBase } from './InternalPagesLayoutBase';
import { Pagination } from './Pagination';
import { Spinner } from './Spinner';
import TranslatableComponent from './TranslatableComponent';
import { DataTable, DataTableColumn } from './ui/DataTable';
import { EmptyState } from './ui/EmptyState';
import { KpiCard, KpiRow } from './ui/KpiCard';
import { PageHeader } from './ui/PageHeader';
import { StatusPill } from './ui/StatusPill';

/**
 * Rewards (staking): what can be redeemed now, what is still being
 * delivered, the redeem action and the history. Same hooks as before.
 */
export const StakingSummary = () => {
  const [page, setPage] = useState(1);
  const [translate] = useTranslation();
  const locale = useLocale();
  const dateLocale = locale === 'pt-BR' ? ptBR : enUS;
  const { data, isLoading, error: errorStaking } = useStakingSummary({ page });
  const { loyaltyWallet } = useUserWallet();
  const coinSymbol = loyaltyWallet?.[0]?.currency ?? '';
  const precision = loyaltyWallet?.[0]?.pointsPrecision;
  const {
    mutate,
    isPending: isLoadingRedeem,
    isSuccess,
    isError,
    error: errorRedeemStaking,
  } = useRedeemStaking();
  useHasWallet({});

  const available =
    parseFloat(data?.data?.summary?.availableToRedeem ?? '0') || 0;
  const delivering = parseFloat(data?.data?.summary?.delivering ?? '0') || 0;

  const columns = useMemo<DataTableColumn<SummaryDto>[]>(
    () => [
      {
        key: 'amount',
        header: translate('staking>summary>amount'),
        card: 'value',
        render: (row) => (
          <span className="pw-font-semibold">
            {formatAmount(row?.amount, locale, precision)}{' '}
            <span className="pw-text-[11px] pw-font-normal pw-text-[#6B7280]">
              {coinSymbol}
            </span>
          </span>
        ),
      },
      {
        key: 'createdAt',
        header: translate('staking>summary>createdAt'),
        card: 'title',
        render: (row) =>
          row.createdAt
            ? format(new Date(row.createdAt), 'dd/MM/yyyy HH:mm', {
                locale: dateLocale,
              })
            : '—',
      },
      {
        key: 'expiresAt',
        header: translate('staking>summary>expiresAt'),
        render: (row) =>
          row.expiresAt
            ? format(new Date(row.expiresAt), 'dd/MM/yyyy HH:mm', {
                locale: dateLocale,
              })
            : '—',
      },
      {
        key: 'status',
        header: translate('staking>summary>status'),
        card: 'badge',
        render: (row) =>
          row.isExpired ? (
            <StatusPill tone="grey">
              {translate('staking>summary>expired')}
            </StatusPill>
          ) : row.status !== 'deferred' ? (
            <StatusPill tone="ok">
              {translate('staking>summary>redeemedAt', {
                date: row.executeAt
                  ? format(new Date(row.executeAt), 'dd/MM/yyyy', {
                      locale: dateLocale,
                    })
                  : '',
              })}
            </StatusPill>
          ) : (
            <StatusPill tone="info">
              {translate('staking>summary>available')}
            </StatusPill>
          ),
      },
    ],
    [translate, locale, precision, coinSymbol, dateLocale]
  );

  const totalPages = data?.data?.meta?.totalPages ?? 1;

  return (
    <TranslatableComponent>
      <InternalPagesLayoutBase>
        <div className="pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0">
          <PageHeader
            title={translate('staking>summary>title')}
            subtitle={translate('staking>summary>subtitle')}
            actions={
              <BaseButton
                onClick={() => mutate()}
                disabled={isLoadingRedeem || isLoading || available === 0}
              >
                {isLoadingRedeem ? (
                  <Spinner className="!pw-w-4 !pw-h-4 !pw-border-2" />
                ) : (
                  translate('staking>summary>redeem')
                )}
              </BaseButton>
            }
          />
          {errorStaking ? (
            <ErrorBox customError={errorStaking} />
          ) : (
            <>
              <KpiRow>
                <KpiCard
                  variant="accent"
                  label={translate('staking>summary>valueToRedeem')}
                  value={formatAmount(available, locale, precision)}
                  unit={coinSymbol}
                  loading={isLoading}
                />
                {delivering > 0 ? (
                  <KpiCard
                    label={translate('staking>summary>deliverying')}
                    value={formatAmount(delivering, locale, precision)}
                    unit={coinSymbol}
                    tone="warn"
                  />
                ) : null}
              </KpiRow>
              <ErrorBox customError={errorRedeemStaking} />
              {isSuccess ? (
                <Alert variant="success">
                  {translate('staking>summary>success')}
                </Alert>
              ) : null}
              {isError ? (
                <Alert variant="error">
                  {translate('staking>summary>error')}
                </Alert>
              ) : null}
              <DataTable<SummaryDto>
                columns={columns}
                rows={data?.data?.items ?? []}
                rowKey={(row, index) =>
                  (row as { id?: string }).id ?? String(index)
                }
                loading={isLoading}
                emptyState={
                  <EmptyState title={translate('staking>summary>empty')} />
                }
                footer={
                  totalPages > 1 ? (
                    <>
                      <span />
                      <Pagination
                        pagesQuantity={totalPages}
                        currentPage={page}
                        onChangePage={setPage}
                      />
                    </>
                  ) : undefined
                }
              />
            </>
          )}
        </div>
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
