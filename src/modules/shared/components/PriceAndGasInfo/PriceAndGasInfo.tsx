import { lazy } from 'react';
import { useTranslation } from 'react-i18next';

const CriptoValueComponent = lazy(() =>
  import('../CriptoValueComponent/CriptoValueComponent').then((module) => ({
    default: module.CriptoValueComponent,
  }))
);
const Shimmer = lazy(() =>
  import('../Shimmer').then((module) => ({
    default: module.Shimmer,
  }))
);

import { PaymentsResponse } from '../../../checkout/interface/interface';
import TranslatableComponent from '../TranslatableComponent';

interface PriceAndGasInfo {
  price?: string;
  gasFee?: string;
  service?: string;
  totalPrice?: string;
  className?: string;
  loading?: boolean;
  currency?: string;
  name?: string;
  originalPrice?: string;
  originalTotalPrice?: string;
  originalService?: string;
  loadingPreview?: boolean;
  payments?: PaymentsResponse[];
}

const _PriceAndGasInfo = ({
  price = '0',
  gasFee = '0',
  service,
  className,
  loading,
  totalPrice = '0',
  currency = 'R$',
  name = 'BRL',
  originalPrice,
  originalService,
  originalTotalPrice,
  loadingPreview = false,
  payments,
}: PriceAndGasInfo) => {
  const [translate] = useTranslation();

  const coinPayment = () => {
    if (payments?.length === 1) return payments[0];
    else
      return payments?.filter(
        (e) => e?.currencyId === '6ec75381-dd84-4edc-bedb-1a77fb430e10'
      )[0];
  };

  const payment = () => {
    if (payments?.length === 1) return payments[0];
    else
      return payments?.filter(
        (e) => e?.currencyId === '65fe1119-6ec0-4b78-8d30-cb989914bdcb'
      )[0];
  };

  if (payments) {
    return (
      <div className={`pw-w-full ${className}`}>
        <div className="pw-flex pw-justify-between">
          <p className="pw-text-sm pw-text-[#35394C] pw-font-[400]">Subtotal</p>
          {loading || loadingPreview ? (
            <Shimmer />
          ) : (
            <div className="pw-flex pw-gap-2">
              {payment()?.originalCartPrice &&
                parseFloat(payment()?.originalCartPrice ?? '') >
                  parseFloat(payment()?.cartPrice ?? '') && (
                  <CriptoValueComponent
                    code={name}
                    value={originalPrice ?? ''}
                    crypto={
                      payment()?.currency?.symbol == 'MATIC' ||
                      payment()?.currency?.symbol == 'ETH'
                    }
                    fontClass="pw-text-sm pw-font-[600] !pw-text-[#35394C] !pw-text-opacity-50 pw-line-through"
                  />
                )}
              <CriptoValueComponent
                code={name}
                value={
                  coinPayment()?.currencyId ===
                  '6ec75381-dd84-4edc-bedb-1a77fb430e10'
                    ? ((parseFloat(payment()?.totalPrice ?? '') +
                        parseFloat(
                          coinPayment()?.totalPrice ?? ''
                        )) as unknown as string)
                    : parseFloat(payment()?.cartPrice ?? '') === 0 &&
                      parseFloat(payment()?.totalPrice ?? '') !== 0
                    ? payment()?.totalPrice ?? ''
                    : payment()?.cartPrice ?? ''
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
        {coinPayment()?.currencyId ===
        '6ec75381-dd84-4edc-bedb-1a77fb430e10' ? (
          <div className="pw-flex pw-justify-between pw-mt-2">
            <p className="pw-text-sm pw-text-[#35394C] pw-font-[400]">Zucas</p>
            {loading || loadingPreview ? (
              <Shimmer />
            ) : (
              <div className="pw-flex pw-gap-2 pw-text-[#35394C]">
                -{' '}
                <CriptoValueComponent
                  code={name}
                  value={coinPayment()?.cartPrice ?? ''}
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
                          code={name}
                          value={payment()?.originalClientServiceFee ?? ''}
                          crypto={
                            payment()?.currency?.symbol == 'MATIC' ||
                            payment()?.currency?.symbol == 'ETH'
                          }
                          fontClass="pw-text-sm pw-font-[600] !pw-text-[#35394C] !pw-text-opacity-50 pw-line-through"
                        />
                      )}
                    <CriptoValueComponent
                      code={name}
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

        {parseFloat(payment()?.gasFee?.amount ?? '') == 0 ? null : (
          <div className="pw-flex pw-justify-between pw-mt-2">
            <div className="pw-flex pw-gap-x-1">
              <p className="pw-text-sm pw-text-[#35394C] pw-font-[400]">
                {translate('shared>components>gasPriceinfo')}
              </p>
              {/* <InfoIcon className="pw-mt-[2px]" /> */}
            </div>
            {loading ? (
              <Shimmer />
            ) : parseFloat(payment()?.gasFee?.amount ?? '') == 0 ? null : (
              <CriptoValueComponent
                code={name}
                value={payment()?.gasFee?.amount ?? ''}
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
              {payment()?.originalTotalPrice &&
                parseFloat(payment()?.originalTotalPrice ?? '') >
                  parseFloat(payment()?.totalPrice ?? '') && (
                  <CriptoValueComponent
                    code={name}
                    value={payment()?.originalTotalPrice ?? ''}
                    crypto={
                      payment()?.currency?.symbol == 'MATIC' ||
                      payment()?.currency?.symbol == 'ETH'
                    }
                    fontClass="pw-text-xl pw-font-[700] !pw-text-[#35394C] !pw-text-opacity-50 pw-line-through"
                  />
                )}
              <CriptoValueComponent
                code={name}
                value={payment()?.totalPrice ?? ''}
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
  } else
    return (
      <div className={`pw-w-full ${className}`}>
        <div className="pw-flex pw-justify-between">
          <p className="pw-text-sm pw-text-[#35394C] pw-font-[400]">Subtotal</p>
          {loading || loadingPreview ? (
            <Shimmer />
          ) : (
            <div className="pw-flex pw-gap-2">
              {originalPrice &&
                parseFloat(originalPrice) > parseFloat(price) && (
                  <CriptoValueComponent
                    code={name}
                    value={originalPrice ?? ''}
                    crypto={currency == 'MATIC' || currency == 'ETH'}
                    fontClass="pw-text-sm pw-font-[600] !pw-text-[#35394C] !pw-text-opacity-50 pw-line-through"
                  />
                )}
              <CriptoValueComponent
                code={name}
                value={
                  parseFloat(price) === 0 && parseFloat(totalPrice) !== 0
                    ? totalPrice
                    : price
                }
                crypto={currency == 'MATIC' || currency == 'ETH'}
                fontClass="pw-text-sm pw-font-[600] pw-text-[#35394C]"
              />
            </div>
          )}
        </div>
        {service && parseFloat(service) > 0 && (
          <div className="pw-flex pw-justify-between pw-mt-2">
            <div className="pw-flex pw-gap-x-1">
              <p className="pw-text-sm pw-text-[#35394C] pw-font-[400]">
                {translate('shared>components>servicePriceinfo')}
              </p>
              {/* <InfoIcon className="pw-mt-[2px]" /> */}
            </div>
            {service && parseFloat(service) > 0 ? (
              loading || loadingPreview ? (
                <Shimmer />
              ) : (
                <div className="pw-flex pw-gap-2">
                  {originalService &&
                    parseFloat(originalService) > parseFloat(service) && (
                      <CriptoValueComponent
                        code={name}
                        value={originalService ?? ''}
                        crypto={currency == 'MATIC' || currency == 'ETH'}
                        fontClass="pw-text-sm pw-font-[600] !pw-text-[#35394C] !pw-text-opacity-50 pw-line-through"
                      />
                    )}
                  <CriptoValueComponent
                    code={name}
                    value={service}
                    crypto={currency == 'MATIC' || currency == 'ETH'}
                    fontClass="pw-text-sm pw-font-[600] pw-text-[#35394C]"
                  />
                </div>
              )
            ) : null}
          </div>
        )}

        {parseFloat(gasFee) == 0 ? null : (
          <div className="pw-flex pw-justify-between pw-mt-2">
            <div className="pw-flex pw-gap-x-1">
              <p className="pw-text-sm pw-text-[#35394C] pw-font-[400]">
                {translate('shared>components>gasPriceinfo')}
              </p>
              {/* <InfoIcon className="pw-mt-[2px]" /> */}
            </div>
            {loading ? (
              <Shimmer />
            ) : parseFloat(gasFee) == 0 ? null : (
              <CriptoValueComponent
                code={name}
                value={gasFee}
                crypto={currency == 'MATIC' || currency == 'ETH'}
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
              {originalTotalPrice &&
                parseFloat(originalTotalPrice) > parseFloat(totalPrice) && (
                  <CriptoValueComponent
                    code={name}
                    value={originalTotalPrice}
                    crypto={currency == 'MATIC' || currency == 'ETH'}
                    fontClass="pw-text-xl pw-font-[700] !pw-text-[#35394C] !pw-text-opacity-50 pw-line-through"
                  />
                )}
              <CriptoValueComponent
                code={name}
                value={totalPrice}
                showFree
                crypto={currency == 'MATIC' || currency == 'ETH'}
                fontClass="pw-text-xl pw-font-[700] !pw-text-[#35394C]"
              />
            </div>
          )}
        </div>
      </div>
    );
};

export const PriceAndGasInfo = ({
  price,
  gasFee,
  className,
  loading = false,
  service,
  totalPrice,
  currency,
  name = 'BRL',
  originalPrice,
  originalService,
  originalTotalPrice,
  payments,
}: PriceAndGasInfo) => {
  return (
    <TranslatableComponent>
      <_PriceAndGasInfo
        loading={loading}
        service={service}
        className={className}
        price={price}
        gasFee={gasFee}
        totalPrice={totalPrice}
        currency={currency}
        name={name}
        originalPrice={originalPrice}
        originalService={originalService}
        originalTotalPrice={originalTotalPrice}
        payments={payments}
      />
    </TranslatableComponent>
  );
};
