import { useContext, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import { WalletTypes } from '@w3block/sdk-id';

import { ReactComponent as CopyIcon } from '../../../../../assets/icons/copyIcon.svg';
import { ReactComponent as EyeIcon } from '../../../../../assets/icons/eyeGold.svg';
import { usePixwaySession } from '../../../../../hooks/usePixwaySession';
import { useProfileWithKYC } from '../../../../../hooks/useProfileWithKYC/useProfileWithKYC';
import { useRouterConnect } from '../../../../../hooks/useRouterConnect';
import useTranslation from '../../../../../hooks/useTranslation';
import { useUserWallet } from '../../../../../hooks/useUserWallet';
import { AttachWalletContext } from '../../../../../providers/AttachWalletProvider/AttachWalletProvider';
import {
  chainIdToCode,
  useGetRightWallet,
} from '../../../../../utils/getRightWallet';
import { CriptoValueComponent } from '../../../../CriptoValueComponent/CriptoValueComponent';
import { PixwayButton } from '../../../../PixwayButton';
import { UserTag } from '../../../../UserTag/UserTag';
import { NavigationMenuTabs } from '../interfaces/menu';
import { useDefaultMenuTabs } from './NavigationLoginLoggedButton';
interface NavigationLoginLoggedButtonMobileProps {
  menuOpened?: boolean;
  toggleMenu?: () => void;
  menuTabs?: NavigationMenuTabs[];
  backgroundColor?: string;
  textColor?: string;
}

export const NavigationLoginLoggedButtonMobile = ({
  menuOpened,
  toggleMenu,
  menuTabs: _menuTabs,
  backgroundColor,
  textColor,
}: NavigationLoginLoggedButtonMobileProps) => {
  const { setAttachModal } = useContext(AttachWalletContext);
  const { setAuthenticatePaymentModal } = useUserWallet();
  const defaultTabs = useDefaultMenuTabs(textColor ?? 'black');
  const [hideBalance, setHideBalance] = useState(true);
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const { profile } = useProfileWithKYC();
  const { mainWallet: wallet } = useUserWallet();
  const [userMenu, setUserMenu] = useState<boolean>(false);
  const { data: session } = usePixwaySession();
  const toggleTabsMemo = () => {
    if (toggleMenu) {
      toggleMenu();
    } else setUserMenu(!userMenu);
  };
  const [copied, setCopied] = useState<boolean>(false);
  const [_, setCopy] = useCopyToClipboard();
  const copyAddress = (address: string) => {
    setCopied(true);
    setCopy(address || '');
    setTimeout(() => setCopied(false), 5000);
  };
  const menuTabs = _menuTabs ?? defaultTabs;
  const validatorOpened = menuOpened ? menuOpened : userMenu;
  const isUser =
    (profile?.roles?.includes('user') ||
      profile?.roles?.includes('admin') ||
      profile?.roles?.includes('superAdmin')) &&
    !profile?.roles?.includes('loyaltyOperator');

  const organizedWallets = useGetRightWallet();

  const { loyaltyWallet } = useUserWallet();

  const WithWallet = () => {
    return (
      <div className="pw-mt-3 pw-px-[20px] pw-py-4 pw-shadow-[1px_1px_10px_rgba(0,0,0,0.2)] pw-rounded-2xl pw-w-full pw-flex">
        <div className="pw-flex-1">
          <div
            onClick={() => setHideBalance(!hideBalance)}
            className="pw-flex pw-items-center pw-gap-2 pw-cursor-pointer"
          >
            <p className="pw-text-xs pw-font-[400]">
              {wallet?.type === WalletTypes.Vault
                ? translate('header>logged>pixwayBalance')
                : translate('header>logged>metamaskBalance')}
            </p>
            <EyeIcon />
          </div>
          {hideBalance ? (
            <CriptoValueComponent
              fontClass="pw-text-white pw-text-sm"
              crypto={true}
              value={organizedWallets[0].balance}
              code={chainIdToCode(
                organizedWallets[0].chainId,
                organizedWallets[0].currency
              )}
            />
          ) : (
            <p className="pw-font-[700] pw-text-xs">*****</p>
          )}
        </div>
      </div>
    );
  };

  const WithoutWallet = () => {
    return (
      <PixwayButton
        onClick={() => setAttachModal(true)}
        fullWidth
        className="!pw-bg-brand-primary !pw-text-white !pw-text-xs !pw-py-[9px] pw-rounded-[48px] pw-shadow-[0px_2px_4px_rgba(0,0,0,0.26)]"
      >
        {translate('shared>header>connectWallet')}
      </PixwayButton>
    );
  };

  return session ? (
    <div style={{ backgroundColor }}>
      <UserTag onClick={toggleTabsMemo} className="pw-mr-4 pw-cursor-pointer" />
      {validatorOpened ? (
        <div className="pw-bg-white pw-absolute pw-top-[90px] pw-left-0 pw-w-screen pw-z-30 pw-shadow-inner pw-pt-4 pw-pb-[30px] pw-px-[30px] pw-flex pw-flex-col pw-items-center">
          <p className="pw-text-xs pw-font-[400]">
            {translate('header>logged>hiWallet', { name: profile?.name })}
          </p>
          <div
            onClick={() => copyAddress(profile?.mainWallet?.address || '')}
            className="pw-flex pw-gap-x-1 pw-mt-1 pw-cursor-pointer"
          >
            <p className="pw-text-xs pw-font-[400] pw-cursor-pointer">
              {profile?.mainWallet?.address || '-'}
            </p>
            <CopyIcon />
            {copied ? (
              <div className="pw-relative">
                <div className="pw-flex pw-items-center pw-mt-2 pw-gap-x-2 pw-absolute pw-bg-slate-300 pw-shadow-md pw-rounded-md pw-right-0 pw-top-3 pw-p-1">
                  <p className="pw-text-sm pw-text-[#353945]">
                    {translate('components>menu>copied')}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
          <div className="pw-flex pw-justify-center ">
            {isUser && loyaltyWallet && loyaltyWallet.length ? (
              <button
                onClick={() => setAuthenticatePaymentModal?.(true)}
                className="pw-px-6 pw-py-[5px] pw-bg-zinc-100 pw-rounded-[48px] pw-border pw-border-black pw-backdrop-blur-sm pw-justify-center pw-items-center pw-gap-2.5 pw-mt-[10px] pw-text-black pw-text-xs pw-font-medium"
              >
                Autenticar
              </button>
            ) : null}
          </div>
          <div className="pw-w-full pw-h-[1px] pw-bg-[#E6E8EC] pw-mt-3"></div>
          {wallet ? <WithWallet /> : <WithoutWallet />}
          <div className="pw-mt-3 pw-w-full">
            {menuTabs.map((tab) => (
              <div
                onClick={() => {
                  if (tab.action) tab.action();
                  else if (tab.route) {
                    toggleTabsMemo();
                    router.pushConnect(tab.route);
                  }
                }}
                className="pw-flex pw-gap-x-5 pw-items-center pw-justify-center pw-w-full pw-py-3 hover:pw-bg-brand-primary pw-cursor-pointer pw-rounded pw-text-lg pw-text-[#383857] hover:pw-text-black"
                key={tab.name}
              >
                {tab.icon}
                <p>{tab.name}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  ) : null;
};
