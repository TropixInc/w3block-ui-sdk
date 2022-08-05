import { useTranslation } from 'react-i18next';

import TranslatableComponent from '../TranslatableComponent';

interface PriceAndGasInfo {
  price: string;
  gasFee: string;
  className?: string;
}

const _PriceAndGasInfo = ({ price, gasFee, className }: PriceAndGasInfo) => {
  const [translate] = useTranslation();

  return (
    <div className={`pw-w-full ${className}`}>
      <div className="pw-flex pw-justify-between">
        <p className="pw-text-sm text-[#35394C] pw-font-[400]">Subtotal</p>
        <p className="pw-text-sm pw-font-[600] pw-text-[#35394C]">R${price}</p>
      </div>
      <div className="pw-flex pw-justify-between pw-mt-2">
        <p className="pw-text-sm text-[#35394C] pw-font-[400]">
          {translate('shared>components>gasPriceinfo')}
        </p>
        <p className="pw-text-sm pw-font-[600] pw-text-[#35394C]">R${gasFee}</p>
      </div>
      <div className="pw-w-full pw-h-[1px] pw-bg-[#777E8F] pw-my-2"></div>
      <div className="pw-flex pw-justify-between">
        <p className="pw-font-[600] pw-text-sm pw-text-[#35394C]">
          Valor a pagar
        </p>
        <p className="pw-text-xl pw-font-[700] pw-text-[#35394C]">
          R${parseFloat(price) + parseFloat(gasFee)}
        </p>
      </div>
    </div>
  );
};

export const PriceAndGasInfo = ({
  price,
  gasFee,
  className,
}: PriceAndGasInfo) => {
  return (
    <TranslatableComponent>
      <_PriceAndGasInfo className={className} price={price} gasFee={gasFee} />
    </TranslatableComponent>
  );
};
