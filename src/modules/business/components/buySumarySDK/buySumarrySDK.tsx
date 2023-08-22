import { CriptoValueComponent } from '../../../shared/components/CriptoValueComponent/CriptoValueComponent';
import { CurrencyEnum } from '../../../shared/enums/Currency';

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
  return (
    <div
      className={`pw-p-5 pw-rounded-2xl pw-shadow pw-border pw-border-zinc-100 ${className}`}
    >
      <p className="pw-text-lg pw-text-zinc-700 pw-font-medium pw-leading-6">
        Resumo da compra
      </p>
      <BuySumarryEntries
        className="pw-mt-[24px]"
        text="Subtotal"
        currency={currencyToPay ?? CurrencyEnum.BRL}
        val={totalValue ?? '0'}
        fontClass={'pw-text-gray-700 pw-text-sm pw-font-semibold'}
      />
      {parseFloat(discountValue ?? '0') > 0 && (
        <BuySumarryEntries
          fontClass={'pw-text-gray-700 pw-text-sm pw-font-semibold'}
          className="pw-mt-[6px]"
          text={`Desconto em ${currencyToUse}`}
          currency={currencyToPay ?? CurrencyEnum.BRL}
          val={discountValue ?? '0'}
        />
      )}
      <div className="pw-w-full pw-h-px pw-bg-zinc-200 pw-my-2"></div>
      <BuySumarryEntries
        textClass="pw-font-semibold"
        className="pw-mt-3"
        text="Valor total a ser pago"
        currency={currencyToPay ?? CurrencyEnum.BRL}
        val={valueToPay ?? '0'}
      />
    </div>
  );
};

const BuySumarryEntries = ({
  text,
  val,
  currency,
  className = '',
  isNegative = false,
  fontClass = '',
  textClass = '',
}: {
  text: string;
  val: string;
  currency: CurrencyEnum;
  className?: string;
  isNegative?: boolean;
  fontClass?: string;
  textClass?: string;
}) => {
  return (
    <div className={`pw-flex pw-justify-between ${className}`}>
      <p className={`pw-text-gray-700 pw-text-sm ${textClass}`}>{text}</p>
      <div className="pw-flex pw-items-center pw-gap-2">
        {isNegative && <p className="">-</p>}
        <CriptoValueComponent
          fontClass={fontClass}
          value={val}
          code={currency}
          crypto={false}
        />
      </div>
    </div>
  );
};
