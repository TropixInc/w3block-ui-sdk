/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import { Disclosure } from '@headlessui/react';
import classNames from 'classnames';
import { format, getTime, isToday, isYesterday } from 'date-fns';

import ChevronDown from '../../../shared/assets/icons/arrowDown.svg';
import CopyIcon from '../../../shared/assets/icons/copyIconOutlined.svg';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import useDateFnsLocale from '../../../shared/hooks/useDateFnsLocale';
import { useLocale } from '../../../shared/hooks/useLocale';
import useTranslation from '../../../shared/hooks/useTranslation';
import { Erc20ActionStatus } from '../../../shared/interfaces/Statement';
import {
  StatementScreenTransaction,
  StatementScreenTransactionType,
} from '../../../shared/utils/getSubtransactions';
import { gradeMap, Grade } from '../../../storefront/components/WjjcStart';
import { formatPoints, isReleased, resolveSettlement } from './settlement';
import { SettlementPill, StatementPill } from './SettlementPill';

export type StatementTypeFilter = 'all' | 'in' | 'out';

interface Props {
  items: StatementScreenTransaction[];
  currency: string;
  pointsPrecision?: 'integer' | 'decimal';
  typeFilter?: StatementTypeFilter;
  onOpenReceipt: (deliverId: string) => void;
  withdrawHref?: (withdrawId: string) => string;
  emptyText: string;
}

const shareText = (metadata: any) => {
  if (metadata?.action === 'split_payees') {
    if (metadata.commerce?.type === 'master')
      return 'Responsible Instructor’s Share';
    if (metadata.commerce?.type === 'academy') return 'Academy’s Share';
    if (metadata.commerce?.type === 'ambassador')
      return 'Responsible Instructor Ambassador’s Share';
    if (metadata.commerce?.type === 'ambassadorPool')
      return 'Ambassador’s Share';
    if (metadata.commerce?.type === 'grandMasterCouncil')
      return 'Council of Grand Masters Member’s Share';
  }
  return '';
};

/** Texto das cotas WJJC (split_payees), igual ao StatementComponent atual. */
const WjjcText = ({ metadata, value }: { metadata: any; value: string }) => {
  if (metadata?.action !== 'split_payees') return null;
  const head = metadata?.commerce?.isAffiliation
    ? `Affiliation - ${metadata?.commerce?.athleteName}`
    : `${gradeMap[metadata.commerce?.degree as Grade]} ${
        metadata.commerce?.beltColor
      } Belt Certification - ${metadata.commerce?.athleteName}`;
  return (
    <div className="pw-text-[13px] pw-font-medium pw-text-[#0f1729]">
      <p>{head}</p>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="pw-flex pw-items-center pw-gap-2 pw-text-[12px] pw-text-[#4a5567]">
              {shareText(metadata)} - {metadata?.commerce?.share}% * R$
              {metadata?.commerce?.netValue} = R${parseFloat(value).toFixed(2)}
              <ChevronDown
                className={classNames(
                  'pw-stroke-[#000000]',
                  open ? 'pw-rotate-180' : ''
                )}
              />
            </Disclosure.Button>
            <Disclosure.Panel>
              <div className="pw-my-3 pw-text-[12px] pw-text-[#4a5567]">
                <p>
                  <b>(a) Amount:</b> R$
                  {parseFloat(metadata?.commerce?.price).toFixed(2)}
                </p>
                <p>
                  <b>
                    (b) Tax Provisioning (-{' '}
                    {metadata?.commerce?.taxProvisioningFee || '14.25'}%):
                  </b>{' '}
                  -R${metadata?.commerce?.taxProvisioningFeeAmount}
                </p>
                <p>
                  <b>
                    (c) Payment Method Fee (-{' '}
                    {metadata?.commerce?.paymentMethodFee || '2.49'}%):
                  </b>{' '}
                  -R${metadata?.commerce?.paymentMethodFeeAmount}
                </p>
                <p className="pw-my-3">
                  <b>Net amount:</b> a + b + c = R$
                  {metadata?.commerce?.netValue}
                </p>
                <p>
                  {shareText(metadata)} - {metadata?.commerce?.share}% * Net
                  amount
                </p>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

const ReceiptLink = ({
  deliverId,
  onOpen,
}: {
  deliverId?: string;
  onOpen: (id: string) => void;
}) =>
  deliverId ? (
    <button
      type="button"
      className="pw-font-semibold pw-text-[#0050FF] hover:pw-underline"
      onClick={() => onOpen(deliverId)}
    >
      #{deliverId}
    </button>
  ) : null;

/** Mesmos textos por tipo do StatementComponent atual, só reorganizados. */
const StatementTitle = ({
  item,
  onOpenReceipt,
}: {
  item: StatementScreenTransaction;
  onOpenReceipt: (deliverId: string) => void;
}) => {
  const [translate] = useTranslation();
  switch (item.description) {
    case 'split_payees':
      return <WjjcText metadata={item.metadata} value={item.value} />;
    case 'comission':
      return <>{translate('statement>extract>comission')}</>;
    case 'final_recipient':
      return (
        <>
          {translate('dashboard>statementComponent>creditReferPayment')}{' '}
          <ReceiptLink deliverId={item.deliveryId} onOpen={onOpenReceipt} />{' '}
          {translate('dashboard>statementComponent>for')} {item.operatorName}
        </>
      );
    case 'cashback':
      return (
        <>
          {translate('dashboard>statementComponent>cashbackInPayment')}{' '}
          <ReceiptLink deliverId={item.deliveryId} onOpen={onOpenReceipt} />{' '}
          {translate('dashboard>statementComponent>for')} {item.operatorName}
        </>
      );
    case 'credit_purchase':
      return (
        <>
          {translate('dashboard>statementComponent>loadZucaPayment')}{' '}
          <ReceiptLink
            deliverId={item.metadata?.commerce?.deliverId}
            onOpen={onOpenReceipt}
          />{' '}
          {translate('dashboard>statementComponent>for')}{' '}
          {item.metadata?.commerce?.destinationUserName}
        </>
      );
    case 'payment':
      return (
        <>
          {translate('checkout>components>checkoutInfo>payment')}{' '}
          <ReceiptLink
            deliverId={item.metadata?.commerce?.deliverId}
            onOpen={onOpenReceipt}
          />{' '}
          {translate('dashboard>statementComponent>inTotalValue')}{' '}
          {item.metadata?.commerce?.erc20PurchaseAmount} ZUCA{' '}
          {translate('dashboard>statementComponent>for')}{' '}
          {item.metadata?.commerce?.destinationUserName}
        </>
      );
    case 'paymentDefault':
      return (
        <a
          href={PixwayAppRoutes.MY_ORDERS + `?orderId=${item.orderId}`}
          className="pw-underline"
        >
          {translate('statement>extract>paymentDefault')}
        </a>
      );
    default:
      return (
        <>
          {item.description ||
            (typeof item.recipient === 'string' ? item.recipient : '')}
        </>
      );
  }
};

const CopyHash = ({ hash }: { hash: string }) => {
  const [translate] = useTranslation();
  const [state, copyToClipboard] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    copyToClipboard(hash);
    if (!state.error) setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
  const short =
    hash && hash.length > 12 ? `${hash.slice(0, 6)}…${hash.slice(-4)}` : hash;
  return (
    <span className="pw-inline-flex pw-items-center pw-gap-1">
      <span className="pw-font-mono pw-text-[12px] pw-text-[#6b7280]">
        tx {short}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={translate('statement>extract>copyHash')}
        className="pw-inline-flex pw-h-6 pw-w-6 pw-items-center pw-justify-center pw-text-[#6b7280] hover:pw-text-[#0f1729]"
      >
        <CopyIcon className="pw-h-[13px] pw-w-[13px] pw-stroke-current" />
      </button>
      {copied ? (
        <span className="pw-rounded-md pw-bg-[#E6E8EC] pw-px-2 pw-py-0.5 pw-text-[11px]">
          {translate('components>menu>copied')}
        </span>
      ) : null}
    </span>
  );
};

/** Linhas do Extrato agrupadas por dia. */
export const StatementDayList = ({
  items,
  currency,
  pointsPrecision = 'decimal',
  typeFilter = 'all',
  onOpenReceipt,
  withdrawHref,
  emptyText,
}: Props) => {
  const [translate] = useTranslation();
  const locale = useLocale();
  const dateFnsLocale = useDateFnsLocale();

  const groups = useMemo(() => {
    const filtered = items.filter((item) => {
      if (typeFilter === 'in')
        return item.type === StatementScreenTransactionType.RECEIVING;
      if (typeFilter === 'out')
        return item.type === StatementScreenTransactionType.SENDING;
      return true;
    });
    const map = new Map<string, StatementScreenTransaction[]>();
    filtered.forEach((item) => {
      const date = item.createdAt ? new Date(item.createdAt) : null;
      const key =
        date && !Number.isNaN(date.getTime())
          ? format(date, 'yyyy-MM-dd')
          : 'unknown';
      map.set(key, [...(map.get(key) ?? []), item]);
    });
    return Array.from(map.entries());
  }, [items, typeFilter]);

  const dayLabel = (key: string) => {
    if (key === 'unknown') return '—';
    const date = new Date(`${key}T12:00:00`);
    const short = format(date, 'dd/MM/yyyy', { locale: dateFnsLocale });
    if (isToday(date))
      return `${translate('statement>extract>today')} · ${short}`;
    if (isYesterday(date))
      return `${translate('statement>extract>yesterday')} · ${short}`;
    return `${format(date, 'EEEE', { locale: dateFnsLocale })} · ${short}`;
  };

  const showScheduledAt = (item: StatementScreenTransaction) => {
    if (!item.scheduledAt || !item.createdAt) return false;
    const diff = Math.abs(
      getTime(Date.parse(item.scheduledAt)) - Date.parse(item.createdAt)
    );
    return diff / (1000 * 60 * 60) > 1;
  };

  if (!groups.length) {
    return (
      <p className="pw-py-8 pw-text-center pw-text-[13px] pw-text-[#6b7280]">
        {emptyText}
      </p>
    );
  }

  return (
    <div className="pw-flex pw-flex-col">
      {groups.map(([day, dayItems]) => (
        <div key={day} className="pw-flex pw-flex-col">
          <div className="pw-pb-1.5 pw-pt-3.5 pw-text-[12px] pw-font-semibold pw-uppercase pw-tracking-[.04em] pw-text-[#6b7280]">
            {dayLabel(day)}
          </div>
          {dayItems.map((item, index) => {
            const receiving =
              item.type === StatementScreenTransactionType.RECEIVING;
            const pending =
              item.pending ||
              (item.status !== Erc20ActionStatus.SUCCESS &&
                item.status !== Erc20ActionStatus.EXTERNAL);
            const released = isReleased(item.releasedAt);
            const settlement =
              receiving && item.releasedAt && !pending
                ? resolveSettlement({
                    id: item.actionId ?? `${item.parentItemId}-${index}`,
                    item: item.settlement,
                    released,
                    releasedAt: item.releasedAt,
                  })
                : null;
            const time = item.createdAt
              ? format(new Date(item.createdAt), 'HH:mm', {
                  locale: dateFnsLocale,
                })
              : '';
            return (
              <div
                key={`${item.actionId ?? item.parentItemId}-${index}`}
                className="pw-flex pw-items-start pw-gap-3 pw-border-t pw-border-[#e6e8ec] pw-py-3.5"
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    'pw-inline-flex pw-h-9 pw-w-9 pw-shrink-0 pw-items-center pw-justify-center pw-rounded-full',
                    pending
                      ? 'pw-bg-[#fdf5e6] pw-text-[#9a6508]'
                      : receiving
                      ? 'pw-bg-[#eaf1fc] pw-text-[#2f6fd0]'
                      : 'pw-bg-[#fdecec] pw-text-[#c92a2d]'
                  )}
                >
                  {pending ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                  ) : receiving ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 5v14m-7-7h14" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14" />
                    </svg>
                  )}
                </span>
                <div className="pw-flex pw-min-w-0 pw-flex-1 pw-flex-col pw-gap-1">
                  <span className="pw-text-[14px] pw-font-medium pw-text-[#0f1729]">
                    <StatementTitle item={item} onOpenReceipt={onOpenReceipt} />
                  </span>
                  <span className="pw-flex pw-flex-wrap pw-items-center pw-gap-x-2 pw-text-[12px] pw-text-[#6b7280]">
                    {pending ? (
                      <span>{translate('statement>extract>processing')}</span>
                    ) : null}
                    {item.hash && item.hash !== '-' ? (
                      <CopyHash hash={item.hash} />
                    ) : null}
                    {showScheduledAt(item) ? (
                      <span>
                        {translate('statement>extract>scheduledOn', {
                          date: format(
                            new Date(item.scheduledAt as string),
                            'dd/MM HH:mm',
                            {
                              locale: dateFnsLocale,
                            }
                          ),
                        })}
                      </span>
                    ) : null}
                  </span>
                  {settlement ? (
                    <span className="sm:pw-hidden">
                      <SettlementPill
                        presentation={settlement}
                        withdrawHref={withdrawHref}
                      />
                    </span>
                  ) : null}
                </div>
                <div className="pw-flex pw-flex-col pw-items-end pw-gap-1.5">
                  <span
                    className={classNames(
                      'pw-whitespace-nowrap pw-text-[15px] pw-font-bold pw-tabular-nums',
                      pending
                        ? 'pw-text-[#9a6508]'
                        : receiving
                        ? 'pw-text-[#2f6fd0]'
                        : 'pw-text-[#c92a2d]'
                    )}
                  >
                    {receiving ? '+ ' : '− '}
                    {formatPoints(item.value, pointsPrecision, locale)}
                    <span className="pw-ml-1 pw-text-[12px] pw-font-normal pw-text-[#6b7280]">
                      {currency}
                    </span>
                    {item.description === 'paymentDefault' && item.payments ? (
                      <span className="pw-ml-1 pw-text-[12px] pw-font-normal pw-text-[#6b7280]">
                        {item.payments}
                      </span>
                    ) : null}
                  </span>
                  {settlement ? (
                    <span className="pw-hidden sm:pw-inline-flex">
                      <SettlementPill
                        presentation={settlement}
                        withdrawHref={withdrawHref}
                      />
                    </span>
                  ) : pending ? (
                    <StatementPill color="amber">
                      {translate('statement>extract>processing')}
                    </StatementPill>
                  ) : (
                    <span className="pw-text-[12px] pw-text-[#6b7280]">
                      {time}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
