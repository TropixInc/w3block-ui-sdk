import classNames from 'classnames';

import { useLocale } from '../../shared/hooks/useLocale';
import useTranslation from '../../shared/hooks/useTranslation';
import { Withdraw, WithdrawProviderTransferStatus } from '../interfaces';
import { formatWithdrawAmount, formatWithdrawDateTime } from '../utils/format';
import {
  getLastProviderTransfer,
  WITHDRAW_TRANSFER_STATUS_KEYS,
} from '../utils/presentation';
import { WithdrawField } from './WithdrawSummary';

interface Props {
  withdraw: Withdraw;
  className?: string;
  /** Texto de ajuda quando ainda não há comprovante (admin e usuário diferem). */
  emptyHint?: string;
}

const isImage = (link?: string, type?: string) =>
  Boolean(link) &&
  !/\.pdf($|\?)/i.test(link ?? '') &&
  !/document|pdf/i.test(type ?? '');

/**
 * Comprovante do saque: o arquivo anexado (`receiptAsset`) e/ou o Pix do
 * provedor (`providerTransfers`: endToEndId, data, status, rejeição).
 */
export const WithdrawReceiptCard = ({
  withdraw,
  className,
  emptyHint,
}: Props) => {
  const [translate] = useTranslation();
  const locale = useLocale();
  const receipt = withdraw.receiptAsset;
  const transfer = getLastProviderTransfer(withdraw);
  const hasAnything = Boolean(receipt?.directLink) || Boolean(transfer);

  return (
    <div className={classNames('pw-flex pw-flex-col pw-gap-4', className)}>
      {!hasAnything ? (
        <p className="pw-m-0 pw-text-[13px] pw-text-[#4a5567] pw-leading-relaxed">
          {emptyHint ?? translate('withdraws>receipt>empty')}
        </p>
      ) : null}

      {transfer ? (
        <div className="pw-rounded-[12px] pw-border pw-border-[#e6e8ec] pw-bg-[#fafbfc] pw-p-4 pw-grid pw-gap-3 pw-grid-cols-1 sm:pw-grid-cols-2">
          <WithdrawField label={translate('withdraws>receipt>provider')}>
            {transfer.provider
              ? transfer.provider.charAt(0).toUpperCase() +
                transfer.provider.slice(1)
              : '—'}
          </WithdrawField>
          <WithdrawField label={translate('withdraws>receipt>transferStatus')}>
            {translate(
              WITHDRAW_TRANSFER_STATUS_KEYS[transfer.status] ??
                'withdraws>transferStatus>unknown'
            )}
            {transfer.duplicatePaymentSuspected
              ? ` · ${translate('withdraws>statusDetail>duplicateSuspected')}`
              : ''}
          </WithdrawField>
          <WithdrawField label={translate('withdraws>receipt>amount')}>
            {formatWithdrawAmount(transfer.amount, locale)}
          </WithdrawField>
          <WithdrawField label={translate('withdraws>receipt>transactionDate')}>
            {formatWithdrawDateTime(
              transfer.transactionDate ?? transfer.updatedAt,
              locale
            )}
          </WithdrawField>
          <WithdrawField
            label={translate('withdraws>receipt>endToEndId')}
            className="sm:pw-col-span-2"
          >
            <span className="pw-font-mono pw-text-[12px] pw-break-all">
              {transfer.endToEndId || '—'}
            </span>
          </WithdrawField>
          {transfer.transactionCode ? (
            <WithdrawField
              label={translate('withdraws>receipt>transactionCode')}
              className="sm:pw-col-span-2"
            >
              <span className="pw-font-mono pw-text-[12px] pw-break-all">
                {transfer.transactionCode}
              </span>
            </WithdrawField>
          ) : null}
          {transfer.status === WithdrawProviderTransferStatus.REJECTED &&
          transfer.rejectReason ? (
            <WithdrawField
              label={translate('withdraws>receipt>rejectReason')}
              className="sm:pw-col-span-2"
            >
              <span className="pw-text-[#e23b3e]">{transfer.rejectReason}</span>
            </WithdrawField>
          ) : null}
        </div>
      ) : null}

      {receipt?.directLink ? (
        <div className="pw-flex pw-flex-col pw-gap-2">
          {isImage(receipt.directLink, receipt.type) ? (
            <img
              src={receipt.directLink}
              alt={translate('withdraws>receipt>file')}
              className="pw-max-h-[260px] pw-w-auto pw-max-w-full pw-rounded-[12px] pw-border pw-border-[#e6e8ec] pw-object-contain pw-bg-white"
            />
          ) : null}
          <a
            href={receipt.directLink}
            target="_blank"
            rel="noopener noreferrer"
            className="pw-inline-flex pw-w-fit pw-items-center pw-gap-2 pw-rounded-lg pw-border pw-border-[#e6e8ec] pw-bg-white pw-px-3 pw-py-2 pw-text-[13px] pw-font-semibold pw-text-[#0050FF] hover:pw-bg-[#f5f9ff]"
          >
            {translate('withdraws>receipt>open')}
          </a>
        </div>
      ) : null}
    </div>
  );
};
