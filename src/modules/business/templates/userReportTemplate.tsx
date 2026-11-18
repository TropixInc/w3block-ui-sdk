/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';

import classNames from 'classnames';
import { format, subDays } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import _ from 'lodash';

import {
  Erc20TokenHistory,
  FromToInterface,
} from '../../dashboard/interface/ercTokenHistoryInterface';
import { BaseButton } from '../../shared/components/Buttons';
import { ErrorBox } from '../../shared/components/ErrorBox';
import { InternalPagesLayoutBase } from '../../shared/components/InternalPagesLayoutBase';
import { Pagination } from '../../shared/components/Pagination';
import {
  DataTable,
  DataTableColumn,
} from '../../shared/components/ui/DataTable';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { FilterBar } from '../../shared/components/ui/FilterBar';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { SegmentedControl } from '../../shared/components/ui/SegmentedControl';
import { StatusPill } from '../../shared/components/ui/StatusPill';
import { UI } from '../../shared/components/ui/tokens';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useGuardPagesWithOptions } from '../../shared/hooks/useGuardPagesWithOptions';
import { useLocale } from '../../shared/hooks/useLocale';
import { useProfile } from '../../shared/hooks/useProfile';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import useTranslation from '../../shared/hooks/useTranslation';
import { formatAmount } from '../../shared/utils/formatAmount';
import { useGetAllReportsAdmin } from '../hooks/useGetAllReportsAdmin';
import { useGetAllReportsByOperatorId } from '../hooks/useGetAllReportsByOperatorId';

type Period = 'all' | '7d' | '30d' | '90d';

const periodStart = (period: Period) => {
  const days =
    period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 0;
  return days ? subDays(new Date(), days).toISOString() : undefined;
};

/**
 * Usage report of the loyalty programme. Admins read the tenant-wide
 * history (and can narrow the period, which that route accepts); operators
 * read their own route, which only paginates. Same two sources as before.
 */
export const UserReportTemplate = () => {
  const { pushConnect } = useRouterConnect();
  const locale = useLocale();
  const [translate] = useTranslation();
  const [page, setPage] = useState(1);
  const [period, setPeriod] = useState<Period>('all');
  useGuardPagesWithOptions({ needBusiness: true, needUser: true });
  const { data: profile } = useProfile();
  const roles = (profile?.data?.roles ?? []) as string[];
  const isAdmin = roles.includes('admin') || roles.includes('superAdmin');

  const {
    data: adminHistory,
    error: errorAdmin,
    isLoading: loadingAdmin,
  } = useGetAllReportsAdmin({ page, createdAt_gte: periodStart(period) });
  const {
    data: loyaltyHistory,
    error: errorLoyaltyHistory,
    isLoading: loadingOperator,
  } = useGetAllReportsByOperatorId({ page });

  const source = useMemo(() => {
    if (isAdmin && adminHistory) return adminHistory;
    if (loyaltyHistory?.items?.length) return loyaltyHistory;
    return (
      adminHistory ?? loyaltyHistory ?? { items: [], meta: { totalPages: 1 } }
    );
  }, [isAdmin, adminHistory, loyaltyHistory]);
  const items: Erc20TokenHistory[] = (source?.items ?? []) as any;
  const totalPages = (source as any)?.meta?.totalPages ?? 1;
  const isLoading =
    (loadingAdmin || loadingOperator) && !adminHistory && !loyaltyHistory;

  const isLoad = (item: Erc20TokenHistory) => item.from == null;
  const party = (item: Erc20TokenHistory): FromToInterface | undefined =>
    (isLoad(item) ? item.to : item.from) ?? undefined;

  const description = (erc: Erc20TokenHistory) => {
    const meta: any = erc?.request?.metadata;
    const text: string | undefined = isLoad(erc)
      ? Array.isArray(meta)
        ? meta?.[0]?.description
        : meta?.description
      : meta?.description;
    const by = isLoad(erc)
      ? (Array.isArray(meta) ? meta?.[0]?.operatorName : meta?.operatorName)
        ? translate('business>userReportTemplate>byOperator', {
            name: Array.isArray(meta)
              ? meta?.[0]?.operatorName
              : meta?.operatorName,
          })
        : ''
      : erc?.from?.user_name
      ? translate('business>userReportTemplate>byUser', {
          name: erc.from.user_name,
        })
      : '';
    return { text: text && text !== 'undefined' ? text : '', by };
  };

  const columns = useMemo<DataTableColumn<Erc20TokenHistory>[]>(
    () => [
      {
        key: 'type',
        header: translate('business>userReportTemplate>type'),
        card: 'badge',
        render: (item) => (
          <StatusPill tone={isLoad(item) ? 'info' : 'ok'} size="sm">
            {isLoad(item)
              ? translate('business>userReportTemplate>load')
              : translate('business>userReportTemplate>use')}
          </StatusPill>
        ),
      },
      {
        key: 'customer',
        header: translate('business>userReportTemplate>customer'),
        card: 'title',
        render: (item) => {
          const p = party(item);
          return (
            <span className="pw-grid pw-min-w-0">
              <span
                className={classNames('pw-font-semibold pw-truncate', UI.text)}
              >
                {p?.user_name || p?.email || '—'}
              </span>
              {p?.email && p?.user_name ? (
                <span
                  className={classNames(
                    'pw-text-[11.5px] pw-truncate',
                    UI.textMuted
                  )}
                >
                  {p.email}
                </span>
              ) : null}
              {p?.phone || p?.cpf ? (
                <span
                  className={classNames(
                    'pw-text-[11px] pw-truncate',
                    UI.textFaint
                  )}
                >
                  {[p?.phone, p?.cpf].filter(Boolean).join(' · ')}
                </span>
              ) : null}
            </span>
          );
        },
      },
      {
        key: 'operator',
        header: translate('business>userReportTemplate>operator'),
        hideOnMobile: true,
        render: (item) =>
          _.get(item, 'loyaltiesTransactions[0].metadata.operatorName', '') ||
          '—',
      },
      {
        key: 'description',
        header: translate('business>userReportTemplate>description'),
        render: (item) => {
          const { text, by } = description(item);
          return (
            <span className="pw-grid pw-min-w-0 pw-max-w-[320px]">
              <span className={text ? UI.text : UI.textFaint}>
                {text || translate('business>userReportTemplate>noDescription')}
              </span>
              {by ? (
                <span className={classNames('pw-text-[11.5px]', UI.textMuted)}>
                  {by}
                </span>
              ) : null}
            </span>
          );
        },
      },
      {
        key: 'amount',
        header: translate('business>userReportTemplate>amount'),
        align: 'right',
        card: 'value',
        render: (item) => (
          <span className="pw-font-semibold">
            {formatAmount(item.request?.amount, locale)}
          </span>
        ),
      },
      {
        key: 'date',
        header: translate('business>userReportTemplate>date'),
        render: (item) =>
          item?.executeAt
            ? format(new Date(item.executeAt), 'dd/MM/yyyy HH:mm', {
                locale: locale === 'pt-BR' ? ptBR : enUS,
              })
            : '—',
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate, locale]
  );

  return (
    <InternalPagesLayoutBase>
      <div className="pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0">
        <PageHeader
          title={translate('business>userReportTemplate>useReports')}
          subtitle={translate('business>userReportTemplate>subtitle')}
          actions={
            <BaseButton
              onClick={() => pushConnect(PixwayAppRoutes.LOYALTY_PAYMENT)}
            >
              {translate('business>userReportTemplate>registerPayment')}
            </BaseButton>
          }
        />
        {errorLoyaltyHistory || errorAdmin ? (
          <>
            <ErrorBox customError={errorLoyaltyHistory} />
            <ErrorBox customError={errorAdmin} />
          </>
        ) : (
          <>
            {isAdmin ? (
              <FilterBar>
                <SegmentedControl<Period>
                  ariaLabel={translate('business>userReportTemplate>date')}
                  value={period}
                  onChange={(next) => {
                    setPeriod(next);
                    setPage(1);
                  }}
                  options={[
                    {
                      value: 'all',
                      label: translate(
                        'business>userReportTemplate>period>all'
                      ),
                    },
                    {
                      value: '7d',
                      label: translate('business>userReportTemplate>period>7d'),
                    },
                    {
                      value: '30d',
                      label: translate(
                        'business>userReportTemplate>period>30d'
                      ),
                    },
                    {
                      value: '90d',
                      label: translate(
                        'business>userReportTemplate>period>90d'
                      ),
                    },
                  ]}
                />
              </FilterBar>
            ) : null}
            <DataTable<Erc20TokenHistory>
              columns={columns}
              rows={items}
              rowKey={(item, index) => item.id ?? String(index)}
              loading={isLoading}
              emptyState={
                <EmptyState
                  title={translate('business>userReportTemplate>empty')}
                />
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
  );
};
