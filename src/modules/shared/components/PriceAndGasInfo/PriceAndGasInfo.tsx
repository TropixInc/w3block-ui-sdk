import { useTranslation } from 'react-i18next';

import { ReactComponent as EthIcon } from '../../assets/icons/Eth.svg';
import { ReactComponent as MaticIcon } from '../../assets/icons/maticIcon.svg';
import { Shimmer } from '../Shimmer';
import TranslatableComponent from '../TranslatableComponent';

interface PriceAndGasInfo {
  price: string;
  gasFee: string;
  service: string;
  totalPrice: string;
  className?: string;
  loading?: boolean;
  currency?: string;
}

const _PriceAndGasInfo = ({
  price,
  gasFee,
  service,
  className,
  loading,
  totalPrice,
  currency = 'R$',
}: PriceAndGasInfo) => {
  const [translate] = useTranslation();
  return (
    <div className={`pw-w-full ${className}`}>
      <div className="pw-flex pw-justify-between">
        <p className="pw-text-sm pw-text-[#35394C] pw-font-[400]">Subtotal</p>
        {loading ? (
          <Shimmer />
        ) : (
          <p className="pw-text-sm pw-font-[600] pw-text-[#35394C] pw-flex pw-items-center">
            {currency == 'MATIC' ? (
              <MaticIcon className="pw-h-[16px] pw-w-[16px] pw-mr-2" />
            ) : currency === 'ETH' ? (
              <EthIcon className="pw-h-[16px] pw-w-[16px] pw-mr-2" />
            ) : (
              currency
            )}
            {parseFloat(price).toFixed(2)}
          </p>
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
            loading ? (
              <Shimmer />
            ) : (
              <p className="pw-text-sm pw-font-[600] pw-text-[#35394C] pw-flex pw-items-center">
                {currency == 'MATIC' ? (
                  <MaticIcon className="pw-h-[16px] pw-w-[16px] pw-mr-2" />
                ) : currency === 'ETH' ? (
                  <EthIcon className="pw-h-[16px] pw-w-[16px] pw-mr-2" />
                ) : (
                  currency
                )}
                {parseFloat(service).toFixed(2)}
              </p>
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
            <p className="pw-text-sm pw-font-[600] pw-text-[#35394C] pw-flex pw-items-center">
              {currency == 'MATIC' ? (
                <MaticIcon className="pw-h-[16px] pw-w-[16px] pw-mr-2" />
              ) : currency === 'ETH' ? (
                <EthIcon className="pw-h-[16px] pw-w-[16px] pw-mr-2" />
              ) : (
                currency
              )}
              {gasFee}
            </p>
          )}
        </div>
      )}
      <div className="pw-w-full pw-h-[1px] pw-bg-[#777E8F] pw-my-2"></div>
      <div className="pw-flex pw-justify-between">
        <p className="pw-font-[600] pw-text-sm pw-text-[#35394C]">
          {translate('shared>components>price&gasInfo')}
        </p>
        {loading ? (
          <Shimmer className="pw-h-6 pw-w-17" />
        ) : (
          <p className="pw-text-xl pw-font-[700] pw-text-[#35394C] pw-flex pw-items-center">
            {currency == 'MATIC' ? (
              <MaticIcon className="pw-h-[16px] pw-w-[16px] pw-mr-2" />
            ) : currency === 'ETH' ? (
              <EthIcon className="pw-h-[16px] pw-w-[16px] pw-mr-2" />
            ) : (
              currency
            )}
            {totalPrice}
          </p>
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
      />
    </TranslatableComponent>
  );
};
