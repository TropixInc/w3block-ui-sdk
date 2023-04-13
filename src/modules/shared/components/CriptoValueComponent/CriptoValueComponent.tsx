import { ReactComponent as ETHIcon } from '../../assets/icons/Eth.svg';
import { ReactComponent as MaticIcon } from '../../assets/icons/maticIcon.svg';
import { CurrencyEnum } from '../../enums/Currency';
export const CriptoValueComponent = ({
  code,
  value,
  size = 15,
  fontClass = '',
}: {
  code?: string;
  value?: string;
  size?: string | number;
  fontClass?: string;
}) => {
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

  return (
    <div className="pw-flex pw-gap-1 pw-items-center">
      {getIcon()}{' '}
      <p className={`pw-font-semibold pw-text-black ${fontClass}`}>{value}</p>
    </div>
  );
};
