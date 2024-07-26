import { lazy } from 'react';

import DollarIcon from '../../assets/icons/dollar-sign.svg?react';
import ExtractIcon from '../../assets/icons/externalLink.svg?react';
import MetamaskIcon from '../../assets/icons/metamask.svg?react';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useRouterConnect } from '../../hooks';
import { useCompanyConfig } from '../../hooks/useCompanyConfig';
import useTranslation from '../../hooks/useTranslation';
import { useUserWallet } from '../../hooks/useUserWallet';
import { getExtractLinkByChainId } from '../../utils/getCryptoChainId';
const CriptoValueComponent = lazy(() =>
  import('../CriptoValueComponent/CriptoValueComponent').then((module) => ({
    default: module.CriptoValueComponent,
  }))
);
const ImageSDK = lazy(() =>
  import('../ImageSDK').then((module) => ({
    default: module.ImageSDK,
  }))
);
const WeblockButton = lazy(() =>
  import('../WeblockButton/WeblockButton').then((module) => ({
    default: module.WeblockButton,
  }))
);

interface WalletCardProps {
  type: 'metamask' | 'vault' | 'loyalty';
  chainId?: number;
  showValue?: boolean;
  currency?: string;
  balance?: string;
  image?: string;
  pointsPrecision?: 'decimal' | 'integer';
  address?: string;
  hideLoyaltyAuthentication?: boolean;
}

export const WalletCard = ({
  type,
  chainId,
  currency = '',
  balance,
  image,
  pointsPrecision = 'integer',
  address,
  hideLoyaltyAuthentication = false,
}: WalletCardProps) => {
  const { name } = useCompanyConfig();
  const [translate] = useTranslation();
  const { push } = useRouterConnect();
  const { setAuthenticatePaymentModal } = useUserWallet();
  const chainLink = getExtractLinkByChainId(chainId ?? 137, address ?? '0x0');
  const getIcon = () => {
    switch (type) {
      case 'vault':
        return <DollarIcon />;
      case 'metamask':
        return <MetamaskIcon />;
      default:
        return image ? (
          <ImageSDK
            src={image}
            width={50}
            fit="fit"
            className="pw-w-[50px] pw-h-[50px]"
            height={50}
          />
        ) : (
          <DollarIcon />
        );
    }
  };

  const chainIdToCode = () => {
    if (chainId === 137 || chainId === 80001) {
      return 'MATIC';
    } else if (chainId === 1 || chainId === 4) {
      return 'ETH';
    } else {
      return currency;
    }
  };

  const getName = () => {
    switch (type) {
      case 'vault':
        return name;
      case 'metamask':
        return 'Metamask';
      default:
        return name;
    }
  };

  return (
    <div className="pw-bg-white pw-rounded-[20px] pw-border pw-border-zinc-300 pw-p-[20px] pw-w-full ">
      <div className="pw-flex pw-justify-between">
        {getIcon()}
        <a
          href={chainId ? chainLink : PixwayAppRoutes.WALLET_RECEIPT}
          className="pw-flex pw-gap-2"
        >
          <p className="pw-text-[12px] pw-font-[600] pw-text-black">
            {translate('wallet>page>extract')}
          </p>
          <ExtractIcon style={{ stroke: 'black' }} />
        </a>
      </div>
      <p className=" pw-text-slate-900 pw-mt-3">
        {translate('header>logged>pixwayBalance')}
      </p>
      <p className="pw-text-sm pw-text-slate-800 pw-font-[400]">{getName()}</p>
      <div className="pw-mt-4">
        <CriptoValueComponent
          pointsPrecision={pointsPrecision}
          code={chainIdToCode()}
          crypto={true}
          value={balance ?? '0'}
        />
      </div>

      {type == 'vault' ? (
        <WeblockButton
          onClick={() => push(PixwayAppRoutes.ADD_FUNDS_TYPE)}
          className="!pw-text-white !pw-py-[5px] !pw-px-[24px] pw-mt-4 pw-w-full"
        >
          {translate('shared>add')}
        </WeblockButton>
      ) : null}
      {type == 'loyalty' && !hideLoyaltyAuthentication && (
        <WeblockButton
          onClick={() => setAuthenticatePaymentModal?.(true)}
          className="!pw-text-white !pw-py-[5px] !pw-px-[24px] pw-mt-4 pw-w-full"
        >
          {translate('shared>navigationLoginLoggedButton>toScore')}
        </WeblockButton>
      )}
    </div>
  );
};
