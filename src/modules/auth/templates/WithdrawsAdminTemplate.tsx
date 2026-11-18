/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';

import classNames from 'classnames';
import { format } from 'date-fns';

import { InternalPagesLayoutBase } from '../../shared/components/InternalPagesLayoutBase';
import { Pagination } from '../../shared/components/Pagination';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import {
  DataTable,
  DataTableColumn,
} from '../../shared/components/ui/DataTable';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { FilterBar } from '../../shared/components/ui/FilterBar';
import { KpiCard, KpiRow } from '../../shared/components/ui/KpiCard';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { SectionCard } from '../../shared/components/ui/SectionCard';
import { SegmentedControl } from '../../shared/components/ui/SegmentedControl';
import { StatusPill } from '../../shared/components/ui/StatusPill';
import { UI } from '../../shared/components/ui/tokens';
import { useGuardPagesWithOptions } from '../../shared/hooks/useGuardPagesWithOptions';
import { useLocale } from '../../shared/hooks/useLocale';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import useTranslation from '../../shared/hooks/useTranslation';
import { useUserWallet } from '../../shared/hooks/useUserWallet/useUserWallet';
import { formatAmount } from '../../shared/utils/formatAmount';
import {
  isWithdrawAwaitingAction,
  isWithdrawInProgress,
  WITHDRAW_IN_PROGRESS_STATUSES,
  WITHDRAW_NEEDS_ACTION_STATUSES,
  withdrawStatusLabelKey,
  withdrawStatusTone,
} from '../../shared/utils/withdrawStatus';
import WithdrawAdminActions from '../components/WithdrawAdminActions';
import {
  AdminWithdraw,
  countMatching,
  useGetAdminWithdraws,
} from '../hooks/useGetAdminWithdraws';

type Filter = 'all' | 'awaiting' | 'in_progress' | 'concluded' | 'failed';
const PAGE_SIZE = 10;
const KPI_SAMPLE = 100;

const FILTER_STATUSES: Record<
  Filter,
  ReadonlyArray<AdminWithdraw['status']> | undefined
> = {
  all: undefined,
  awaiting: WITHDRAW_NEEDS_ACTION_STATUSES,
  in_progress: ['escrowing_resources', 'transferring_funds'],
  concluded: ['concluded'],
  failed: ['failed', 'refused'],
};

const matchesFilter = (row: AdminWithdraw, filter: Filter) => {
  const statuses = FILTER_STATUSES[filter];
  return !statuses || statuses.includes(row.status);
};

const matchesSearch = (row: AdminWithdraw, term: string) => {
  if (!term) return true;
  const haystack = `${row.user?.name ?? ''} ${
    row.user?.email ?? ''
  }`.toLowerCase();
  return haystack.includes(term.toLowerCase());
};

const _WithdrawsAdminTemplateSDK = () => {
  const [translate] = useTranslation();
  const locale = useLocale();
  const router = useRouterConnect();
  const { loyaltyWallet } = useUserWallet();
  const wallet = loyaltyWallet?.[0];
  const currency = wallet?.currency ?? '';
  const precision = wallet?.pointsPrecision;
  const id = router.query.id as string;

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const { data, isLoading, isFetching } = useGetAdminWithdraws({
    page,
    limit: PAGE_SIZE,
    status: FILTER_STATUSES[filter],
    enabled: !id,
  });
  // KPIs: one sample per group. `countMatching` uses the server total when
  // the API honoured `status[]` and falls back to counting the sample.
  const { data: awaitingData } = useGetAdminWithdraws({
    limit: KPI_SAMPLE,
    status: WITHDRAW_NEEDS_ACTION_STATUSES,
    enabled: !id,
  });
  const { data: inProgressData } = useGetAdminWithdraws({
    limit: KPI_SAMPLE,
    status: WITHDRAW_IN_PROGRESS_STATUSES,
    enabled: !id,
  });
  const { data: concludedData } = useGetAdminWithdraws({
    limit: KPI_SAMPLE,
    status: ['concluded'],
    enabled: !id,
  });

  const awaitingCount = countMatching(awaitingData, (w) =>
    isWithdrawAwaitingAction(w.status)
  );
  const inProgressCount = countMatching(inProgressData, (w) =>
    isWithdrawInProgress(w.status)
  );
  const concludedCount = countMatching(
    concludedData,
    (w) => w.status === 'concluded'
  );

  const pageRows = (data?.items ?? []).filter((row) =>
    matchesFilter(row, filter)
  );
  const rows = pageRows.filter((row) => matchesSearch(row, search.trim()));
  const total = data?.meta?.totalItems ?? 0;
  const totalPages = data?.meta?.totalPages ?? 0;
  const from = total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(page * PAGE_SIZE, total);

  const columns = useMemo<DataTableColumn<AdminWithdraw>[]>(
    () => [
      {
        key: 'user',
        header: translate('token>pass>user'),
        card: 'title',
        render: (row) => {
          const name = row.user?.name?.trim();
          const email = row.user?.email?.trim();
          return (
            <span className="pw-grid pw-min-w-0">
              <span
                className={classNames('pw-font-semibold pw-truncate', UI.text)}
              >
                {name || email || '—'}
              </span>
              {name && email ? (
                <span
                  className={classNames(
                    'pw-text-[11.5px] pw-truncate',
                    UI.textMuted
                  )}
                >
                  {email}
                </span>
              ) : null}
            </span>
          );
        },
      },
      {
        key: 'createdAt',
        header: translate('auth>withdrawAdminActions>requestMade'),
        card: 'meta',
        render: (row) =>
          row.createdAt
            ? format(new Date(row.createdAt), 'dd/MM/yyyy HH:mm')
            : '—',
      },
      {
        key: 'amount',
        header: translate('pass>sharedOrder>value'),
        align: 'right',
        card: 'value',
        render: (row) => (
          <span className="pw-font-semibold pw-tabular-nums">
            {formatAmount(row.amount, locale, precision)}{' '}
            <span className="pw-text-[11px] pw-font-normal pw-text-[#6B7280]">
              {row.currency ?? currency}
            </span>
          </span>
        ),
      },
      {
        key: 'status',
        header: translate('token>pass>status'),
        card: 'badge',
        render: (row) => (
          <StatusPill tone={withdrawStatusTone(row.status)}>
            {translate(withdrawStatusLabelKey(row.status, 'admin'))}
          </StatusPill>
        ),
      },
      {
        key: 'chevron',
        header: '',
        align: 'right',
        card: 'hidden',
        width: '32px',
        render: () => <span className="pw-text-[#8B93A3]">›</span>,
      },
    ],
    [translate, locale, precision, currency]
  );

  const changeFilter = (next: Filter) => {
    setFilter(next);
    setPage(1);
  };

  return (
    <div className="pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0">
      <PageHeader
        title={translate('auth>withdrawModal>withdrawReports')}
        subtitle={translate('auth>withdrawsAdmin>subtitle')}
      />

      {id ? (
        <SectionCard>
          <WithdrawAdminActions id={id} />
        </SectionCard>
      ) : (
        <>
          <KpiRow>
            <KpiCard
              variant="accent"
              label={translate('auth>withdrawStatus>awaitingAction')}
              value={awaitingCount}
              tone={awaitingCount > 0 ? 'warn' : undefined}
              hint={translate('auth>withdrawsAdmin>awaitingHint')}
              loading={!awaitingData}
            />
            <KpiCard
              label={translate('auth>withdraws>inProgress')}
              value={inProgressCount}
              hint={translate('auth>withdrawsAdmin>inProgressHint')}
              loading={!inProgressData}
            />
            <KpiCard
              label={translate('auth>withdrawStatus>concluded')}
              value={concludedCount}
              tone={concludedCount > 0 ? 'ok' : undefined}
              hint={translate('auth>withdrawsAdmin>concludedHint')}
              loading={!concludedData}
            />
          </KpiRow>

          <FilterBar
            trailing={
              <label className="pw-relative pw-block pw-w-full sm:pw-w-[260px]">
                <span className="pw-sr-only">
                  {translate('auth>withdrawsAdmin>searchPlaceholder')}
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={translate(
                    'auth>withdrawsAdmin>searchPlaceholder'
                  )}
                  className={classNames(
                    'pw-w-full pw-h-9 pw-pl-3 pw-pr-3 pw-rounded-lg pw-border pw-border-[#E6E8EC] pw-bg-white pw-text-[13px] pw-text-[#0F1729] placeholder:pw-text-[#8B93A3]',
                    UI.focusRing
                  )}
                />
              </label>
            }
          >
            <SegmentedControl<Filter>
              ariaLabel={translate('token>pass>status')}
              value={filter}
              onChange={changeFilter}
              options={[
                { value: 'all', label: translate('auth>withdraws>filterAll') },
                {
                  value: 'awaiting',
                  label: translate('auth>withdrawsAdmin>filterAwaiting'),
                },
                {
                  value: 'in_progress',
                  label: translate('auth>withdraws>filterInProgress'),
                },
                {
                  value: 'concluded',
                  label: translate('auth>withdraws>filterConcluded'),
                },
                {
                  value: 'failed',
                  label: translate('auth>withdrawsAdmin>filterFailed'),
                },
              ]}
            />
          </FilterBar>

          <DataTable<AdminWithdraw>
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            onRowClick={(row) =>
              router.pushConnect(`/withdraws/admin?id=${row.id}`)
            }
            loading={isLoading || (isFetching && !data)}
            emptyState={
              <EmptyState
                title={
                  search.trim()
                    ? translate('auth>withdrawsAdmin>emptySearch')
                    : filter === 'all'
                    ? translate('auth>withdrawsAdmin>empty')
                    : translate('auth>withdraws>emptyFiltered')
                }
                description={
                  search.trim()
                    ? translate('auth>withdrawsAdmin>emptySearchDescription')
                    : undefined
                }
              />
            }
            footer={
              total > 0 ? (
                <>
                  <span>
                    {search.trim()
                      ? translate('auth>withdrawsAdmin>showingOnPage', {
                          count: rows.length,
                          pageCount: pageRows.length,
                        })
                      : translate('auth>withdrawsAdmin>showing', {
                          from,
                          to,
                          total,
                        })}
                  </span>
                  {totalPages > 1 ? (
                    <Pagination
                      pagesQuantity={totalPages}
                      currentPage={page}
                      onChangePage={setPage}
                    />
                  ) : null}
                </>
              ) : undefined
            }
          />
        </>
      )}
    </div>
  );
};

export const WithdrawsAdminTemplateSDK = () => {
  useGuardPagesWithOptions({ needAdmin: true });
  return (
    <TranslatableComponent>
      <InternalPagesLayoutBase
        classes={{ middleSectionContainer: 'pw-mb-[85px]' }}
      >
        <_WithdrawsAdminTemplateSDK />
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
