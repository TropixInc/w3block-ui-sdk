/* eslint-disable react-hooks/exhaustive-deps */
import { Trans } from 'react-i18next';
import { useToggle } from 'react-use';

import { WalletTypes } from '@w3block/sdk-id';

import { useProfile } from '../../../shared';
import { ReactComponent as CashIcon } from '../../../shared/assets/icons/cashFilled.svg';
import { ReactComponent as ExternalLinkIcon } from '../../../shared/assets/icons/externalLink.svg';
import { ReactComponent as EyeIcon } from '../../../shared/assets/icons/eyeIcon.svg';
import { ReactComponent as EyeCrossedIcon } from '../../../shared/assets/icons/eyeIconCrossed.svg';
import { ReactComponent as MetamaskIcon } from '../../../shared/assets/icons/metamask.svg';
import { ReactComponent as WalletIcon } from '../../../shared/assets/icons/walletOutlined.svg';
import { InternalPagesLayoutBase } from '../../../shared/components/InternalPagesLayoutBase';
import { Link } from '../../../shared/components/Link';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { ChainScan } from '../../../shared/enums/ChainId';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useHasWallet } from '../../../shared/hooks/useHasWallet';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useUserWallet } from '../../../shared/hooks/useUserWallet';
// import { WalletExtract } from '../WalletExtract';
import { TokensListTemplate } from '../../../tokens';
//import { CardWallet } from './CardWallet';
import { ChipWallet } from './ChipWallet';

const _WalletInternalTemplate = () => {
  const [showValue, toggleShowValue] = useToggle(false);
  useHasWallet({});
  const { data: profile } = useProfile();
  const [translate] = useTranslation();
  const { mainWallet: wallet } = useUserWallet();
  const router = useRouterConnect();

  const isLoading = wallet == undefined;

  const extractLink = () => {
    if (wallet?.chainId === ChainScan.POLYGON)
      return `https://polygonscan.com/address/${wallet.address}`;
    if (wallet?.chainId === ChainScan.MUMBAI)
      return `https://mumbai.polygonscan.com/address/${wallet.address}`;
    return '';
  };

  return (
    <div className="pw-flex pw-flex-col pw-px-4 sm:pw-px-0">
      <div className="pw-w-full pw-font-bold pw-text-[18px] pw-leading-[23px] pw-hidden pw-mb-[30px]">
        {translate('components>menu>wallet')}
      </div>
      <div className="pw-bg-[#F7F7F7] pw-border pw-border-[#E4E4E4] pw-rounded-[14px] pw-p-6 pw-shadow-[0px_4px_20px_rgba(0,0,0,0.12)] pw-flex pw-flex-col pw-gap-[24px]">
        <div className="pw-w-full pw-items-center pw-justify-between sm:pw-flex">
          <div>
            <span className="pw-font-semibold pw-text-lg pw-flex pw-items-baseline sm:pw-text-[23px] pw-leading-[32px]">
              {translate('components>menu>wallet')}
              <a
                className="pw-flex pw-items-baseline pw-ml-3"
                target="_blank"
                href={extractLink()}
                rel="noreferrer"
              >
                <p className="pw-stroke-[#777E8F] hover:pw-stroke-brand-primary pw-text-xs sm:pw-text-sm  pw-text-gray-700">
                  {translate('wallet>page>extract')}
                </p>
                <ExternalLinkIcon className="sm:pw-ml-1 pw-h-[12px] pw-stroke-[#777E8F] hover:pw-stroke-brand-primary" />
              </a>
            </span>
            <p className=" pw-text-gray-700 pw-text-xs">{wallet?.address}</p>
          </div>

          <div className="pw-flex pw-items-center pw-mt-6 sm:pw-mt-0 pw-gap-2 sm:pw-gap-4">
            <div
              className="pw-w-[33px] pw-h-[33px] pw-border-2 pw-border-[#353945] pw-rounded-full pw-cursor-pointer pw-flex pw-justify-center pw-items-center"
              onClick={() => toggleShowValue()}
            >
              {showValue ? (
                <EyeIcon className="pw-stroke-brand-primary pw-w-4 sm:pw-w-auto" />
              ) : (
                <EyeCrossedIcon className="pw-stroke-brand-primary pw-w-4 sm:pw-w-auto" />
              )}
            </div>
            {isLoading ? (
              <ChipWallet.Skeleton />
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              profile?.data.wallets?.map((wallet: any) => {
                return wallet.type === WalletTypes.Vault ? (
                  <ChipWallet
                    key={wallet.id}
                    showValue={showValue}
                    Icon={() => (
                      <WalletIcon className="pw-stroke-brand-primary" />
                    )}
                    title={translate('wallet>page>balance')}
                  />
                ) : (
                  <ChipWallet
                    key={wallet.id}
                    showValue={showValue}
                    Icon={() => (
                      <MetamaskIcon className="pw-stroke-brand-primary" />
                    )}
                    title={translate('wallet>page>metamask')}
                  />
                );
              })
            )}
            <Link href={router.routerToHref(PixwayAppRoutes.ADD_FUNDS_TYPE)}>
              <div className="pw-w-[165px] pw-bg-brand-primary pw-p-[8px_16px_8px_11px] pw-border-2 pw-border-[#353945] pw-rounded-[48px] pw-flex pw-justify-start pw-items-center pw-gap-2">
                <div className="pw-rounded-full pw-border pw-bg-brand-primary pw-border-white pw-w-[30px] pw-h-[30px] pw-p-[5px] pw-flex pw-justify-center pw-items-center">
                  <CashIcon className="pw-fill-white" />
                </div>
                <div className="pw-w-[1px] pw-bg-[#DCDCDC] pw-h-[32px]" />
                <div className="pw-flex pw-flex-col pw-items-start pw-text-white pw-font-semibold pw-text-[13px] pw-leading-[13px] pw-cursor-pointer">
                  <Trans i18nKey={'wallet>page>addFunds'}>
                    <span>Adicionar</span>
                    Fundos
                  </Trans>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="pw-mt-6">
        <TokensListTemplate withLayout={false} />
      </div>
    </div>
  );
};

export const WalletInternalTemplate = () => {
  return (
    <TranslatableComponent>
      <InternalPagesLayoutBase
        classes={{ middleSectionContainer: 'pw-mb-[85px]' }}
      >
        <_WalletInternalTemplate />
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
