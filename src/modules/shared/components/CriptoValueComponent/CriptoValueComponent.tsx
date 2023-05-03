import { ReactComponent as ETHIcon } from '../../assets/icons/Eth.svg';
import { ReactComponent as MaticIcon } from '../../assets/icons/maticIcon.svg';
import { CurrencyEnum } from '../../enums/Currency';
type CurrencyObjectType = {
  [key: string]: string;
};
export const CriptoValueComponent = ({
  code,
  value,
  size = 15,
  fontClass = '',
  crypto,
}: {
  code?: string;
  value: string;
  size?: string | number;
  fontClass?: string;
  crypto?: boolean;
}) => {
  const currencyLocales: CurrencyObjectType = {
    BRL: 'pt-BR',
    USD: 'en-US',
  };

  const formatterCurrency = (): Intl.NumberFormat => {
    return Intl.NumberFormat(currencyLocales[code ?? 'BRL'], {
      style: 'currency',
      currency: code || 'BRL',
    });
  };
  const getIcon = () => {
    switch (code) {
      case CurrencyEnum.ETHEREUM:
        return <ETHIcon style={{ width: size + 'px', height: size + 'px' }} />;
      default:
        return (
          <MaticIcon style={{ width: size + 'px', height: size + 'px' }} />
        );
    }
  };

  const getCryptoValueByCode = () => {
    if (code === CurrencyEnum.ETHEREUM) {
      return Number(Number(value).toFixed(4));
    } else {
      return Number(Number(value).toFixed(3));
    }
  };

  return (
    <div className="pw-flex pw-gap-1 pw-items-center">
      {crypto && getIcon()}
      <p className={`pw-font-semibold pw-text-black ${fontClass}`}>
        {crypto
          ? getCryptoValueByCode()
          : formatterCurrency().format(Number(value))}
      </p>
    </div>
  );
};
