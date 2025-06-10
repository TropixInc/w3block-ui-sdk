/* eslint-disable i18next/no-literal-string */

import { useTranslation } from 'react-i18next';
import { Shimmer } from '../../../shared/components/Shimmer';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';

import { Currency } from '../../interfaces/Currency';
import { CriptoValueComponent } from '../CriptoValueComponent';


interface MySalesPriceComponent {
  className?: string;
  loading?: boolean;
  name?: string;
  loadingPreview?: boolean;
  receipts?: {
    currency: Currency;
    currencyId: string;
    fees: string;
    netValue: string;
    receiveDate: string;
    status: string;
    withdrawDate: string;
  };
}

const _MySalesPriceComponent = ({
  className,
  loading,
  loadingPreview = false,
  receipts,
}: MySalesPriceComponent) => {
  const [translate] = useTranslation();

  return (
    <div className={`pw-w-full ${className}`}>
      <div className="pw-flex pw-justify-between">
        <p className="pw-text-sm pw-text-[#35394C] pw-font-[400]">
          {translate('pages>mysales>resale>subtotal')}
        </p>
        {loading || loadingPreview ? (
          <Shimmer />
        ) : (
          <div className="pw-flex pw-gap-2">
            <CriptoValueComponent
              pointsPrecision="decimal"
              code={receipts?.currency?.code}
              symbol={receipts?.currency?.symbol}
              value={(
                parseFloat(receipts?.netValue ?? '0') +
                parseFloat(receipts?.fees ?? '0')
              ).toFixed(2)}
              crypto={false}
              fontClass="pw-text-sm pw-font-[600] pw-text-[#35394C]"
            />
          </div>
        )}
      </div>
      {receipts?.fees ? (
        <div className="pw-flex pw-justify-between">
          <p className="pw-text-sm pw-text-[#35394C] pw-font-[400]">
            {translate('pages>mysales>resale>fees')}
          </p>
          {loading || loadingPreview ? (
            <Shimmer />
          ) : (
            <div className="pw-flex pw-gap-2">
              -
              <CriptoValueComponent
                pointsPrecision="decimal"
                code={receipts?.currency?.code}
                symbol={receipts?.currency?.symbol}
                value={receipts?.fees}
                crypto={false}
                fontClass="pw-text-sm pw-font-[600] pw-text-[#35394C]"
              />
            </div>
          )}
        </div>
      ) : null}
      <div className="pw-w-full pw-h-[1px] pw-bg-[#777E8F] pw-my-2"></div>
      <div className="pw-flex pw-justify-between">
        <p className="pw-font-[600] pw-text-sm pw-text-[#35394C]">
          {translate('pages>mysales>resale>total')}
        </p>
        {loading || loadingPreview ? (
          <Shimmer className="pw-h-6 pw-w-17" />
        ) : (
          <div className="pw-flex pw-gap-2">
            <CriptoValueComponent
              pointsPrecision="decimal"
              code={receipts?.currency?.code}
              symbol={receipts?.currency?.symbol}
              value={receipts?.netValue ?? ''}
              crypto={false}
              fontClass="pw-text-xl pw-font-[700] !pw-text-[#35394C]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const MySalesPriceComponent = ({
  className,
  loading = false,
  name = 'BRL',
  receipts,
}: MySalesPriceComponent) => {
  return (
    <TranslatableComponent>
      <_MySalesPriceComponent
        loading={loading}
        className={className}
        name={name}
        receipts={receipts}
      />
    </TranslatableComponent>
  );
};
