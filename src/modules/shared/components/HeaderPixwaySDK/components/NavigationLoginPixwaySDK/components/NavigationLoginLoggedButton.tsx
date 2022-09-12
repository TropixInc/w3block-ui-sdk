import { ReactNode, useState } from 'react';

import { signOut } from 'next-auth/react';

import { ReactComponent as ArrowDown } from '../../../../../assets/icons/arrowDown.svg';
import { ReactComponent as EyeIcon } from '../../../../../assets/icons/eyeGold.svg';
import { ReactComponent as HelpIcon } from '../../../../../assets/icons/helpIconGray.svg';
import { ReactComponent as LogoutIcon } from '../../../../../assets/icons/logoutIconGray.svg';
import { ReactComponent as MyTokenIcon } from '../../../../../assets/icons/myTokensIconGray.svg';
import { ReactComponent as LogoIcon } from '../../../../../assets/icons/pixwayLogoIcon.svg';
import { ReactComponent as SettingsIcon } from '../../../../../assets/icons/settingsIconGray.svg';
import { ReactComponent as UserIcon } from '../../../../../assets/icons/userIconGray.svg';
import { ReactComponent as WalletIcon } from '../../../../../assets/icons/walletIconGray.svg';
import { PixwayAppRoutes } from '../../../../../enums/PixwayAppRoutes';
import { useProfile } from '../../../../../hooks';
import { usePixwaySession } from '../../../../../hooks/usePixwaySession';
import useRouter from '../../../../../hooks/useRouter';
import useTranslation from '../../../../../hooks/useTranslation';
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
  const { data: session } = usePixwaySession();
  const { data: profile } = useProfile();

  return (
    <div className="pw-ml-5 ">
      <div onClick={() => setMenu(!menu)} className="pw-cursor-pointer">
        <p className="pw-text-xs pw-font-montserrat pw-font-[400] ">
          {translate('header>logged>hiWallet', { name: session?.user?.name })}
        </p>
        <div className="pw-flex pw-items-center">
          <p className="pw-text-sm pw-font-montserrat pw-font-[600]">
            {profile?.data?.mainWallet?.address || ''}
          </p>
          <ArrowDown className="pw-ml-1" />
        </div>
      </div>

      {menu && <NavigationMenu menuTabs={menuTabs} logo={logo} />}
    </div>
  );
};

const PixwayLogoDefault = () => {
  return (
    <>
      <LogoIcon />
    </>
  );
};

export const DefaultMenuTabs = () => {
  const [translate] = useTranslation();
  const defaultTabs: NavigationMenuTabs[] = [
    {
      name: translate('header>components>defaultTab>myAccount'),
      route: PixwayAppRoutes.MY_PROFILE,
      icon: <UserIcon />,
    },
    {
      name: translate('header>components>defaultTab>myTokens'),
      route: PixwayAppRoutes.MY_TOKENS,
      icon: <MyTokenIcon />,
    },
    {
      name: translate('header>components>defaultTab>wallet'),
      route: PixwayAppRoutes.WALLET,
      icon: <WalletIcon />,
    },
    {
      name: translate('header>components>defaultTab>settings'),
      route: PixwayAppRoutes.SETTINGS,
      icon: <SettingsIcon />,
    },
    {
      name: translate('header>components>defaultTab>helpCenter'),
      route: PixwayAppRoutes.HELP,
      icon: <HelpIcon />,
    },
    {
      name: 'Logout',
      icon: <LogoutIcon />,
      action: () => signOut(),
    },
  ];

  return defaultTabs;
};

const NavigationMenu = ({
  logo = <PixwayLogoDefault />,
  menuTabs = DefaultMenuTabs(),
}: NavigationLoginLoggedButtonProps) => {
  const [translate] = useTranslation();
  const [blocked, setBlocked] = useState(false);
  const router = useRouter();
  const LogoToShow = () => {
    if (typeof logo == 'string') {
      return <img className="pw-object-contain" src={logo} />;
    } else {
      return <>{logo}</>;
    }
  };

  return (
    <div className="pw-relative">
      <div className="pw-absolute pw-mt-6 pw-ml-[210px] pw-bg-white pw-w-[160px] pw-rounded-b-[20px] pw-z-30 pw-px-2 pw-py-3">
        <div className="pw-py-[6px] pw-px-2 pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)]">
          <div className="pw-flex">
            <div className="pw-max-w-[14px] pw-max-h-[14px]">
              <LogoToShow />
            </div>
            <p className="pw-text-[10px] pw-font-montserrat pw-font-[500] pw-ml-[6px]">
              {translate('header>logged>pixwayBalance')}
            </p>
            <EyeIcon
              onClick={() => setBlocked(!blocked)}
              className="pw-ml-[6px] pw-cursor-pointer"
            />
          </div>
          <p className="pw-font-montserrat pw-font-[700] pw-text-xs pw-mt-1">
            R$ {blocked ? '******' : '243,50'}
          </p>
        </div>
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
