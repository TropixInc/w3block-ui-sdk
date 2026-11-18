import { ReactNode } from 'react';

import classNames from 'classnames';

import { useLocale } from '../../shared/hooks/useLocale';
import useTranslation from '../../shared/hooks/useTranslation';
import { Withdraw, WithdrawOrigin } from '../interfaces';
import {
  formatWithdrawAmount,
  formatWithdrawDateTime,
  formatWithdrawPeriod,
  shortenWallet,
} from '../utils/format';
import {
  getWithdrawOriginLabel,
  getWithdrawPaymentPresentation,
} from '../utils/presentation';

interface FieldProps {
  label: string;
  children: ReactNode;
  mock?: boolean;
  className?: string;
}

export const WithdrawField = ({
  label,
  children,
  mock,
  className,
}: FieldProps) => {
  const [translate] = useTranslation();
  return (
    <div
      className={classNames(
        'pw-flex pw-flex-col pw-gap-1 pw-min-w-0',
        className
      )}
    >
      <span className="pw-text-[11px] pw-font-bold pw-uppercase pw-tracking-[0.03em] pw-text-[#8b93a3]">
        {label}
        {mock ? (
          <span
            className="pw-ml-1 pw-normal-case pw-tracking-normal pw-font-semibold pw-text-[#b2740a]"
            title={translate('withdraws>mock>tooltip')}
          >
            {translate('withdraws>mock>tag')}
          </span>
        ) : null}
      </span>
      <span className="pw-text-[14px] pw-font-medium pw-text-[#0f1729] pw-break-words">
        {children}
      </span>
    </div>
  );
};

interface Props {
  withdraw: Withdraw;
  /** Texto da conta de destino (ver `describeWithdrawAccount`). */
  accountDescription?: string;
  /** Sufixo do valor (ex.: "ZUCAS"). */
  currency?: string;
  /** Campos a esconder (ex.: no Connect não mostramos a carteira). */
  hide?: Array<
    'wallet' | 'memo' | 'origin' | 'payment' | 'account' | 'period' | 'orders'
  >;
  className?: string;
  columns?: 1 | 2 | 3;
}

/** Resumo do saque: valor, período, compras, origem, pagamento, conta, carteira, memo. */
export const WithdrawSummary = ({
  withdraw,
  accountDescription,
  currency,
  hide = [],
  className,
  columns = 2,
}: Props) => {
  const [translate] = useTranslation();
  const locale = useLocale();
  const payment = getWithdrawPaymentPresentation(withdraw, translate);
  const isHidden = (key: NonNullable<Props['hide']>[number]) =>
    hide.includes(key);
  const gridClass =
    columns === 1
      ? 'pw-grid-cols-1'
      : columns === 3
      ? 'pw-grid-cols-1 sm:pw-grid-cols-3'
      : 'pw-grid-cols-1 sm:pw-grid-cols-2';

  return (
    <div className={classNames('pw-grid pw-gap-4', gridClass, className)}>
      <WithdrawField label={translate('withdraws>detail>amount')}>
        {formatWithdrawAmount(withdraw.amount, locale)}
        {currency ? ` ${currency}` : ''}
      </WithdrawField>
      {!isHidden('period') ? (
        <WithdrawField
          label={translate('withdraws>detail>period')}
          mock={withdraw.extrasAreMock}
        >
          {formatWithdrawPeriod(withdraw.period, locale)}
        </WithdrawField>
      ) : null}
      {!isHidden('orders') ? (
        <WithdrawField
          label={translate('withdraws>detail>orders')}
          mock={withdraw.extrasAreMock}
        >
          {withdraw.ordersCount !== undefined
            ? translate('withdraws>detail>ordersCount', {
                count: withdraw.ordersCount,
              })
            : '—'}
        </WithdrawField>
      ) : null}
      {!isHidden('origin') ? (
        <WithdrawField label={translate('withdraws>list>origin')}>
          {getWithdrawOriginLabel(withdraw.origin, translate)}
          {withdraw.origin === WithdrawOrigin.AUTOMATIC && withdraw.createdAt
            ? ` · ${translate('withdraws>detail>roundAt', {
                date: formatWithdrawDateTime(withdraw.createdAt, locale),
              })}`
            : ''}
        </WithdrawField>
      ) : null}
      {!isHidden('payment') ? (
        <WithdrawField label={translate('withdraws>list>payment')}>
          {payment
            ? [payment.label, payment.detail].filter(Boolean).join(' · ')
            : '—'}
        </WithdrawField>
      ) : null}
      {!isHidden('account') ? (
        <WithdrawField label={translate('withdraws>detail>destinationAccount')}>
          {accountDescription ||
            (withdraw.withdrawAccountId
              ? shortenWallet(withdraw.withdrawAccountId)
              : '—')}
        </WithdrawField>
      ) : null}
      {!isHidden('wallet') ? (
        <WithdrawField label={translate('withdraws>detail>sourceWallet')}>
          <span
            title={withdraw.fromWalletAddress}
            className="pw-font-mono pw-text-[13px]"
          >
            {shortenWallet(withdraw.fromWalletAddress)}
          </span>
        </WithdrawField>
      ) : null}
      {!isHidden('memo') ? (
        <WithdrawField label={translate('withdraws>detail>memo')}>
          {withdraw.memo || '—'}
        </WithdrawField>
      ) : null}
    </div>
  );
};
