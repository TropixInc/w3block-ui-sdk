/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';

import fileDownload from 'js-file-download';

import { useGetDeferred } from '../../business/hooks/useGetDeferred';
import { useGetDeferredByUserId } from '../../business/hooks/useGetDeferredByUserId';
import { useGetXlsxDeferred } from '../../business/hooks/useGetXlsxDeferred';
import { DateFilterWithOptions } from '../../shared/components/DateFilterWithOptions';
import { ErrorBox } from '../../shared/components/ErrorBox';
import GenericSearchFilter from '../../shared/components/GenericSearchFilter';
import { InternalPagesLayoutBase } from '../../shared/components/InternalPagesLayoutBase';
import { Pagination } from '../../shared/components/Pagination';
import { SelectInput } from '../../shared/components/SelectInput';
import { Spinner } from '../../shared/components/Spinner';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useGetUserByTenant } from '../../shared/hooks/useGetUsersByTenant';
import { useGuardPagesWithOptions } from '../../shared/hooks/useGuardPagesWithOptions';
import { useLocale } from '../../shared/hooks/useLocale';
import { useProfile } from '../../shared/hooks/useProfile';
import useTranslation from '../../shared/hooks/useTranslation';
import { useUserWallet } from '../../shared/hooks/useUserWallet/useUserWallet';
import { ReceiptQRCode } from '../components/ReceiptQRCode';
import { FutureStatementTable } from '../components/statement/FutureStatementTable';
import { SegmentedControl } from '../components/statement/SegmentedControl';
import {
  STATEMENT_MOCK_FALLBACK,
  formatPoints,
} from '../components/statement/settlement';
import { StatementKpiCard } from '../components/statement/StatementKpiCard';
import { useGetApi } from '../hook/useGetApi';

type StatusFilter = 'scheduled' | 'received' | 'all';
type RangeBy = 'createdAt' | 'withdrawableAt';

/** Tenant que usa a lista de restaurantes no lugar da busca de usuário (regra existente). */
const RESTAURANTS_COMPANY_ID = 'ef41dc3f-d9e4-4ca4-8270-673d68f4f490';

const CARD =
  'pw-rounded-[10px] pw-bg-white pw-shadow-[0_2px_8px_rgba(0,0,0,.06)]';

export const WalletFutureStatementTemplateSDK = () => {
  const [translate] = useTranslation();
  const locale = useLocale();
  const { loyaltyWallet } = useUserWallet();
  const { companyId } = useCompanyConfig();
  const { data: profile } = useProfile();

  const loyaltyWalletDefined = useMemo(
    () => (loyaltyWallet.length ? loyaltyWallet[0] : undefined),
    [loyaltyWallet]
  );
  const currency = loyaltyWalletDefined?.currency ?? '';
  const pointsPrecision = loyaltyWalletDefined?.pointsPrecision ?? 'decimal';

  const userRoles = profile?.data.roles || [];
  const isAdmin = Boolean(
    userRoles?.includes('admin') || userRoles?.includes('superAdmin')
  );
  const usesRestaurantList = isAdmin && companyId === RESTAURANTS_COMPANY_ID;

  const [actualPage, setActualPage] = useState(1);
  const [defaultDate, setDefaultDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | string>();
  const [endDate, setEndDate] = useState<Date | string>();
  const [rangeBy, setRangeBy] = useState<RangeBy>('createdAt');
  const [selectedWallet, setSelectedWallet] = useState<string | undefined>('');
  const [status, setStatus] = useState<StatusFilter>('scheduled');
  const [showOptions, setShowOptions] = useState(false);
  const [search, setSearch] = useState('');
  const [receiptDeliverId, setReceiptDeliverId] = useState<
    string | undefined
  >();
  const [loadingDownload, setLoadingDownload] = useState(false);

  const baseFilter = useMemo(
    () => ({
      sortBy: 'createdAt',
      orderBy: 'DESC',
      loyaltyId: loyaltyWalletDefined?.loyaltyId,
      startDate: startDate ? new Date(startDate).toISOString() : '',
      endDate: endDate ? new Date(endDate).toISOString() : '',
      rangeDateBy: rangeBy,
    }),
    [loyaltyWalletDefined?.loyaltyId, startDate, endDate, rangeBy]
  );

  const userId = profile?.data?.id ?? '';
  const userEnabled = !!loyaltyWalletDefined && !isAdmin;
  const adminEnabled = !!loyaltyWalletDefined && isAdmin;
  const adminFilter = { ...baseFilter, walletAddress: selectedWallet };

  // Lista (mesmas chamadas e filtros de antes).
  const userList = useGetDeferredByUserId(
    userId,
    { ...baseFilter, page: actualPage },
    userEnabled,
    status
  );
  const adminList = useGetDeferred(
    { ...adminFilter, page: actualPage },
    adminEnabled,
    status
  );

  // Cards de resumo: mesmo endpoint, limit=1, só para summary.balance e meta.totalItems.
  const userScheduled = useGetDeferredByUserId(
    userId,
    { ...baseFilter, limit: 1 },
    userEnabled,
    'scheduled'
  );
  const userReceived = useGetDeferredByUserId(
    userId,
    { ...baseFilter, limit: 1 },
    userEnabled,
    'received'
  );
  const adminScheduled = useGetDeferred(
    { ...adminFilter, limit: 1 },
    adminEnabled,
    'scheduled'
  );
  const adminReceived = useGetDeferred(
    { ...adminFilter, limit: 1 },
    adminEnabled,
    'received'
  );

  const list = isAdmin ? adminList : userList;
  const scheduled = isAdmin ? adminScheduled : userScheduled;
  const received = isAdmin ? adminReceived : userReceived;

  const { data: restaurants } = useGetApi({ enabled: usesRestaurantList });
  const { data: userData } = useGetUserByTenant({
    enabled: isAdmin && !usesRestaurantList,
    params: { search },
  });
  const { mutate: getXlsx } = useGetXlsxDeferred();

  useGuardPagesWithOptions({
    needUser: true,
    redirectPage: PixwayAppRoutes.SIGN_IN,
  });

  useEffect(() => {
    setActualPage(1);
  }, [rangeBy, selectedWallet, status, startDate, endDate]);

  const restaurantOptions = restaurants?.data?.data?.map(
    (res: { attributes: { name: string; walletAddress: string } }) => ({
      label: res?.attributes?.name,
      value: res?.attributes?.walletAddress,
    })
  );

  const userOptions = useMemo(
    () =>
      userData?.data?.items
        .filter((res) => res?.mainWallet?.address)
        .map((res) => ({
          label: res?.name ?? res?.email,
          value: res?.mainWallet?.address,
        })),
    [userData?.data?.items]
  );

  const initDownload = () => {
    setLoadingDownload(true);
    getXlsx(
      {
        filter: {
          ...baseFilter,
          walletAddress: isAdmin
            ? selectedWallet
            : profile?.data?.mainWallet?.address ?? '',
        },
        status,
      },
      {
        onSuccess: (data) => {
          if (data?.data) fileDownload(data?.data, 'relatorioExport.xlsx');
          setLoadingDownload(false);
        },
        onError: () => setLoadingDownload(false),
      }
    );
  };

  const clearFilters = () => {
    setStatus('scheduled');
    setRangeBy('createdAt');
    setStartDate('');
    setEndDate('');
    setSelectedWallet('');
    setSearch('');
  };

  const items: any[] = list.data?.items ?? [];
  const meta = list.data?.meta;
  const summaryAmount = (query: {
    data?: { summary?: { balance?: number } };
  }) =>
    query.data?.summary?.balance !== undefined
      ? formatPoints(query.data.summary.balance, pointsPrecision, locale)
      : '—';
  const summaryCount = (query: { data?: { meta?: { totalItems?: number } } }) =>
    query.data?.meta?.totalItems !== undefined
      ? translate('statement>future>purchases', {
          count: query.data.meta.totalItems,
        })
      : undefined;

  const hasMockSettlement =
    STATEMENT_MOCK_FALLBACK && items.some((item) => !item?.settlement);

  if (list.error) {
    return (
      <InternalPagesLayoutBase>
        <ErrorBox customError={list.error} />
      </InternalPagesLayoutBase>
    );
  }

  return (
    <InternalPagesLayoutBase>
      <div className="pw-mx-4 sm:pw-mx-0 pw-flex pw-flex-col pw-gap-4">
        <div
          className={`${CARD} pw-flex pw-flex-wrap pw-items-start pw-justify-between pw-gap-4 pw-p-5 sm:pw-px-6`}
        >
          <div className="pw-flex pw-max-w-[620px] pw-flex-col pw-gap-1">
            <h1 className="pw-m-0 pw-text-[20px] sm:pw-text-[23px] pw-font-semibold pw-text-[#0f1729]">
              {translate('statement>future>title')}
            </h1>
            <p className="pw-text-[13px] pw-text-[#6b7280]">
              {translate(
                isAdmin
                  ? 'statement>future>adminSubtitle'
                  : 'statement>future>subtitle'
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={initDownload}
            disabled={loadingDownload}
            className="pw-inline-flex pw-h-11 sm:pw-h-10 pw-w-full sm:pw-w-auto pw-items-center pw-justify-center pw-gap-2 pw-rounded-lg pw-border pw-border-[#e6e8ec] pw-bg-white pw-px-4 pw-text-[14px] pw-font-medium pw-text-[#4a5567] hover:pw-bg-[#F8FAFC] disabled:pw-opacity-50"
          >
            {loadingDownload ? (
              <Spinner className="pw-h-4 pw-w-4 !pw-border-2" />
            ) : (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
              </svg>
            )}
            {translate('statement>future>download')}
          </button>
        </div>

        <div className="pw-grid pw-grid-cols-2 sm:pw-grid-cols-3 pw-gap-3 sm:pw-gap-4">
          <StatementKpiCard
            label={translate('statement>future>kpiScheduled')}
            value={summaryAmount(scheduled)}
            currency={currency}
            hint={summaryCount(scheduled)}
            loading={scheduled.isFetching && !scheduled.data}
          />
          <StatementKpiCard
            label={translate('statement>future>kpiReceived')}
            value={summaryAmount(received)}
            currency={currency}
            hint={summaryCount(received)}
            loading={received.isFetching && !received.data}
            tone="positive"
          />
          <StatementKpiCard
            label={translate('statement>future>kpiWithdrawable')}
            value={formatPoints(
              loyaltyWalletDefined?.withdrawableBalance,
              pointsPrecision,
              locale
            )}
            currency={currency}
            hint={translate('statement>future>kpiWithdrawableHint')}
            tone="accent"
            className="pw-col-span-2 sm:pw-col-span-1"
          />
        </div>

        <div
          className={`${CARD} pw-flex pw-flex-col sm:pw-flex-row sm:pw-flex-wrap sm:pw-items-center pw-gap-3 pw-p-4 sm:pw-px-5`}
        >
          <SegmentedControl<StatusFilter>
            ariaLabel={translate('statement>future>filterStatusLabel')}
            value={status}
            onChange={setStatus}
            options={[
              {
                value: 'scheduled',
                label: translate('statement>future>filterScheduled'),
              },
              {
                value: 'received',
                label: translate('statement>future>filterReceived'),
              },
              { value: 'all', label: translate('statement>future>filterAll') },
            ]}
          />
          <SelectInput
            options={[
              {
                label: translate('statement>future>byPurchaseDate'),
                value: 'createdAt',
              },
              {
                label: translate('statement>future>byReceiptDate'),
                value: 'withdrawableAt',
              },
            ]}
            selected={rangeBy}
            onChange={(value) => setRangeBy(value as RangeBy)}
            placeholder={translate('statement>future>byPurchaseDate')}
            className="sm:pw-w-[200px] pw-w-full"
            hideFirstOption
          />
          <DateFilterWithOptions
            onChangeStartDate={setStartDate}
            onChangeEndDate={setEndDate}
            defaultDate={defaultDate}
            onChangeDefaultDate={setDefaultDate}
            onCancel={() => {
              setStartDate('');
              setEndDate('');
            }}
            startDate={startDate as Date}
            endDate={endDate as Date}
          />
          {isAdmin ? (
            usesRestaurantList ? (
              <SelectInput
                options={restaurantOptions ?? []}
                selected={selectedWallet ?? ''}
                onChange={setSelectedWallet}
                placeholder={translate('statement>future>restaurants')}
                className="sm:pw-w-[250px] pw-w-full"
              />
            ) : (
              <GenericSearchFilter
                onSearch={setSearch}
                search={search}
                showResponseModal={showOptions}
                onShowResponseModal={setShowOptions}
                items={userOptions ?? []}
                inputPlaceholder={translate('statement>future>searchUser')}
                classes={{
                  root: 'sm:!pw-w-[300px] !pw-w-full pw-h-11',
                  input:
                    'sm:!pw-w-[300px] !pw-w-full !pw-text-black !pw-placeholder-black pw-opacity-80',
                }}
                onSelectItemById={setSelectedWallet}
              />
            )
          ) : null}
          <button
            type="button"
            onClick={clearFilters}
            className="pw-text-[13px] pw-text-[#0050FF] hover:pw-underline sm:pw-ml-auto pw-self-start sm:pw-self-auto"
          >
            {translate('statement>future>clearFilters')}
          </button>
        </div>

        {list.isFetching && !list.data ? (
          <div className="pw-flex pw-justify-center pw-py-10">
            <Spinner className="pw-h-10 pw-w-10" />
          </div>
        ) : items.length ? (
          <>
            <FutureStatementTable
              items={items}
              currency={currency}
              pointsPrecision={pointsPrecision}
              showEstablishment={isAdmin}
              onOpenReceipt={setReceiptDeliverId}
            />
            <div className="pw-flex pw-flex-wrap pw-items-center pw-justify-between pw-gap-3 pw-text-[13px] pw-text-[#4a5567]">
              <span>
                {meta
                  ? translate('statement>future>showing', {
                      from: (meta.currentPage - 1) * meta.itemsPerPage + 1,
                      to:
                        (meta.currentPage - 1) * meta.itemsPerPage +
                        meta.itemCount,
                      total: meta.totalItems,
                    })
                  : ''}
                {hasMockSettlement ? (
                  <span className="pw-block sm:pw-inline sm:pw-ml-2 pw-text-[#9a6508]">
                    {translate('statement>settlement>mockFootnote')}
                  </span>
                ) : null}
              </span>
              {meta && meta.totalPages > 1 ? (
                <Pagination
                  pagesQuantity={meta.totalPages}
                  currentPage={actualPage}
                  onChangePage={setActualPage}
                />
              ) : null}
            </div>
          </>
        ) : (
          <div
            className={`${CARD} pw-p-8 pw-text-center pw-text-[13px] pw-text-[#6b7280]`}
          >
            {translate('statement>future>empty')}
          </div>
        )}
      </div>
      <ReceiptQRCode
        deliverId={receiptDeliverId}
        isOpen={!!receiptDeliverId}
        onClose={() => setReceiptDeliverId(undefined)}
      />
    </InternalPagesLayoutBase>
  );
};
