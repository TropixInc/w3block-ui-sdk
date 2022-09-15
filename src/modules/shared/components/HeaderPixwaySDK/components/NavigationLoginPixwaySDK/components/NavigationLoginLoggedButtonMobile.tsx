import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import { ReactComponent as CopyIcon } from '../../../../../assets/icons/copyIcon.svg';
import { ReactComponent as EyeIcon } from '../../../../../assets/icons/eyeGold.svg';
import { ReactComponent as Pixwayicon } from '../../../../../assets/icons/pixwayLogoIcon.svg';
import { usePixwaySession } from '../../../../../hooks/usePixwaySession';
import { useProfile } from '../../../../../hooks/useProfile/useProfile';
import useRouter from '../../../../../hooks/useRouter';
import useTranslation from '../../../../../hooks/useTranslation';
import { UserTag } from '../../../../UserTag/UserTag';
import { NavigationMenuTabs } from '../interfaces/menu';
import { DefaultMenuTabs } from './NavigationLoginLoggedButton';

interface NavigationLoginLoggedButtonMobileProps {
  menuOpened?: boolean;
  toggleMenu?: () => void;
  menuTabs?: NavigationMenuTabs[];
}

export const NavigationLoginLoggedButtonMobile = ({
  menuOpened,
  toggleMenu,
  menuTabs = DefaultMenuTabs(),
}: NavigationLoginLoggedButtonMobileProps) => {
  const [translate] = useTranslation();
  const router = useRouter();
  const [userMenu, setUserMenu] = useState<boolean>(false);
  const { data: session } = usePixwaySession();
  const toggleTabsMemo = () => {
    if (toggleMenu) {
      toggleMenu();
    } else setUserMenu(!userMenu);
  };

  const [_, copy] = useCopyToClipboard();

  const validatorOpened = menuOpened ? menuOpened : userMenu;

  const { data: profile } = useProfile();

  return session ? (
    <div className="">
      <UserTag onClick={toggleTabsMemo} className="pw-mr-4 pw-cursor-pointer" />
      {validatorOpened ? (
        <div className="pw-bg-white pw-absolute pw-top-[90px] pw-left-0 pw-w-screen pw-z-30 pw-shadow-inner pw-pt-4 pw-pb-[30px] pw-px-[30px] pw-flex pw-flex-col pw-items-center">
          <p className="pw-font-montserrat pw-text-xs pw-font-[400]">
            {translate('header>logged>hiWallet', { name: session.user?.name })}
          </p>
          <div
            onClick={() => copy(profile?.data.mainWallet?.address || '')}
            className="pw-flex pw-gap-x-1 pw-mt-1 pw-cursor-pointer"
          >
            <p className="pw-font-montserrat pw-text-xs pw-font-[400] pw-cursor-pointer">
              {profile?.data.mainWallet?.address}
            </p>
            <CopyIcon />
          </div>
          <div className="pw-w-full pw-h-[1px] pw-bg-[#E6E8EC] pw-mt-3"></div>
          <div className="pw-mt-3 pw-px-[20px] pw-py-4 pw-shadow-[1px_1px_10px_rgba(0,0,0,0.2)] pw-rounded-2xl pw-w-full pw-flex">
            <div className="pw-flex-1">
              <div className="pw-flex pw-items-center pw-justify-between">
                <Pixwayicon />
                <p className="pw-text-xs pw-font-[400] pw-font-montserrat">
                  {translate('header>logged>pixwayBalance')}
                </p>
                <EyeIcon />
              </div>
              <p className="pw-font-montserrat pw-text-xs pw-font-[700] pw-mt-[2px]">
                R$10.000,36
              </p>
            </div>
            <div className="pw-h-[30px] pw-mx-4 pw-w-px pw-bg-[#EFEFEF]"></div>
            <div className="pw-flex-1"></div>
          </div>
          <div className="pw-mt-3 pw-w-full">
            {menuTabs.map((tab) => (
              <div
                onClick={() => {
                  if (tab.action) tab.action();
                  else if (tab.route) router.push(tab.route);
                }}
                className="pw-flex pw-gap-x-5 pw-items-center pw-justify-center pw-w-full pw-py-3 hover:pw-bg-brand-primary pw-cursor-pointer pw-rounded pw-text-lg pw-font-montserrat pw-text-[#383857] hover:pw-text-black"
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
