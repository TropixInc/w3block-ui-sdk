/* eslint-disable i18next/no-literal-string */

import { PaymentsResponse } from '../../../checkout/interface/interface';
import { CriptoValueComponent } from '../../../shared/components/CriptoValueComponent/CriptoValueComponent';
import { Shimmer } from '../../../shared/components/Shimmer';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import useTranslation from '../../../shared/hooks/useTranslation';

interface PriceComponent {
  className?: string;
  loading?: boolean;
  name?: string;
  loadingPreview?: boolean;
  payments?: PaymentsResponse[];
}

const _PriceComponent = ({
  className,
  loading,
  loadingPreview = false,
  payments,
}: PriceComponent) => {
  const [translate] = useTranslation();

  const coinPayment = () => {
    if (payments?.length === 1) return payments[0];
    else return payments?.filter((e) => e?.currency?.crypto)[0];
  };

  const payment = () => {
    if (payments?.length === 1) return payments[0];
    else return payments?.filter((e) => !e?.currency?.crypto)[0];
  };

  return (
    <div className={`pw-w-full ${className}`}>
      <div className="pw-flex pw-justify-between">
        <p className="pw-text-sm pw-text-[#35394C] pw-font-[400]">Subtotal</p>
        {loading || loadingPreview ? (
          <Shimmer />
        ) : (
          <div className="pw-flex pw-gap-2">
            {payment()?.originalAmount &&
              parseFloat(payment()?.originalAmount ?? '') >
                parseFloat(payment()?.amount ?? '') && (
                <CriptoValueComponent
                  code={payment()?.currency?.code}
                  symbol={payment()?.currency?.symbol}
                  value={payment()?.originalAmount ?? ''}
                  crypto={
                    payment()?.currency?.symbol == 'MATIC' ||
                    payment()?.currency?.symbol == 'ETH'
                  }
                  fontClass="pw-text-sm pw-font-[600] !pw-text-[#35394C] !pw-text-opacity-50 pw-line-through"
                />
              )}
            <CriptoValueComponent
              pointsPrecision="decimal"
              code={payment()?.currency?.code}
              symbol={payment()?.currency?.symbol}
              value={
                coinPayment()?.currency?.crypto &&
                payments &&
                payments?.length > 1
                  ? ((parseFloat(payment()?.amount ?? '') +
                      parseFloat(
                        coinPayment()?.amount ?? ''
                      )) as unknown as string)
                  : payment()?.amount ?? ''
              }
              crypto={
                payment()?.currency?.symbol == 'MATIC' ||
                payment()?.currency?.symbol == 'ETH'
              }
              fontClass="pw-text-sm pw-font-[600] pw-text-[#35394C]"
            />
          </div>
        )}
      </div>
      {coinPayment()?.currency?.crypto &&
      parseFloat(coinPayment()?.amount ?? '') > 0 &&
      payments &&
      payments?.length > 1 ? (
        <div className="pw-flex pw-justify-between pw-mt-2">
          <p className="pw-text-sm pw-text-[#35394C] pw-font-[400]">
            {coinPayment()?.currency?.symbol}
          </p>
          {loading || loadingPreview ? (
            <Shimmer />
          ) : (
            <div className="pw-flex pw-gap-2 pw-text-[#35394C]">
              -{' '}
              <CriptoValueComponent
                pointsPrecision="decimal"
                code={coinPayment()?.currency?.code}
                symbol={coinPayment()?.currency?.symbol}
                value={coinPayment()?.amount ?? ''}
                crypto={
                  coinPayment()?.currency?.symbol == 'MATIC' ||
                  coinPayment()?.currency?.symbol == 'ETH'
                }
                fontClass="pw-text-sm pw-font-[600] pw-text-[#35394C]"
              />
            </div>
          )}
        </div>
      ) : null}
      {payment()?.clientServiceFee &&
        parseFloat(payment()?.clientServiceFee ?? '') > 0 && (
          <div className="pw-flex pw-justify-between pw-mt-2">
            <div className="pw-flex pw-gap-x-1">
              <p className="pw-text-sm pw-text-[#35394C] pw-font-[400]">
                {translate('shared>components>servicePriceinfo')}
              </p>
              {/* <InfoIcon className="pw-mt-[2px]" /> */}
            </div>
            {payment()?.clientServiceFee &&
            parseFloat(payment()?.clientServiceFee ?? '') > 0 ? (
              loading || loadingPreview ? (
                <Shimmer />
              ) : (
                <div className="pw-flex pw-gap-2">
                  {payment()?.originalClientServiceFee &&
                    parseFloat(payment()?.originalClientServiceFee ?? '') >
                      parseFloat(payment()?.clientServiceFee ?? '') && (
                      <CriptoValueComponent
                        code={payment()?.currency?.code}
                        symbol={payment()?.currency?.symbol}
                        value={payment()?.originalClientServiceFee ?? ''}
                        crypto={
                          payment()?.currency?.symbol == 'MATIC' ||
                          payment()?.currency?.symbol == 'ETH'
                        }
                        fontClass="pw-text-sm pw-font-[600] !pw-text-[#35394C] !pw-text-opacity-50 pw-line-through"
                      />
                    )}
                  <CriptoValueComponent
                    code={payment()?.currency?.code}
                    symbol={payment()?.currency?.symbol}
                    value={payment()?.clientServiceFee ?? ''}
                    crypto={
                      payment()?.currency?.symbol == 'MATIC' ||
                      payment()?.currency?.symbol == 'ETH'
                    }
                    fontClass="pw-text-sm pw-font-[600] pw-text-[#35394C]"
                  />
                </div>
              )
            ) : null}
          </div>
        )}

      {parseFloat((payment()?.gasFee as string) ?? '') == 0 ? null : (
        <div className="pw-flex pw-justify-between pw-mt-2">
          <div className="pw-flex pw-gap-x-1">
            <p className="pw-text-sm pw-text-[#35394C] pw-font-[400]">
              {translate('shared>components>gasPriceinfo')}
            </p>
            {/* <InfoIcon className="pw-mt-[2px]" /> */}
          </div>
          {loading ? (
            <Shimmer />
          ) : parseFloat((payment()?.gasFee as string) ?? '') == 0 ? null : (
            <CriptoValueComponent
              code={payment()?.currency?.code}
              symbol={payment()?.currency?.symbol}
              value={(payment()?.gasFee as string) ?? ''}
              crypto={
                payment()?.currency?.symbol == 'MATIC' ||
                payment()?.currency?.symbol == 'ETH'
              }
              fontClass="pw-text-sm pw-font-[600] pw-text-[#35394C]"
            />
          )}
        </div>
      )}
      <div className="pw-w-full pw-h-[1px] pw-bg-[#777E8F] pw-my-2"></div>
      <div className="pw-flex pw-justify-between">
        <p className="pw-font-[600] pw-text-sm pw-text-[#35394C]">
          {translate('shared>components>price&gasInfo')}
        </p>
        {loading || loadingPreview ? (
          <Shimmer className="pw-h-6 pw-w-17" />
        ) : (
          <div className="pw-flex pw-gap-2">
            {payment()?.originalTotalAmount &&
              parseFloat(payment()?.originalTotalAmount ?? '') >
                parseFloat(payment()?.fullOrderTotalAmount ?? '') && (
                <CriptoValueComponent
                  code={payment()?.currency?.code}
                  symbol={payment()?.currency?.symbol}
                  value={payment()?.originalTotalAmount ?? ''}
                  crypto={
                    payment()?.currency?.symbol == 'MATIC' ||
                    payment()?.currency?.symbol == 'ETH'
                  }
                  fontClass="pw-text-xl pw-font-[700] !pw-text-[#35394C] !pw-text-opacity-50 pw-line-through"
                />
              )}
            <CriptoValueComponent
              pointsPrecision="decimal"
              code={payment()?.currency?.code}
              symbol={payment()?.currency?.symbol}
              value={
                coinPayment()?.currency?.crypto
                  ? payment()?.originalTotalAmount ?? ''
                  : payment()?.fullOrderTotalAmount ?? ''
              }
              showFree
              crypto={
                payment()?.currency?.symbol == 'MATIC' ||
                payment()?.currency?.symbol == 'ETH'
              }
              fontClass="pw-text-xl pw-font-[700] !pw-text-[#35394C]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const PriceComponent = ({
  className,
  loading = false,
  name = 'BRL',
  payments,
}: PriceComponent) => {
  return (
    <TranslatableComponent>
      <_PriceComponent
        loading={loading}
        className={className}
        name={name}
        payments={payments}
      />
    </TranslatableComponent>
  );
};
