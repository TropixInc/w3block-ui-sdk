import { useState } from 'react';
import { CurrencyInput } from 'react-currency-mask';

import classNames from 'classnames';

import { Alert } from '../../shared/components/Alert';
import { ImageSDK } from '../../shared/components/ImageSDK';
import Skeleton from '../../shared/components/Skeleton';
import { UI } from '../../shared/components/ui/tokens';
import useTranslation from '../../shared/hooks/useTranslation';
import { formatAmount } from '../../shared/utils/formatAmount';

interface UserCardProps {
  onCancel?: () => void;
  avatarSrc?: string;
  name?: string;
  currency?: string;
  balance?: string;
  onChangeValue: (value: number) => void;
  valueToUse?: number;
  setMaxValue: () => void;
}

/**
 * Customer identified by the 4-digit code on the operator payment screen:
 * who they are, their balance and how much of it to use as discount.
 */
export const UserCard = ({
  onCancel,
  avatarSrc,
  name,
  currency,
  balance,
  onChangeValue,
  valueToUse = 0,
  setMaxValue,
}: UserCardProps) => {
  const [error, setError] = useState(false);
  const [translate] = useTranslation();
  const numericBalance = parseFloat(balance ?? '');
  const hasBalance = Number.isFinite(numericBalance) && numericBalance > 0;

  return (
    <div
      className={classNames(
        UI.card,
        'pw-p-4 pw-flex pw-flex-col pw-gap-3 pw-w-full pw-border pw-border-[#EEF0F3]'
      )}
    >
      <div className="pw-flex pw-items-center pw-gap-3">
        {avatarSrc ? (
          <ImageSDK
            src={avatarSrc}
            className="pw-w-11 pw-h-11 pw-rounded-full pw-object-cover pw-shrink-0"
          />
        ) : (
          <span className="pw-grid pw-place-items-center pw-w-11 pw-h-11 pw-rounded-full pw-bg-[#EAF1FC] pw-text-[#2F6FD0] pw-font-bold pw-shrink-0">
            {name ? name.trim().charAt(0).toUpperCase() : '?'}
          </span>
        )}
        <div className="pw-min-w-0 pw-flex-1">
          <p
            className={classNames(
              'pw-text-[11px] pw-font-semibold pw-uppercase pw-tracking-[0.04em] pw-m-0',
              UI.textMuted
            )}
          >
            {translate('business>paymentTemplateSDK>customer')}
          </p>
          {name ? (
            <p
              className={classNames(
                'pw-text-[14px] pw-font-semibold pw-truncate pw-m-0',
                UI.text
              )}
            >
              {name}
            </p>
          ) : (
            <p className={classNames('pw-text-[12.5px] pw-m-0', UI.textFaint)}>
              {translate('business>paymentTemplateSDK>customerPlaceholder')}
            </p>
          )}
        </div>
        {name && onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="pw-text-[12px] pw-font-semibold pw-text-[#C92A2D] hover:pw-underline pw-shrink-0"
          >
            {translate('components>cancelMessage>cancel')}
          </button>
        ) : null}
      </div>

      {name ? (
        balance === undefined || balance === '' ? (
          <Skeleton className="pw-h-4 pw-w-2/3 pw-rounded" />
        ) : !hasBalance ? (
          <p className="pw-text-[12.5px] pw-font-semibold pw-text-[#C92A2D] pw-m-0">
            {translate('business>userCard>userNotBalance')}
          </p>
        ) : (
          <div className="pw-flex pw-flex-col pw-gap-2 pw-pt-3 pw-border-t pw-border-[#E6E8EC]">
            <div className="pw-flex pw-items-center pw-justify-between pw-text-[12.5px]">
              <span className={UI.textMuted}>
                {translate('business>userCard>balance')}
              </span>
              <span
                className={classNames(
                  'pw-font-semibold pw-tabular-nums',
                  UI.text
                )}
              >
                {formatAmount(numericBalance)} {currency}
              </span>
            </div>
            <label
              className={classNames(
                'pw-text-[11px] pw-font-semibold pw-uppercase pw-tracking-[0.04em]',
                UI.textMuted
              )}
            >
              {translate('business>paymentTemplateSDK>usePoints')}
            </label>
            <div className="pw-flex pw-gap-2">
              <CurrencyInput
                onChangeValue={(_, value) => {
                  setError((value as number) > numericBalance);
                  onChangeValue(value as number);
                }}
                value={valueToUse}
                hideSymbol
                InputElement={
                  <input
                    placeholder="0,00"
                    className="pw-flex-1 pw-min-w-0 pw-h-9 pw-px-3 pw-rounded-lg pw-border pw-border-[#E6E8EC] pw-text-[13px] pw-text-[#0F1729] focus:pw-outline-none focus:pw-border-brand-primary"
                  />
                }
              />
              <button
                type="button"
                onClick={() => {
                  setMaxValue();
                  setError(false);
                }}
                className={UI.buttonSecondary}
              >
                {translate('business>userCard>max')}
              </button>
            </div>
            {error ? (
              <Alert variant="atention">
                {translate('business>userCard>insufficientFunds')}
              </Alert>
            ) : null}
          </div>
        )
      ) : null}
    </div>
  );
};
