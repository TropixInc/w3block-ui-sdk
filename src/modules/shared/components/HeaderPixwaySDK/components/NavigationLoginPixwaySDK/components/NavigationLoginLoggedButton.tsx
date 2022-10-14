import { ReactNode, useContext, useMemo, useState } from 'react';

import { ChainId, WalletTypes } from '@w3block/sdk-id';

import { usePixwayAuthentication } from '../../../../../../auth/hooks/usePixwayAuthentication';
import { ReactComponent as ArrowDown } from '../../../../../assets/icons/arrowDown.svg';
import { ReactComponent as ETHIcon } from '../../../../../assets/icons/Eth.svg';
import { ReactComponent as EyeIcon } from '../../../../../assets/icons/eyeGold.svg';
// import { ReactComponent as HelpIcon } from '../../../../../assets/icons/helpIconGray.svg';
import { ReactComponent as LogoutIcon } from '../../../../../assets/icons/logoutIconGray.svg';
import { ReactComponent as MaticIcon } from '../../../../../assets/icons/maticFilled.svg';
import { ReactComponent as MyTokenIcon } from '../../../../../assets/icons/myTokensIconGray.svg';
// import { ReactComponent as SettingsIcon } from '../../../../../assets/icons/settingsIconGray.svg';
import { ReactComponent as UserIcon } from '../../../../../assets/icons/userIconGray.svg';
import { ReactComponent as WalletIcon } from '../../../../../assets/icons/walletIconGray.svg';
import { PixwayAppRoutes } from '../../../../../enums/PixwayAppRoutes';
import { useProfile } from '../../../../../hooks';
import useRouter from '../../../../../hooks/useRouter';
import useTranslation from '../../../../../hooks/useTranslation';
import { useUserWallet } from '../../../../../hooks/useUserWallet';
import { AttachWalletContext } from '../../../../../providers/AttachWalletProvider/AttachWalletProvider';
import { PixwayButton } from '../../../../PixwayButton';
import { NavigationMenuTabs } from '../interfaces/menu';

interface NavigationLoginLoggedButtonProps {
  logo?: string | ReactNode;
  menuTabs?: NavigationMenuTabs[];
}

export const NavigationLoginLoggedButton = ({
  logo,
  menuTabs,
}: NavigationLoginLoggedButtonProps) => {
  const [translate] = useTranslation();
  const [menu, setMenu] = useState<boolean>(false);
  const { data: profile } = useProfile();
  const { wallet } = useUserWallet();

  return (
    <div className="pw-ml-5 ">
      <div onClick={() => setMenu(!menu)} className="pw-cursor-pointer">
        <p className="pw-text-xs pw-font-montserrat pw-font-[400] ">
          {wallet?.type === WalletTypes.Vault
            ? translate('header>logged>hiWallet', { name: profile?.data?.name })
            : translate('header>logged>metamaskHiWallet', {
                name: profile?.data?.name,
              })}
        </p>
        <div className="pw-flex pw-items-center">
          <p className="pw-text-sm pw-font-montserrat pw-font-[600]">
            {profile?.data?.mainWallet?.address || '-'}
          </p>
          <ArrowDown className="pw-ml-1" />
        </div>
      </div>

      {menu && <NavigationMenu menuTabs={menuTabs} logo={logo} />}
    </div>
  );
};

export const useDefaultMenuTabs = () => {
  const [translate] = useTranslation();
  const router = useRouter();
  const { signOut } = usePixwayAuthentication();
  return useMemo<NavigationMenuTabs[]>(
    () => [
      {
        name: translate('header>components>defaultTab>myAccount'),
        route: PixwayAppRoutes.MY_PROFILE,
        icon: <UserIcon />,
      },
      {
        name: translate('header>components>defaultTab>myTokens'),
        route: PixwayAppRoutes.TOKENS,
        icon: <MyTokenIcon />,
      },
      {
        name: translate('header>components>defaultTab>wallet'),
        route: PixwayAppRoutes.WALLET,
        icon: <WalletIcon />,
      },
      // {
      //   name: translate('header>components>defaultTab>settings'),
      //   route: PixwayAppRoutes.SETTINGS,
      //   icon: <SettingsIcon />,
      // },
      // {
      //   name: translate('header>components>defaultTab>helpCenter'),
      //   route: PixwayAppRoutes.HELP,
      //   icon: <HelpIcon />,
      // },
      {
        name: 'Logout',
        icon: <LogoutIcon />,
        action: () => {
          signOut();
          router.push(PixwayAppRoutes.HOME);
        },
      },
    ],
    [translate, router, signOut]
  );
};

const NavigationMenu = ({
  menuTabs: _menuTabs,
}: NavigationLoginLoggedButtonProps) => {
  const defaultTabs = useDefaultMenuTabs();
  const { setAttachModal } = useContext(AttachWalletContext);
  const [translate] = useTranslation();
  const [showValue, setShowValue] = useState(false);
  const router = useRouter();
  const menuTabs = _menuTabs ?? defaultTabs;
  const { data: profile } = useProfile();
  const { wallet } = useUserWallet();

  const renderIcon = () => {
    return wallet?.chainId === ChainId.Polygon ||
      wallet?.chainId === ChainId.Mumbai ? (
      <MaticIcon className="pw-fill-[#8247E5]" />
    ) : (
      <ETHIcon className="pw-fill-black" />
    );
  };
  const hasMainWallet = profile?.data.mainWallet?.address;

  const WithWallet = () => {
    return (
      <div className="pw-py-[6px] pw-px-2 pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)]">
        <div className="pw-flex">
          <p className="pw-text-[10px] pw-font-montserrat pw-font-[500] pw-ml-[6px]">
            {wallet?.type === WalletTypes.Vault
              ? translate('header>logged>pixwayBalance')
              : translate('header>logged>metamaskBalance')}
          </p>
          <EyeIcon
            onClick={() => setShowValue(!showValue)}
            className="pw-ml-[6px] pw-cursor-pointer"
          />
        </div>
        <div className="pw-flex pw-items-center">
          {showValue ? (
            <>
              {renderIcon()}
              <p className="pw-font-montserrat pw-font-[700] pw-text-xs pw-ml-1">
                {parseFloat(wallet?.balance ?? '').toFixed(2)}
              </p>
            </>
          ) : (
            <p className="pw-font-montserrat pw-font-[700] pw-text-xs">*****</p>
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

  return (
    <div className="pw-relative">
      <div
        className={`pw-absolute pw-mt-6 ${
          hasMainWallet ? 'pw-ml-[210px]' : ''
        } pw-bg-white pw-w-[160px] pw-rounded-b-[20px] pw-z-30 pw-px-2 pw-py-3 pw-shadow-md`}
      >
        {hasMainWallet ? <WithWallet /> : <WithoutWallet />}

        <div className="pw-mt-[10px]">
          {menuTabs.map((menu) => (
            <div
              onClick={() => {
                if (menu.route) {
                  router.push(menu.route);
                } else if (menu.action) {
                  menu.action();
                }
              }}
              key={menu.name}
              className="pw-flex pw-items-center pw-gap-x-2 pw-py-[8px] pw-border-b pw-border-[#EFEFEF] pw-cursor-pointer"
            >
              {menu.icon}
              <p className="pw-font-poppins pw-font-[400] pw-text-xs">
                {menu.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
