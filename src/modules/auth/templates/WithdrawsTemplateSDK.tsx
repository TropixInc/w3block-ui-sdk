/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';

import { format } from 'date-fns';

import { BaseButton } from '../../shared/components/Buttons';
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
import { useLocale } from '../../shared/hooks/useLocale';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import useTranslation from '../../shared/hooks/useTranslation';
import { useUserWallet } from '../../shared/hooks/useUserWallet/useUserWallet';
import { formatAmount } from '../../shared/utils/formatAmount';
import {
  isWithdrawInProgress,
  sumAmounts,
  WITHDRAW_IN_PROGRESS_STATUSES,
  withdrawStatusLabelKey,
  withdrawStatusTone,
} from '../../shared/utils/withdrawStatus';
import WithdrawInternal from '../components/WithdrawInternal';
import WithdrawModal from '../components/WithdrawModal';
import {
  UserWithdraw,
  useGetUserWithdraws,
} from '../hooks/useGetUserWithdraws';

type Filter = 'all' | 'in_progress' | 'concluded';
const PAGE_SIZE = 10;

const _WithdrawsTemplateSDK = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<Filter>('all');
  const [translate] = useTranslation();
  const locale = useLocale();
  const router = useRouterConnect();
  const { loyaltyWallet } = useUserWallet();
  const wallet = loyaltyWallet?.[0];
  const currency = wallet?.currency ?? '';
  const precision = wallet?.pointsPrecision;
  const id = router.query.id as string;

  const statusFilter =
    filter === 'in_progress'
      ? WITHDRAW_IN_PROGRESS_STATUSES
      : filter === 'concluded'
      ? (['concluded'] as const)
      : undefined;

  const { data, isLoading, isFetching } = useGetUserWithdraws({
    page,
    limit: PAGE_SIZE,
    status: statusFilter,
    enabled: !id,
  });
  const { data: inProgress } = useGetUserWithdraws({
    page: 1,
    limit: 50,
    status: WITHDRAW_IN_PROGRESS_STATUSES,
  });
  // Filter again on the client: if the API ignores `status[]` the KPI must
  // still only count what is really in progress.
  const inProgressItems = (inProgress?.items ?? []).filter((item) =>
    isWithdrawInProgress(item.status)
  );
  const inProgressTotal = sumAmounts(inProgressItems);
  const inProgressCount = inProgressItems.length;

  const rows = (data?.items ?? []).filter((row) =>
    filter === 'all'
      ? true
      : filter === 'in_progress'
      ? isWithdrawInProgress(row.status)
      : row.status === 'concluded'
  );
  const total = data?.meta?.totalItems ?? 0;
  const totalPages = data?.meta?.totalPages ?? 0;
  const from = total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(page * PAGE_SIZE, total);

  const columns = useMemo<DataTableColumn<UserWithdraw>[]>(
    () => [
      {
        key: 'createdAt',
        header: translate('auth>withdrawAdminActions>requestMade'),
        card: 'title',
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
          <span className="pw-font-semibold">
            {formatAmount(row.amount, locale, precision)}{' '}
            <span className="pw-text-[11px] pw-font-normal pw-text-[#6B7280]">
              {currency}
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
            {translate(withdrawStatusLabelKey(row.status))}
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

  const openDetail = (row: UserWithdraw) =>
    router.pushConnect(`/withdraws?id=${row.id}`);
  const changeFilter = (next: Filter) => {
    setFilter(next);
    setPage(1);
  };

  const makeWithdrawButton = (
    <BaseButton onClick={() => setIsOpen(true)}>
      {translate('auth>withdrawModal>makeWithdraw')}
    </BaseButton>
  );

  return (
    <div className="pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0">
      <PageHeader
        title={translate('components>menu>withdraws')}
        subtitle={translate('auth>withdraws>subtitle')}
        actions={!isOpen && !id ? makeWithdrawButton : undefined}
      />

      {isOpen ? (
        <SectionCard>
          <WithdrawModal
            onClose={() => setIsOpen(false)}
            balance={wallet?.withdrawableBalance}
            contractId={wallet?.contractId}
            currency={currency}
          />
        </SectionCard>
      ) : id ? (
        <SectionCard>
          <WithdrawInternal
            id={id}
            currency={currency}
            pointsPrecision={precision}
            onRequestAgain={() => {
              router.pushConnect('/withdraws');
              setIsOpen(true);
            }}
          />
        </SectionCard>
      ) : (
        <>
          <KpiRow>
            <KpiCard
              variant="accent"
              label={translate('wallet>overview>withdrawable')}
              value={formatAmount(
                wallet?.withdrawableBalance ?? 0,
                locale,
                precision
              )}
              unit={currency}
              loading={!wallet}
            />
            <KpiCard
              label={translate('auth>withdraws>inProgress')}
              value={formatAmount(inProgressTotal, locale, precision)}
              unit={currency}
              tone={inProgressTotal > 0 ? 'warn' : undefined}
              hint={
                inProgressCount > 0
                  ? translate('auth>withdraws>inProgressCount', {
                      count: inProgressCount,
                    })
                  : translate('auth>withdraws>noneInProgress')
              }
            />
          </KpiRow>

          <FilterBar>
            <SegmentedControl<Filter>
              ariaLabel={translate('token>pass>status')}
              value={filter}
              onChange={changeFilter}
              options={[
                { value: 'all', label: translate('auth>withdraws>filterAll') },
                {
                  value: 'in_progress',
                  label: translate('auth>withdraws>filterInProgress'),
                },
                {
                  value: 'concluded',
                  label: translate('auth>withdraws>filterConcluded'),
                },
              ]}
            />
          </FilterBar>

          <DataTable<UserWithdraw>
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            onRowClick={openDetail}
            loading={isLoading || (isFetching && !data)}
            emptyState={
              <EmptyState
                title={
                  filter === 'all'
                    ? translate('auth>withdraws>empty')
                    : translate('auth>withdraws>emptyFiltered')
                }
                description={
                  filter === 'all'
                    ? translate('auth>withdraws>emptyDescription')
                    : undefined
                }
                action={filter === 'all' ? makeWithdrawButton : undefined}
              />
            }
            footer={
              total > 0 ? (
                <>
                  <span>
                    {translate('auth>withdraws>showing', { from, to, total })}
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

export const WithdrawsTemplateSDK = () => {
  return (
    <TranslatableComponent>
      <InternalPagesLayoutBase
        classes={{ middleSectionContainer: 'pw-mb-[85px]' }}
      >
        <_WithdrawsTemplateSDK />
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
