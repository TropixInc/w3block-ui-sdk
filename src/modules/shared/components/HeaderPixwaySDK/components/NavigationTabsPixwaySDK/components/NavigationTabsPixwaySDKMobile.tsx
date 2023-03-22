import { useState } from 'react';

import { ReactComponent as ChevronLeft } from '../../../../../assets/icons/chevronLeftFilled.svg';
import { ReactComponent as ChevronRight } from '../../../../../assets/icons/chevronRightFilled.svg';
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
  bgColor,
}: NavigationTabsPixwaySDKProps) => {
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const [openedTabs, setOpenedTabs] = useState<boolean>(false);
  const { data: session } = usePixwaySession();
  const [menuIndex, setMenuIndex] = useState(-1);
  const [selectedTitle, setSelectedTitle] = useState('');

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
        <div
          style={{ backgroundColor: bgColor }}
          className="pw-flex pw-flex-col pw-absolute pw-top-[90px] pw-left-0 pw-w-screen pw-z-30 pw-shadow-inner pw-py-8 pw-items-center pw-gap-y-4"
        >
          {tabs?.map((tab, i) => {
            if (tab.tabs?.length) {
              if (menuIndex === i)
                return (
                  <div>
                    <p
                      className="pw-text-black pw-text-lg pw-flex pw-items-center pw-gap-4"
                      onClick={() => {
                        setMenuIndex(-1);
                        setSelectedTitle('');
                      }}
                    >
                      {' '}
                      <ChevronLeft className="pw-w-4 pw-h-4" /> {selectedTitle}
                    </p>
                    <hr />
                    <div className="pw-top-8 pw-flex pw-justify-center">
                      <div
                        style={{ backgroundColor: bgColor }}
                        className={`
                        pw-py-4 pw-px-1
                        pw-flex pw-flex-col pw-gap-4 pw-text-center pw-justify-center
                      `}
                      >
                        {tab.tabs.map((t) => {
                          return (
                            <a
                              style={{ color: textColor }}
                              className={`pw-text-sm pw-font-semibold ${classNames?.tabClassName}`}
                              key={t.name}
                              href={t.router}
                            >
                              {t.name}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );

              return (
                !selectedTitle && (
                  <div>
                    <span
                      style={{ color: textColor }}
                      className={`
                      pw-text-sm pw-font-semibold
                      pw-cursor-pointer pw-underline 
                      pw-flex pw-items-center
                      ${classNames?.tabClassName}
                  `}
                      onClick={() => {
                        setMenuIndex(i);
                        setSelectedTitle(tab.name);
                      }}
                    >
                      {tab.name}

                      <ChevronRight className="pw-w-4 pw-h-4" />
                    </span>
                  </div>
                )
              );
            }

            return (
              !selectedTitle && (
                <a
                  style={{ color: textColor }}
                  href={tab.router}
                  className={`pw-font-semibold pw-text-sm ${classNames?.tabClassName}`}
                  key={tab.name}
                >
                  {tab.name}
                </a>
              )
            );
          })}

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
