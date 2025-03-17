import { ReactNode, lazy } from 'react';

import Matic from '../../assets/icons/maticFilled.svg?react';
import { useCryptoCurrencyExchangeRate } from '../../hooks/useCryptoCurrencyExchangeRate';
const TooltipHover = lazy(() =>
  import('../TooltipHover/TooltipHover').then((module) => ({
    default: module.TooltipHover,
  }))
);

interface Props {
  imageBox?: ReactNode;
  title: string;
  subTitle?: string;
  gasPrice?: number;
  classes?: {
    box?: string;
  };
  currency?: 'USD' | 'BRL';
}

export const GasModalHeader = ({
  imageBox,
  title,
  subTitle,
  gasPrice = 0,
  currency = 'BRL',
  classes = {},
}: Props) => {
  const { data: cryptoCurrencyExchangeRate } =
    useCryptoCurrencyExchangeRate('MATIC');

  const rates =
    currency === 'BRL'
      ? Number(cryptoCurrencyExchangeRate?.data.data.rates.BRL)
      : Number(cryptoCurrencyExchangeRate?.data.data.rates.USD);

  const convertedGasPrice = gasPrice * rates;

  const gasPricePaidInBRL =
    convertedGasPrice < 0.01
      ? 'R$ 0,01'
      : convertedGasPrice?.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
  const gasPricePaidInUSD =
    convertedGasPrice < 0.01
      ? '$ 0.01'
      : convertedGasPrice?.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        });

  return (
    <div
      className={`pw-flex pw-items-center pw-rounded-[20px] pw-border pw-border-[#E9F0FB] pw-px-[22px] pw-py-[15px] ${
        classes.box || ''
      }`}
    >
      {imageBox && imageBox}

      <div className="pw-ml-3 pw-text-[#202528] pw-text-xs pw-leading-[100%] pw-font-semibold pw-flex-1">
        <TooltipHover
          content={title}
          position="bottom"
          classes={{
            arrow:
              'after:!pw-border-[transparent_transparent_#FFFFFF_transparent]',
          }}
        >
          <p className="pw-mb-[6px] pw-w-full pw-line-clamp-2">{title}</p>
        </TooltipHover>
        {subTitle && <p>{subTitle}</p>}
      </div>

      {gasPrice > 0 && convertedGasPrice && (
        <div className="pw-flex pw-flex-col pw-gap-y-1 pw-items-end">
          <div className="pw-flex pw-items-center pw-gap-x-1">
            <Matic className="pw-fill-[#8247E5] pw-w-[15px] pw-h-[13px]" />
            <p className="pw-text-[#202528] pw-text-base pw-leading-[19px] pw-font-bold">
              {gasPrice}
            </p>
          </div>
          <p className="pw-font-normal pw-text-xs pw-leading-[14px] pw-text-[#777E8F]">
            {currency === 'BRL' ? gasPricePaidInBRL : gasPricePaidInUSD}
          </p>
        </div>
      )}
    </div>
  );
};
