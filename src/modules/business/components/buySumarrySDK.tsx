import classNames from 'classnames';

import { formatterCurrency } from '../../shared/components/CriptoValueComponent';
import { UI } from '../../shared/components/ui/tokens';
import { CurrencyEnum } from '../../shared/enums/Currency';
import useTranslation from '../../shared/hooks/useTranslation';

interface BuySummarySDKProps {
  totalValue?: string;
  discountValue?: string;
  valueToPay?: string;
  valueToUse?: string;
  currencyToUse?: string;
  currencyToPay?: CurrencyEnum;
  className?: string;
}

export const BuySummarySDK = ({
  totalValue,
  discountValue,
  valueToPay,
  currencyToUse,
  currencyToPay,
  className = '',
}: BuySummarySDKProps) => {
  const [translate] = useTranslation();
  const hasDiscount = parseFloat(discountValue ?? '0') > 0;
  return (
    <div
      className={classNames(
        UI.card,
        'pw-p-4 pw-border pw-border-[#EEF0F3]',
        className
      )}
    >
      <p
        className={classNames(
          'pw-text-[14px] pw-font-semibold pw-m-0 pw-mb-3',
          UI.text
        )}
      >
        {translate('business>buySumarySDK>purchaseResume')}
      </p>
      <BuySumarryEntries
        text={translate('business>buySumarySDK>subtotal')}
        currency={currencyToPay ?? CurrencyEnum.BRL}
        val={totalValue ?? '0'}
      />
      {hasDiscount ? (
        <BuySumarryEntries
          text={translate('business>buySumarySDK>discountIn', {
            currency: currencyToUse,
          })}
          currency={currencyToPay ?? CurrencyEnum.BRL}
          val={discountValue ?? '0'}
          isNegative
        />
      ) : null}
      <div className="pw-w-full pw-h-px pw-bg-[#E6E8EC] pw-my-2" />
      <BuySumarryEntries
        text={translate('business>buySumarySDK>total')}
        currency={currencyToPay ?? CurrencyEnum.BRL}
        val={valueToPay ?? '0'}
        strong
      />
    </div>
  );
};

const BuySumarryEntries = ({
  text,
  val,
  currency,
  isNegative = false,
  strong = false,
}: {
  text: string;
  val: string;
  currency: CurrencyEnum;
  isNegative?: boolean;
  strong?: boolean;
}) => (
  <div className="pw-flex pw-items-center pw-justify-between pw-gap-3 pw-py-1 pw-text-[13px]">
    <span
      className={
        strong ? classNames('pw-font-semibold', UI.text) : UI.textSecondary
      }
    >
      {text}
    </span>
    <span
      className={classNames(
        'pw-inline-flex pw-items-center pw-gap-1 pw-tabular-nums',
        strong ? 'pw-font-semibold' : '',
        isNegative ? 'pw-text-[#0B7A55]' : UI.text
      )}
    >
      {isNegative ? '−' : ''}
      <span
        className={classNames(
          'pw-text-[13px]',
          strong ? 'pw-font-semibold' : 'pw-font-medium'
        )}
      >
        {formatterCurrency(currency, Number.isNaN(parseFloat(val)) ? '0' : val)}
      </span>
    </span>
  </div>
);
