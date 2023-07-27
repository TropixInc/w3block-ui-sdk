import { ReactComponent as DollarIcon } from '../../assets/icons/dollar-sign.svg';
import { ReactComponent as MetamaskIcon } from '../../assets/icons/metamask.svg';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useRouterConnect } from '../../hooks';
import { useCompanyConfig } from '../../hooks/useCompanyConfig';
import { WalletSimple } from '../../providers';
import { CriptoValueComponent } from '../CriptoValueComponent/CriptoValueComponent';
import { WeblockButton } from '../WeblockButton/WeblockButton';
interface WalletCardProps {
  wallet: WalletSimple;
  showValue?: boolean;
}

export const WalletCard = ({ wallet }: WalletCardProps) => {
  const { name } = useCompanyConfig();
  const { push } = useRouterConnect();
  const getIcon = () => {
    switch (wallet.type) {
      case 'vault':
        return <DollarIcon />;
      case 'metamask':
        return <MetamaskIcon />;
      default:
        return <DollarIcon />;
    }
  };

  const chainIdToCode = () => {
    if (wallet.chainId === 137 || wallet.chainId === 80001) {
      return 'MATIC';
    } else if (wallet.chainId === 1 || wallet.chainId === 4) {
      return 'ETH';
    } else {
      return '';
    }
  };

  const getName = () => {
    switch (wallet.type) {
      case 'vault':
        return name;
      case 'metamask':
        return 'Metamask';
      default:
        return name;
    }
  };

  return (
    <div className="pw-bg-white pw-rounded-[20px] pw-shadow-md pw-p-[20px] pw-w-full">
      <div>{getIcon()}</div>
      <p className=" pw-text-slate-900 pw-mt-3">Saldo</p>
      <p className="pw-text-sm pw-text-slate-800 pw-font-[400]">{getName()}</p>
      <div className="pw-mt-4">
        <CriptoValueComponent
          code={chainIdToCode()}
          crypto={true}
          value={wallet.balance ?? '0'}
        />
      </div>
      {wallet.type === 'vault' && (
        <WeblockButton
          onClick={() => push(PixwayAppRoutes.ADD_FUNDS_TYPE)}
          className="!pw-text-white !pw-py-[5px] !pw-px-[24px] pw-mt-4"
        >
          Adicionar
        </WeblockButton>
      )}
    </div>
  );
};
