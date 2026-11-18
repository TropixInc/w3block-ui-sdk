/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import { UserRoleEnum } from '@w3block/sdk-id';
import classNames from 'classnames';
import { format } from 'date-fns';

import CopyIcon from '../../assets/icons/copyIconOutlined.svg';
import { useGetDeferredByUserId } from '../../../business/hooks/useGetDeferredByUserId';
import { useGetErcTokensHistory } from '../../../dashboard/hook/useGetErcTokensHistory';
import { useThemeConfig } from '../../../storefront/hooks/useThemeConfig';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../hooks/useCompanyConfig';
import { useIsHiddenMenuItem } from '../../hooks/useIsHiddenMenuItem';
import { useLocale } from '../../hooks/useLocale';
import { useProfile } from '../../hooks/useProfile';
import { useRouterConnect } from '../../hooks/useRouterConnect';
import useTranslation from '../../hooks/useTranslation';
import { useUserWallet } from '../../hooks/useUserWallet/useUserWallet';
import { formatAmount } from '../../utils/formatAmount';
import { getExtractLinkByChainId } from '../../utils/getCryptoChainId';
import { chainIdToCode, useGetRightWallet } from '../../utils/getRightWallet';
import {
  getSubtransactions,
  StatementScreenTransaction,
  StatementScreenTransactionType,
} from '../../utils/getSubtransactions';
import { BaseButton } from '../Buttons';
import Skeleton from '../Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { KpiCard, KpiRow } from '../ui/KpiCard';
import { PageHeader } from '../ui/PageHeader';
import { SectionCard } from '../ui/SectionCard';
import { SegmentedControl } from '../ui/SegmentedControl';
import { StatusPill } from '../ui/StatusPill';
import { UI } from '../ui/tokens';

type OverviewWallet = {
  type: 'loyalty' | 'vault' | 'metamask' | string;
  balance?: string;
  currency?: string;
  chainId?: number;
  loyaltyId?: string;
  image?: string;
  pointsPrecision?: 'decimal' | 'integer' | string;
  address?: string;
};

const shortAddress = (address?: string) =>
  address
    ? `${address.substring(0, 6)}…${address.substring(address.length - 4)}`
    : '';

const ArrowIcon = ({ direction }: { direction: 'in' | 'out' | 'wait' }) =>
  direction === 'wait' ? (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M7 4v3l2 1.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d={direction === 'in' ? 'M7 2v10M3 8l4 4 4-4' : 'M7 12V2M3 6l4-4 4 4'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

/**
 * Top of the Carteira page: header with the wallet actions, wallet selector
 * (when the tenant exposes more than one), KPIs of the selected wallet and
 * the five latest statement entries. Everything the old `WalletHeaderSDK`
 * offered is still here: address + copy, Pontuar, Transferir, Adicionar
 * fundos and the Extrato link (chain explorer for crypto wallets).
 */
export const WalletOverview = ({ title }: { title?: string }) => {
  const [translate] = useTranslation();
  const locale = useLocale();
  const router = useRouterConnect();
  const { name: companyName } = useCompanyConfig();
  const { data: profile } = useProfile();
  const {
    loyaltyWallet,
    mainWallet,
    setAuthenticatePaymentModal,
    setTransferModal,
  } = useUserWallet();
  const { defaultTheme } = useThemeConfig();
  const organizedWallets = useGetRightWallet() as OverviewWallet[];
  const [copied, setCopied] = useState(false);
  const [, copyToClipboard] = useCopyToClipboard();

  const roles = (profile?.data?.roles || []) as Array<UserRoleEnum>;
  const isHidden = useIsHiddenMenuItem(roles);
  const contentData = defaultTheme?.configurations?.contentData;
  const hideWallet = contentData?.hideWalletAddress;
  const hideLoyaltyAuthentication = contentData?.hideLoyaltyAuthentication;
  const showTransferButton = contentData?.walletTransfer?.enabled;

  // Same rule the previous header used to decide which wallets to show.
  const wallets = useMemo(
    () =>
      organizedWallets.filter(
        (wallet) =>
          (wallet.balance && parseFloat(wallet.balance ?? '0') > 0) ||
          (wallet.type !== 'vault' && wallet.type !== 'metamask')
      ),
    [organizedWallets]
  );
  const [selectedKey, setSelectedKey] = useState<string>('');
  const walletKey = (wallet: OverviewWallet, index: number) =>
    wallet.loyaltyId ?? `${wallet.type}-${wallet.chainId ?? index}`;
  const selectedIndex = Math.max(
    0,
    wallets.findIndex(
      (wallet, index) => walletKey(wallet, index) === selectedKey
    )
  );
  const selected: OverviewWallet | undefined = wallets[selectedIndex];
  const isLoyalty = selected?.type === 'loyalty';
  const selectedLoyalty = isLoyalty
    ? loyaltyWallet?.find(
        (wallet) => wallet.loyaltyId === selected?.loyaltyId
      ) ?? loyaltyWallet?.[0]
    : undefined;
  const hasLoyalty = wallets.some((wallet) => wallet.type === 'loyalty');
  const hasVault = organizedWallets.some((wallet) => wallet.type === 'vault');
  const precision =
    (selected?.pointsPrecision as 'decimal' | 'integer') ?? 'decimal';
  const currency = isLoyalty
    ? selected?.currency ?? ''
    : chainIdToCode(selected?.chainId ?? 137, selected?.currency ?? '');
  const isLoadingWallets =
    !profile || (loyaltyWallet === undefined && !wallets.length);

  const walletLabel = (wallet: OverviewWallet) => {
    if (wallet.type === 'metamask') return translate('wallet>page>metamask');
    if (wallet.type === 'vault')
      return companyName || translate('wallet>page>balance');
    return wallet.currency || companyName || translate('wallet>page>balance');
  };

  // "A receber": first blocked deferred, ordered by release date.
  const userId = profile?.data?.id ?? '';
  const { data: deferred, isLoading: isLoadingDeferred } =
    useGetDeferredByUserId(
      userId,
      { page: 1, limit: 1, sortBy: 'withdrawableAt', orderBy: 'ASC' },
      Boolean(userId && isLoyalty),
      'scheduled'
    );
  const scheduledCount = deferred?.meta?.totalItems ?? 0;
  const nextRelease = (deferred?.items?.[0] as any)?.withdrawableAt as
    | string
    | undefined;

  // Latest statement entries of the selected loyalty wallet.
  const { data: history, isLoading: isLoadingHistory } = useGetErcTokensHistory(
    isLoyalty ? selectedLoyalty?.loyaltyId : undefined,
    { page: 1, limit: 5 }
  );
  const latest = useMemo<StatementScreenTransaction[]>(() => {
    const items = history?.items ?? [];
    return items
      .flatMap((item: any) =>
        getSubtransactions(item, defaultTheme).map((statement) => ({
          ...statement,
          createdAt: statement.createdAt ?? item?.createdAt,
        }))
      )
      .slice(0, 5);
  }, [history, defaultTheme]);

  const copyAddress = () => {
    copyToClipboard(mainWallet?.address ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const describe = (statement: StatementScreenTransaction) => {
    switch (statement.description) {
      case 'cashback':
        return translate('dashboard>statementComponent>cashbackInPayment');
      case 'final_recipient':
        return translate('dashboard>statementComponent>creditReferPayment');
      case 'comission':
      case 'split_payees':
        return translate('dashboard>statementComponent>commission');
      case 'credit_purchase':
        return translate('dashboard>statementComponent>loadZucaPayment');
      case 'payment':
      case 'paymentDefault':
        return translate('checkout>components>checkoutInfo>payment');
      default:
        return statement.description || statement.recipient || '';
    }
  };
  const who = (statement: StatementScreenTransaction) =>
    statement.operatorName ||
    (typeof statement.recipient === 'string' ? statement.recipient : '');

  const extractHref = isLoyalty
    ? router.routerToHref(PixwayAppRoutes.WALLET_RECEIPT)
    : getExtractLinkByChainId(
        selected?.chainId ?? 137,
        selected?.address ?? mainWallet?.address ?? '0x0'
      );

  const actions = (
    <>
      {hasVault ? (
        <a
          href={router.routerToHref(PixwayAppRoutes.ADD_FUNDS_TYPE)}
          className={UI.buttonSecondary}
        >
          {translate('wallet>page>addFunds')}
        </a>
      ) : null}
      {hasLoyalty && showTransferButton ? (
        <button
          type="button"
          onClick={() => setTransferModal?.(true)}
          className={UI.buttonSecondary}
        >
          {translate('shared>navigationLoginLoggedButton>toTransfer')}
        </button>
      ) : null}
      {hasLoyalty && !isHidden('withdraws') ? (
        <a
          href={router.routerToHref(PixwayAppRoutes.WITHDRAWS)}
          className={UI.buttonSecondary}
        >
          {translate('wallet>overview>withdraw')}
        </a>
      ) : null}
      {hasLoyalty && !hideLoyaltyAuthentication ? (
        <BaseButton onClick={() => setAuthenticatePaymentModal?.(true)}>
          {translate('shared>navigationLoginLoggedButton>toScore')}
        </BaseButton>
      ) : null}
    </>
  );

  return (
    <div className="pw-flex pw-flex-col pw-gap-4">
      <PageHeader
        title={title ?? translate('components>menu>wallet')}
        subtitle={
          !hideWallet && mainWallet?.address ? (
            <span className="pw-inline-flex pw-items-center pw-gap-1.5 pw-relative">
              <span className="pw-tabular-nums" title={mainWallet.address}>
                {shortAddress(mainWallet.address)}
              </span>
              <button
                type="button"
                onClick={copyAddress}
                className="pw-p-0.5 pw-rounded hover:pw-bg-[#F1F3F6]"
                aria-label={translate('components>menu>copyAddress')}
              >
                <CopyIcon
                  width={13}
                  height={13}
                  className="pw-stroke-[#777E8F]"
                />
              </button>
              {copied ? (
                <span className="pw-absolute pw-left-0 pw-top-5 pw-bg-[#0F1729] pw-text-white pw-text-[11px] pw-py-0.5 pw-px-2 pw-rounded-md pw-z-10">
                  {translate('components>menu>copied')}
                </span>
              ) : null}
            </span>
          ) : undefined
        }
        actions={actions}
        className="pw-mb-1"
      />

      {wallets.length > 1 ? (
        <SegmentedControl
          ariaLabel={translate('wallet>overview>wallets')}
          options={wallets.map((wallet, index) => ({
            value: walletKey(wallet, index),
            label: walletLabel(wallet),
          }))}
          value={walletKey(selected, selectedIndex)}
          onChange={setSelectedKey}
        />
      ) : null}

      {isLoadingWallets && !selected ? (
        <KpiRow>
          <KpiCard label={translate('wallet>page>balance')} value="" loading />
          <KpiCard
            label={translate('wallet>overview>toReceive')}
            value=""
            loading
          />
          <KpiCard
            label={translate('wallet>overview>withdrawable')}
            value=""
            loading
          />
        </KpiRow>
      ) : selected ? (
        <KpiRow>
          <KpiCard
            variant="accent"
            label={translate('wallet>page>balance')}
            value={formatAmount(selected.balance, locale, precision)}
            unit={currency}
            hint={
              <a href={extractHref} className={UI.link}>
                {isLoyalty
                  ? translate('wallet>overview>viewStatement')
                  : translate('wallet>overview>viewOnExplorer')}
              </a>
            }
            className="pw-col-span-2 sm:pw-col-span-1"
          />
          {isLoyalty ? (
            <>
              <KpiCard
                label={translate('wallet>overview>toReceive')}
                value={formatAmount(
                  deferred?.summary?.balance ?? 0,
                  locale,
                  precision
                )}
                unit={currency}
                loading={isLoadingDeferred}
                hint={
                  scheduledCount > 0
                    ? nextRelease
                      ? translate('wallet>overview>nextRelease', {
                          date: format(new Date(nextRelease), 'dd/MM'),
                        })
                      : translate('wallet>overview>scheduledCount', {
                          count: scheduledCount,
                        })
                    : translate('wallet>overview>noPending')
                }
              />
              <KpiCard
                label={translate('wallet>overview>withdrawable')}
                tone="ok"
                value={formatAmount(
                  selectedLoyalty?.withdrawableBalance ?? 0,
                  locale,
                  precision
                )}
                unit={currency}
                hint={
                  !isHidden('withdraws') ? (
                    <a
                      href={router.routerToHref(PixwayAppRoutes.WITHDRAWS)}
                      className={UI.link}
                    >
                      {translate('wallet>overview>withdraw')}
                    </a>
                  ) : undefined
                }
              />
            </>
          ) : null}
        </KpiRow>
      ) : null}

      {isLoyalty ? (
        <SectionCard
          title={translate('wallet>overview>latestTransactions')}
          actions={
            <a href={extractHref} className={UI.link}>
              {translate('wallet>overview>viewStatement')}
            </a>
          }
        >
          {isLoadingHistory ? (
            <div className="pw-grid pw-gap-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="pw-h-4 pw-w-full pw-rounded" />
              ))}
            </div>
          ) : latest.length === 0 ? (
            <EmptyState
              bare
              title={translate('wallet>overview>noTransactions')}
              className="pw-py-6"
            />
          ) : (
            <ul className="pw-m-0 pw-p-0 pw-list-none pw-divide-y pw-divide-[#E6E8EC]">
              {latest.map((statement, index) => {
                const isOut =
                  statement.type === StatementScreenTransactionType.SENDING;
                const isPending =
                  statement.pending ||
                  statement.type === StatementScreenTransactionType.PENDING;
                const date = statement.createdAt
                  ? format(new Date(statement.createdAt), 'dd/MM/yyyy HH:mm')
                  : '';
                const subtitle = [date, who(statement)]
                  .filter(Boolean)
                  .join(' · ');
                return (
                  <li
                    key={`${statement.parentItemId}-${index}`}
                    className="pw-flex pw-items-center pw-gap-3 pw-py-2.5 pw-min-w-0"
                  >
                    <span
                      className={classNames(
                        'pw-grid pw-place-items-center pw-w-8 pw-h-8 pw-rounded-lg pw-shrink-0',
                        isPending
                          ? 'pw-bg-[#FDF5E6] pw-text-[#9A6508]'
                          : isOut
                          ? 'pw-bg-[#F1F3F6] pw-text-[#4A5567]'
                          : 'pw-bg-[#E6F6EF] pw-text-[#0B7A55]'
                      )}
                      aria-hidden
                    >
                      <ArrowIcon
                        direction={isPending ? 'wait' : isOut ? 'out' : 'in'}
                      />
                    </span>
                    <span className="pw-flex-1 pw-min-w-0">
                      <span
                        className={classNames(
                          'pw-block pw-text-[13px] pw-font-semibold pw-truncate',
                          UI.text
                        )}
                      >
                        {describe(statement)}
                      </span>
                      {subtitle ? (
                        <span
                          className={classNames(
                            'pw-block pw-text-[11.5px] pw-truncate',
                            UI.textMuted
                          )}
                        >
                          {subtitle}
                        </span>
                      ) : null}
                    </span>
                    <span className="pw-text-right pw-shrink-0 pw-grid pw-justify-items-end pw-gap-0.5">
                      <span
                        className={classNames(
                          'pw-text-[13px] pw-font-semibold pw-tabular-nums',
                          isOut ? UI.text : 'pw-text-[#0B7A55]'
                        )}
                      >
                        {isOut ? '− ' : '+ '}
                        {formatAmount(statement.value, locale, precision)}
                      </span>
                      {isPending ? (
                        <StatusPill tone="warn" size="sm">
                          {translate('shared>processing')}
                        </StatusPill>
                      ) : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>
      ) : null}
    </div>
  );
};
