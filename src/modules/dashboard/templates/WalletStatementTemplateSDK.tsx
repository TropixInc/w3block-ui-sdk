/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import { isAfter, isBefore } from 'date-fns';

import CopyIcon from '../../shared/assets/icons/copyIconOutlined.svg';
import { ErrorBox } from '../../shared/components/ErrorBox';
import { InternalPagesLayoutBase } from '../../shared/components/InternalPagesLayoutBase';
import { Pagination } from '../../shared/components/Pagination';
import { Spinner } from '../../shared/components/Spinner';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useGuardPagesWithOptions } from '../../shared/hooks/useGuardPagesWithOptions';
import { useLocale } from '../../shared/hooks/useLocale';
import useTranslation from '../../shared/hooks/useTranslation';
import { useUserWallet } from '../../shared/hooks/useUserWallet/useUserWallet';
import {
  StatementScreenTransaction,
  getSubtransactions,
} from '../../shared/utils/getSubtransactions';
import { useThemeConfig } from '../../storefront/hooks/useThemeConfig';
import { ReceiptQRCode } from '../components/ReceiptQRCode';
import { SegmentedControl } from '../components/statement/SegmentedControl';
import {
  STATEMENT_MOCK_FALLBACK,
  formatPoints,
} from '../components/statement/settlement';
import {
  StatementDayList,
  StatementTypeFilter,
} from '../components/statement/StatementDayList';
import { useGetErcTokensHistory } from '../hook/useGetErcTokensHistory';

const CARD =
  'pw-rounded-[10px] pw-bg-white pw-shadow-[0_2px_8px_rgba(0,0,0,.06)]';

export const WalletStatementTemplateSDK = () => {
  const [translate] = useTranslation();
  const locale = useLocale();
  const { loyaltyWallet, mainWallet } = useUserWallet();
  const { defaultTheme } = useThemeConfig();
  const [actualPage, setActualPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<StatementTypeFilter>('all');
  const [receiptDeliverId, setReceiptDeliverId] = useState<
    string | undefined
  >();
  const [copied, setCopied] = useState(false);
  const [, copy] = useCopyToClipboard();

  const loyaltyWalletDefined = useMemo(
    () => (loyaltyWallet.length ? loyaltyWallet[0] : undefined),
    [loyaltyWallet]
  );
  const currency = loyaltyWalletDefined?.currency ?? '';
  const pointsPrecision = loyaltyWalletDefined?.pointsPrecision ?? 'decimal';
  const hideWallet =
    defaultTheme?.configurations?.contentData?.hideWalletAddress;

  const { data, isFetching, error } = useGetErcTokensHistory(
    loyaltyWalletDefined?.contractId,
    {
      page: actualPage,
    }
  );

  const subTransactions = useMemo(() => {
    const arr: StatementScreenTransaction[] = [];
    data?.items?.forEach((item) => {
      getSubtransactions(item, defaultTheme).forEach((t) => arr.push(t));
    });
    arr.sort((a: any, b: any) => {
      const dateA = Date.parse(a?.createdAt);
      const dateB = Date.parse(b?.createdAt);
      if (isBefore(dateA, dateB)) return 1;
      if (isAfter(dateA, dateB)) return -1;
      return 0;
    });
    return arr;
  }, [data?.items, defaultTheme]);

  const hasMockSettlement =
    STATEMENT_MOCK_FALLBACK &&
    subTransactions.some(
      (item) => item.releasedAt && !item.settlement?.settlement
    );

  useGuardPagesWithOptions({
    needUser: true,
    redirectPage: PixwayAppRoutes.SIGN_IN,
  });

  const copyAddress = () => {
    copy(mainWallet?.address || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  const address = mainWallet?.address || '';
  const shortAddress =
    address.length > 12
      ? `${address.slice(0, 6)}…${address.slice(-4)}`
      : address || '-';

  return (
    <InternalPagesLayoutBase>
      <div className="pw-mx-4 sm:pw-mx-0 pw-flex pw-flex-col pw-gap-4">
        <div
          className={`${CARD} pw-flex pw-flex-wrap pw-items-start pw-justify-between pw-gap-4 pw-p-5 sm:pw-px-6`}
        >
          <div className="pw-flex pw-flex-col pw-gap-1.5">
            <h1 className="pw-m-0 pw-text-[20px] sm:pw-text-[23px] pw-font-semibold pw-text-[#0f1729]">
              {translate('wallet>page>extract')}
            </h1>
            {!hideWallet ? (
              <span className="pw-flex pw-items-center pw-gap-1 pw-text-[12px] pw-text-[#6b7280]">
                {translate('statement>extract>wallet')}{' '}
                <span className="pw-font-mono" title={address}>
                  {shortAddress}
                </span>
                <button
                  type="button"
                  onClick={copyAddress}
                  aria-label={translate('statement>extract>copy')}
                  className="pw-inline-flex pw-h-6 pw-w-6 pw-items-center pw-justify-center pw-text-[#6b7280] hover:pw-text-[#0f1729]"
                >
                  <CopyIcon className="pw-h-[13px] pw-w-[13px] pw-stroke-current" />
                </button>
                {copied ? (
                  <span className="pw-rounded-md pw-bg-[#E6E8EC] pw-px-2 pw-py-0.5 pw-text-[11px] pw-text-[#353945]">
                    {translate('components>menu>copied')}
                  </span>
                ) : null}
              </span>
            ) : null}
            <span className="pw-flex pw-items-center pw-gap-1.5 pw-text-[12px] pw-text-[#6b7280]">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              {translate('dashboard>receiptQRCode>creditsTakeTwoHors')}
            </span>
          </div>
          {loyaltyWalletDefined ? (
            <div className="pw-flex pw-flex-col pw-items-start sm:pw-items-end pw-gap-0.5">
              <span className="pw-text-[11px] pw-font-semibold pw-uppercase pw-tracking-[.04em] pw-text-[#6b7280]">
                {translate('statement>extract>balance')}
              </span>
              <span className="pw-text-[26px] sm:pw-text-[28px] pw-font-bold pw-leading-tight pw-text-[#0f1729]">
                {formatPoints(
                  loyaltyWalletDefined.balance,
                  pointsPrecision,
                  locale
                )}
                <span className="pw-ml-1 pw-text-[14px] pw-font-normal pw-text-[#6b7280]">
                  {currency}
                </span>
              </span>
              {loyaltyWalletDefined.withdrawableBalance !== undefined ? (
                <span className="pw-text-[12px] pw-text-[#6b7280]">
                  {translate('statement>extract>withdrawable', {
                    amount: formatPoints(
                      loyaltyWalletDefined.withdrawableBalance,
                      pointsPrecision,
                      locale
                    ),
                    currency,
                  })}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        {error ? (
          <ErrorBox customError={error} />
        ) : (
          <div
            className={`${CARD} pw-flex pw-flex-col pw-px-4 sm:pw-px-5 pw-pt-4 pw-pb-3`}
          >
            <div className="pw-flex pw-flex-wrap pw-items-center pw-justify-between pw-gap-3 pw-pb-2">
              <h2 className="pw-m-0 pw-text-[16px] pw-font-semibold pw-text-[#0f1729]">
                {translate('statement>extract>movements')}
              </h2>
              <SegmentedControl<StatementTypeFilter>
                ariaLabel={translate('statement>extract>filterTypeLabel')}
                value={typeFilter}
                onChange={setTypeFilter}
                options={[
                  {
                    value: 'all',
                    label: translate('statement>extract>filterAll'),
                  },
                  {
                    value: 'in',
                    label: translate('statement>extract>filterIn'),
                  },
                  {
                    value: 'out',
                    label: translate('statement>extract>filterOut'),
                  },
                ]}
              />
            </div>
            {isFetching && !data ? (
              <div className="pw-flex pw-justify-center pw-py-10">
                <Spinner className="pw-h-10 pw-w-10" />
              </div>
            ) : (
              <StatementDayList
                items={subTransactions}
                currency={currency}
                pointsPrecision={pointsPrecision}
                typeFilter={typeFilter}
                onOpenReceipt={setReceiptDeliverId}
                emptyText={translate(
                  'dashboard>walletStatementTemplateSDK>releasesNotFound'
                )}
              />
            )}
            <div className="pw-flex pw-flex-wrap pw-items-center pw-justify-between pw-gap-3 pw-border-t pw-border-[#e6e8ec] pw-pt-3 pw-text-[13px] pw-text-[#4a5567]">
              <span>
                {data?.meta
                  ? translate('statement>extract>page', {
                      page: data.meta.currentPage,
                      total: data.meta.totalPages,
                    })
                  : ''}
                {hasMockSettlement ? (
                  <span className="pw-block sm:pw-inline sm:pw-ml-2 pw-text-[#9a6508]">
                    {translate('statement>settlement>mockFootnote')}
                  </span>
                ) : null}
              </span>
              {data?.meta && data.meta.totalPages > 1 ? (
                <Pagination
                  pagesQuantity={data.meta.totalPages}
                  currentPage={actualPage}
                  onChangePage={setActualPage}
                />
              ) : null}
            </div>
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
