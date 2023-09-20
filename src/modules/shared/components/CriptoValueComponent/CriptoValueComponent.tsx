import { ReactComponent as ETHIcon } from '../../assets/icons/Eth.svg';
import { ReactComponent as MaticIcon } from '../../assets/icons/maticIcon.svg';
import { CurrencyEnum } from '../../enums/Currency';
import useTranslation from '../../hooks/useTranslation';
type CurrencyObjectType = {
  [key: string]: string;
};
export const CriptoValueComponent = ({
  code,
  value,
  size = 15,
  fontClass = '',
  crypto,
  showFree = false,
  dontShow = false,
  pointsPrecision = 'integer',
  textColor,
}: {
  code?: string;
  value: string;
  size?: string | number;
  fontClass?: string;
  crypto?: boolean;
  showFree?: boolean;
  dontShow?: boolean;
  pointsPrecision?: 'decimal' | 'integer';
  textColor?: string;
}) => {
  const [translate] = useTranslation();
  const getIcon = () => {
    switch (code) {
      case CurrencyEnum.ETHEREUM:
        return <ETHIcon style={{ width: size + 'px', height: size + 'px' }} />;
      case CurrencyEnum.MATIC:
        return (
          <MaticIcon style={{ width: size + 'px', height: size + 'px' }} />
        );
      default:
        return (
          <p
            style={textColor ? { color: textColor } : {}}
            className={`pw-text-sm pw-text-gray-700 ${fontClass}`}
          >
            {code}
          </p>
        );
    }
  };

  const getCryptoValueByCode = () => {
    if (code === CurrencyEnum.ETHEREUM) {
      return Number(Number(value).toFixed(4));
    } else if (code === CurrencyEnum.MATIC) {
      return Number(Number(value).toFixed(3));
    } else {
      return pointsPrecision == 'decimal'
        ? Number(value).toFixed(2)
        : Number(Number(value).toFixed(0));
    }
  };

  return dontShow ? null : (
    <div className="pw-flex pw-gap-1 pw-items-center">
      {crypto && getIcon()}
      <p
        style={textColor ? { color: textColor } : {}}
        className={`pw-font-semibold pw-text-black ${fontClass}`}
      >
        {parseFloat(value) === 0 && showFree
          ? translate('commerce>checkout>free')
          : crypto
          ? getCryptoValueByCode()
          : formatterCurrency(code ?? 'BRL').format(Number(value))}
      </p>
    </div>
  );
};

export const formatterCurrency = (code: string): Intl.NumberFormat => {
  return Intl.NumberFormat(currencyLocales[code ?? 'BRL'], {
    style: 'currency',
    currency: code || 'BRL',
  });
};

export const currencyLocales: CurrencyObjectType = {
  BRL: 'pt-BR',
  USD: 'en-US',
};
