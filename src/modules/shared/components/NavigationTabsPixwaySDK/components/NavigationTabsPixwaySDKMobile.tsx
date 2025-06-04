import { useState } from "react";

import { useTranslation } from "react-i18next";
import { useLocale } from "../../../hooks/useLocale";

import { useRouterConnect } from "../../../hooks/useRouterConnect";
import { usePixwaySession } from "../../../hooks/usePixwaySession";

import { Menu, MenuButton, MenuItem, SubMenu } from "@szhsin/react-menu";
import ChevronRight from "../../../assets/icons/chevronRightFilled.svg";
import CloseIcon from "../../../assets/icons/closeIconHeader.svg";
import HamburguerIcon from "../../../assets/icons/headerHamburger.svg";
import { PixwayButton } from "../../PixwayButton";
import { PixwayAppRoutes } from "../../../enums/PixwayAppRoutes";
import { NavigationTabsPixwaySDKProps } from "../../../interfaces/NavigationTabsPixwaySDKTabs";
import { useThemeConfig } from "../../../../storefront/hooks/useThemeConfig";
import { getI18nString } from "../../../../storefront/hooks/useDynamicString";

export const NavigationTabsPixwaySDKMobile = ({
  classNames,
  tabs,
  opened,
  toogleMenu,
  signInRoute = PixwayAppRoutes.SIGN_IN,
  signUpRoute = PixwayAppRoutes.SIGN_UP,
  textColor = "black",
  hasSignUp,
  hasLogIn = true,
  bgColor,
  bgSelectionColor,
  textSelectionColor,
}: NavigationTabsPixwaySDKProps) => {
  const [translate] = useTranslation();
  const locale = useLocale();
  const theme = useThemeConfig();
  const router = useRouterConnect();
  const [openedTabs, setOpenedTabs] = useState<boolean>(false);
  const { data: session } = usePixwaySession();
  const [isOpenSubmenu, setOpenSubmenu] = useState(false);

  const toggleTabsMemo = () => {
    if (toogleMenu) {
      toogleMenu();
    } else setOpenedTabs(!openedTabs);
  };

  const onRenderMenu = (item: any) => {
    if (item?.tabs) {
      return item?.tabs?.map((subm: any, idx: any) => {
        const { text: subName } = getI18nString(subm?.name, locale, theme);
        return (
          <SubMenu
            menuStyle={{
              backgroundColor: bgColor,
              color: textColor,
              padding: 0,
            }}
            key={subm.name.trim() + idx}
            itemProps={{ className: "!pw-p-0" }}
            label={({ hover, open }) => (
              <span
                className="pw-block pw-p-[0.375rem_1.5rem] pw-w-full"
                style={{
                  color: hover || open ? textSelectionColor : textColor,
                  backgroundColor: hover || open ? bgSelectionColor : "",
                  opacity: open ? 0.8 : 1,
                }}
              >
                {subName}
              </span>
            )}
          >
            {onRenderMenu(subm)}
          </SubMenu>
        );
      });
    } else {
      return (
        <MenuItem href={item.router} className="!pw-p-0">
          {({ hover }) => {
            const { text: name } = getI18nString(item.name, locale, theme);
            return (
              <div
                className="pw-block pw-p-[0.375rem_1.5rem] pw-w-full"
                style={{
                  backgroundColor: hover ? bgSelectionColor : "",
                  color: hover ? textSelectionColor : textColor,
                }}
              >
                <p>{name}</p>
              </div>
            );
          }}
        </MenuItem>
      );
    }
  };

  return (!session || tabs && tabs?.length > 0) ? (
    <div className={` ${classNames?.className}`}>
     {opened ? (
        <CloseIcon
          style={{ stroke: 'white' }}
          className="pw-cursor-pointer"
          onClick={toggleTabsMemo}
        />
      ) : (
        <HamburguerIcon
          style={{ stroke: 'white' }}
          onClick={toggleTabsMemo}
          className="pw-cursor-pointer"
        />
      )} 
      {opened ? (
        <div
          style={{ backgroundColor: bgColor }}
          className="pw-flex pw-flex-col pw-absolute pw-top-[90px] pw-left-0 pw-w-screen pw-z-30 pw-shadow-inner pw-py-8 pw-items-center pw-gap-y-4"
        >
          {tabs?.map((tab) => {
            const { text: name } = getI18nString(tab.name, locale, theme);
            if (tab.tabs?.length) {
              return (
                <>
                  <Menu
                    onClick={() => setOpenSubmenu(!isOpenSubmenu)}
                    menuStyle={{ backgroundColor: bgColor }}
                    title={tab.name}
                    menuButton={
                      <MenuButton className="pw-flex pw-gap-x-3 pw-items-center">
                        <span>{name}</span>
                        <ChevronRight
                          className="pw-rotate-90 pw-w-3 pw-h-3"
                          style={{ fill: textColor }}
                        />
                      </MenuButton>
                    }
                  >
                    {tab.tabs.map((sub, idx) => {
                      if (sub.tabs) {
                        return onRenderMenu(sub);
                      } else {
                        const { text: subName } = getI18nString(
                          sub.name,
                          locale,
                          theme
                        );
                        return (
                          <MenuItem
                            key={sub.name.trim() + idx}
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
                                      : "",
                                    color: hover
                                      ? textSelectionColor
                                      : textColor,
                                  }}
                                >
                                  <p>{subName}</p>
                                </div>
                              );
                            }}
                          </MenuItem>
                        );
                      }
                    })}
                  </Menu>
                </>
              );
            } else {
              return (
                <a
                  style={{ color: textColor }}
                  key={tab.name.trim()}
                  href={tab.router ?? ""}
                >
                  {name}
                </a>
              );
            }
          })}

          {(!session && hasLogIn) ? (
            <div className="pw-flex pw-justify-center pw-gap-x-[26px]">
              <PixwayButton
                onClick={() => router.pushConnect(signInRoute)}
                fullWidth
                className="!pw-bg-brand-primary !pw-px-[40px] !pw-text-white !pw-text-xs !pw-py-[9px] pw-rounded-[48px] pw-shadow-[0px_2px_4px_rgba(0,0,0,0.26)]"
              >
                {translate("shared>login")}
              </PixwayButton>
              {hasSignUp && (
                <PixwayButton
                  onClick={() => router.pushConnect(signUpRoute)}
                  fullWidth
                  className="!pw-bg-[#EFEFEF] !pw-px-[40px] !pw-text-black !pw-text-xs !pw-py-[9px] pw-rounded-[48px]  !pw-border-[#DCDCDC] !pw-border-1"
                >
                  {translate("shared>register")}
                </PixwayButton>
              )}
            </div>
          ) : <></>}
        </div>
      ) : null}
    </div>
  ) : null;
};
