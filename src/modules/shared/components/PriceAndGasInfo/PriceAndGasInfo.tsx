import { useTranslation } from 'react-i18next';

import { ReactComponent as InfoIcon } from '../../assets/icons/informationCircled.svg';
import { Shimmer } from '../Shimmer';
import TranslatableComponent from '../TranslatableComponent';

interface PriceAndGasInfo {
  price: string;
  gasFee: string;
  service: string;
  totalPrice: string;
  className?: string;
  loading?: boolean;
}

const _PriceAndGasInfo = ({
  price,
  gasFee,
  service,
  className,
  loading,
  totalPrice,
}: PriceAndGasInfo) => {
  const [translate] = useTranslation();

  return (
    <div className={`pw-w-full ${className}`}>
      <div className="pw-flex pw-justify-between">
        <p className="pw-text-sm text-[#35394C] pw-font-[400]">Subtotal</p>
        {loading ? (
          <Shimmer />
        ) : (
          <p className="pw-text-sm pw-font-[600] pw-text-[#35394C]">
            R${price}
          </p>
        )}
      </div>
      <div className="pw-flex pw-justify-between pw-mt-2">
        <div className="pw-flex pw-gap-x-1">
          <p className="pw-text-sm text-[#35394C] pw-font-[400]">
            {translate('shared>components>servicePriceinfo')}
          </p>
          <InfoIcon className="pw-mt-[2px]" />
        </div>
        {loading ? (
          <Shimmer />
        ) : (
          <p className="pw-text-sm pw-font-[600] pw-text-[#35394C]">
            R${parseFloat(service).toFixed(2)}
          </p>
        )}
      </div>
      <div className="pw-flex pw-justify-between pw-mt-2">
        <div className="pw-flex pw-gap-x-1">
          <p className="pw-text-sm text-[#35394C] pw-font-[400]">
            {translate('shared>components>gasPriceinfo')}
          </p>
          <InfoIcon className="pw-mt-[2px]" />
        </div>
        {loading ? (
          <Shimmer />
        ) : (
          <p className="pw-text-sm pw-font-[600] pw-text-[#35394C]">
            R${gasFee}
          </p>
        )}
      </div>
      <div className="pw-w-full pw-h-[1px] pw-bg-[#777E8F] pw-my-2"></div>
      <div className="pw-flex pw-justify-between">
        <p className="pw-font-[600] pw-text-sm pw-text-[#35394C]">
          {translate('shared>components>price&gasInfo')}
        </p>
        {loading ? (
          <Shimmer className="pw-h-6 pw-w-17" />
        ) : (
          <p className="pw-text-xl pw-font-[700] pw-text-[#35394C]">
            R${totalPrice}
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
      />
    </TranslatableComponent>
  );
};
