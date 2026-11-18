/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames';
import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';

import { BaseButton } from '../../shared/components/Buttons';
import Skeleton from '../../shared/components/Skeleton';
import { DefinitionList } from '../../shared/components/ui/DefinitionList';
import { StatusPill } from '../../shared/components/ui/StatusPill';
import { UI } from '../../shared/components/ui/tokens';
import { useLocale } from '../../shared/hooks/useLocale';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import useTranslation from '../../shared/hooks/useTranslation';
import { formatAmount } from '../../shared/utils/formatAmount';
import {
  withdrawStatusLabelKey,
  withdrawStatusTone,
  WithdrawStatus,
} from '../../shared/utils/withdrawStatus';
import { useGetSpecificWithdraw } from '../hooks/useRequestWithdraw';

interface Props {
  id: string;
  currency: string;
  pointsPrecision?: 'decimal' | 'integer';
  /** Opens the withdraw modal again (failed / refused withdraws). */
  onRequestAgain?: () => void;
}

const WithdrawInternal = ({
  id,
  currency,
  pointsPrecision,
  onRequestAgain,
}: Props) => {
  const router = useRouterConnect();
  const locale = useLocale();
  const { data, isFetching } = useGetSpecificWithdraw(id);
  const [translate] = useTranslation();

  const withdraw = data?.data ?? {};
  const status = withdraw.status as WithdrawStatus | undefined;
  const dateLocale = locale === 'pt-BR' ? ptBR : enUS;
  const amount = `${formatAmount(
    withdraw.amount,
    locale,
    pointsPrecision
  )} ${currency}`.trim();
  const canRequestAgain =
    (status === 'failed' || status === 'refused') && onRequestAgain;

  const items = [
    {
      term: translate('auth>withdrawAdminActions>requestMade'),
      value: withdraw.createdAt
        ? format(new Date(withdraw.createdAt), 'PPpp', { locale: dateLocale })
        : '—',
    },
    { term: translate('pass>sharedOrder>value'), value: amount },
    {
      term: translate('token>pass>status'),
      value: (
        <StatusPill tone={withdrawStatusTone(status)}>
          {translate(withdrawStatusLabelKey(status))}
        </StatusPill>
      ),
    },
    ...(status === 'refused' && withdraw.reason
      ? [
          {
            term: translate('key>kycActionsModal>resons'),
            value: <span className="pw-text-[#C92A2D]">{withdraw.reason}</span>,
            wide: true,
          },
        ]
      : []),
    {
      term: translate('auth>withdrawAdminActions>proof'),
      value: withdraw.receiptAsset?.directLink ? (
        <a
          href={withdraw.receiptAsset.directLink}
          target="_blank"
          rel="noreferrer"
          className={UI.link}
        >
          {translate('auth>withdrawAdminActions>viewReceipt')}
        </a>
      ) : (
        translate('auth>withdraws>receiptWhenConcluded')
      ),
      muted: !withdraw.receiptAsset?.directLink,
    },
  ];

  return (
    <div className="pw-flex pw-flex-col pw-gap-4">
      <div className="pw-flex pw-flex-wrap pw-items-center pw-justify-between pw-gap-2">
        <button
          type="button"
          className="pw-inline-flex pw-items-center pw-gap-1 pw-text-[12.5px] pw-font-medium pw-text-[#4A5567] hover:pw-text-[#0F1729]"
          onClick={() => router.push('/withdraws')}
        >
          <span aria-hidden>‹</span> {translate('shared>back')}
        </button>
        {canRequestAgain ? (
          <BaseButton onClick={onRequestAgain}>
            {translate('auth>withdraws>requestAgain')}
          </BaseButton>
        ) : null}
      </div>

      {isFetching && !data ? (
        <div className="pw-grid pw-gap-3">
          <Skeleton className="pw-h-4 pw-w-1/3 pw-rounded" />
          <Skeleton className="pw-h-4 pw-w-1/2 pw-rounded" />
          <Skeleton className="pw-h-4 pw-w-1/4 pw-rounded" />
        </div>
      ) : (
        <>
          <h2
            className={classNames(
              'pw-text-[18px] pw-font-semibold pw-m-0',
              UI.text
            )}
          >
            {translate('auth>withdraws>detailTitle', { amount })}
          </h2>
          <DefinitionList items={items} />
          {status === 'escrowing_resources' ||
          status === 'ready_to_transfer_funds' ? (
            <div className="pw-flex pw-gap-2 pw-items-start pw-rounded-lg pw-px-3 pw-py-2.5 pw-text-[12.5px] pw-bg-[#FDF5E6] pw-text-[#9A6508]">
              {translate('auth>withdrawAdminActions>pleaseWaitHoldFunds')}
            </div>
          ) : null}
          {status === 'failed' ? (
            <div className="pw-flex pw-gap-2 pw-items-start pw-rounded-lg pw-px-3 pw-py-2.5 pw-text-[12.5px] pw-bg-[#FDECEC] pw-text-[#C92A2D]">
              {translate('auth>withdraws>failedHint')}
            </div>
          ) : null}
          {status === 'refused' ? (
            <div className="pw-flex pw-gap-2 pw-items-start pw-rounded-lg pw-px-3 pw-py-2.5 pw-text-[12.5px] pw-bg-[#FDECEC] pw-text-[#C92A2D]">
              {translate('auth>withdraws>refusedHint')}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default WithdrawInternal;
