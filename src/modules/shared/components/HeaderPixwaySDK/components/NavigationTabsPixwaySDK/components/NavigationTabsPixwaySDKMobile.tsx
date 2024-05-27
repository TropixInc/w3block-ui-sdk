import { useRef, useState } from 'react';

import {
  ControlledMenu,
  MenuItem,
  SubMenu,
  useClick,
} from '@szhsin/react-menu';

import ChevronRight from '../../../../../assets/icons/chevronRightFilled.svg?react';
import CloseIcon from '../../../../../assets/icons/closeIconHeader.svg?react';
import HamburguerIcon from '../../../../../assets/icons/headerHamburger.svg?react';
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
  hasLogIn = true,
  bgColor,
  bgSelectionColor,
  textSelectionColor,
}: NavigationTabsPixwaySDKProps) => {
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const [openedTabs, setOpenedTabs] = useState<boolean>(false);
  const { data: session } = usePixwaySession();
  const ref = useRef(null);
  const [isOpenSubmenu, setOpenSubmenu] = useState(false);
  const anchorProps = useClick(isOpenSubmenu, setOpenSubmenu);

  const toggleTabsMemo = () => {
    if (toogleMenu) {
      toogleMenu();
    } else setOpenedTabs(!openedTabs);
  };

  const onRenderMenu = (item: any) => {
    if (item.tabs) {
      return item.tabs.map((subm: any, idx: any) => (
        <SubMenu
          menuStyle={{
            backgroundColor: bgColor,
            color: textColor,
            padding: 0,
          }}
          key={item.name + idx}
          itemProps={{ className: '!pw-p-0' }}
          label={({ hover, open }) => (
            <span
              className="pw-block pw-p-[0.375rem_1.5rem] pw-w-full"
              style={{
                color: hover || open ? textSelectionColor : textColor,
                backgroundColor: hover || open ? bgSelectionColor : '',
                opacity: open ? 0.8 : 1,
              }}
            >
              {item.name}
            </span>
          )}
        >
          {onRenderMenu(subm)}
        </SubMenu>
      ));
    } else {
      return (
        <MenuItem href={item.router} className="!pw-p-0">
          {({ hover }) => {
            return (
              <div
                className="pw-block pw-p-[0.375rem_1.5rem] pw-w-full"
                style={{
                  backgroundColor: hover ? bgSelectionColor : '',
                  color: hover ? textSelectionColor : textColor,
                }}
              >
                <p>{item.name}</p>
              </div>
            );
          }}
        </MenuItem>
      );
    }
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
              return (
                <>
                  <button
                    key={tab.name + i}
                    style={{ color: textColor }}
                    type="button"
                    ref={ref}
                    className="pw-flex pw-items-center pw-gap-x-2"
                    {...anchorProps}
                  >
                    {tab.name}
                    <ChevronRight
                      className="pw-rotate-90 pw-w-3 pw-h-3"
                      style={{ fill: textColor }}
                    />
                  </button>
                  <ControlledMenu
                    state={isOpenSubmenu ? 'open' : 'closed'}
                    anchorRef={ref}
                    onClose={() => setOpenSubmenu(false)}
                    menuStyle={{ backgroundColor: bgColor }}
                  >
                    {tab.tabs.map((sub, idx) => {
                      if (sub.tabs) {
                        return onRenderMenu(sub);
                      } else {
                        return (
                          <MenuItem
                            key={sub.name + idx}
                            href={sub.router}
                            className="!pw-p-0"
                          >
                            {({ hover }) => {
                              return (
                                <div
                                  className="pw-block pw-p-[0.375rem_1.5rem] pw-w-full"
                                  style={{
                                    backgroundColor: hover
                                      ? bgSelectionColor
                                      : '',
                                    color: hover
                                      ? textSelectionColor
                                      : textColor,
                                  }}
                                >
                                  <p>{sub.name}</p>
                                </div>
                              );
                            }}
                          </MenuItem>
                        );
                      }
                    })}
                  </ControlledMenu>
                </>
              );
            } else {
              return (
                <a
                  style={{ color: textColor }}
                  key={tab.name}
                  href={tab.router ?? ''}
                >
                  {tab.name}
                </a>
              );
            }
          })}

          {!session && hasLogIn && (
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
