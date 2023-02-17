import { useState } from 'react';

import { ReactComponent as CloseIcon } from '../../../../../assets/icons/closeIconHeader.svg';
import { ReactComponent as HamburguerIcon } from '../../../../../assets/icons/headerHamburger.svg';
import { PixwayAppRoutes } from '../../../../../enums/PixwayAppRoutes';
import { usePixwaySession } from '../../../../../hooks/usePixwaySession';
import { useRouterConnect } from '../../../../../hooks/useRouterConnect';
import useTranslation from '../../../../../hooks/useTranslation';
import { PixwayButton } from '../../../../PixwayButton/PixwayButton';
import { NavigationTabsPixwaySDKProps } from '../NavigationTabsPixwaySDK';

export const NavigationTabsPixwaySDKMobile = ({
  classNames,
  tabs,
  opened,
  toogleMenu,
  signInRoute = PixwayAppRoutes.SIGN_IN,
  signUpRoute = PixwayAppRoutes.SIGN_UP,
  textColor = 'black',
  hasSignUp,
}: NavigationTabsPixwaySDKProps) => {
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const [openedTabs, setOpenedTabs] = useState<boolean>(false);
  const { data: session } = usePixwaySession();

  const toggleTabsMemo = () => {
    if (toogleMenu) {
      toogleMenu();
    } else setOpenedTabs(!openedTabs);
  };

  return !session || (tabs && tabs.length > 0) ? (
    <div className={` ${classNames?.className}`}>
      {opened ? (
        <CloseIcon
          style={{ stroke: textColor }}
          className="pw-cursor-pointer"
          onClick={toggleTabsMemo}
        />
      ) : (
        <HamburguerIcon
          style={{ stroke: textColor }}
          onClick={toggleTabsMemo}
          className="pw-cursor-pointer"
        />
      )}
      {opened ? (
        <div className="pw-flex pw-flex-col pw-bg-white pw-absolute pw-top-[90px] pw-left-0 pw-w-screen pw-z-30 pw-shadow-inner pw-py-8 pw-items-center pw-gap-y-4">
          {tabs?.map((tab) => (
            <a
              style={{ color: textColor }}
              href={tab.router}
              className={`pw-font-[600] pw-text-sm ${classNames?.tabClassName}`}
              key={tab.name}
            >
              {tab.name}
            </a>
          ))}
          {!session && (
            <div className="pw-flex pw-justify-center pw-gap-x-[26px]">
              <PixwayButton
                onClick={() => router.pushConnect(signInRoute)}
                fullWidth
                className="!pw-bg-brand-primary !pw-px-[40px] !pw-text-white !pw-text-xs !pw-py-[9px] pw-rounded-[48px] pw-shadow-[0px_2px_4px_rgba(0,0,0,0.26)]"
              >
                {translate('shared>login')}
              </PixwayButton>
              {hasSignUp && (
                <PixwayButton
                  onClick={() => router.pushConnect(signUpRoute)}
                  fullWidth
                  className="!pw-bg-[#EFEFEF] !pw-px-[40px] !pw-text-black !pw-text-xs !pw-py-[9px] pw-rounded-[48px]  !pw-border-[#DCDCDC] !pw-border-1"
                >
                  {translate('shared>register')}
                </PixwayButton>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  ) : null;
};
