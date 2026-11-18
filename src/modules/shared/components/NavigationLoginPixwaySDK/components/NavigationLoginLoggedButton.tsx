/* eslint-disable prettier/prettier */
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useClickAway } from "react-use";

import { WalletTypes } from "@w3block/sdk-id";
import UserSimpleIcon from "../../../assets/icons/user.svg";
import ArrowDown from "../../../assets/icons/arrowDown.svg";
import LogoutIcon from "../../../assets/icons/logoutIconGray.svg";

import { NavigationMenuTabs } from "../interfaces/menu";
import { useRouterConnect } from "../../../hooks/useRouterConnect";

import { BaseButton } from "../../Buttons";

import {
  chainIdToCode,
  useGetRightWallet,
} from "../../../utils/getRightWallet";

import { useProfile } from "../../../hooks/useProfile";
import { useInternalMenuTabs } from "../../../hooks/useInternalMenuTabs";

import { CriptoValueComponent } from "../../CriptoValueComponent";
import { usePixwayAuthentication } from "../../../../auth/hooks/usePixwayAuthentication";
import { useUserWallet } from "../../../hooks/useUserWallet/useUserWallet";
import { useThemeConfig } from "../../../../storefront/hooks/useThemeConfig";
import { PixwayAppRoutes } from "../../../enums/PixwayAppRoutes";
import useTranslation from "../../../hooks/useTranslation";
interface NavigationLoginLoggedButtonProps {
  logo?: string | ReactNode;
  menuTabs?: NavigationMenuTabs[];
  textColor?: string;
  fontFamily?: string;
  backgroundColor?: string;
}

export const NavigationLoginLoggedButton = ({
  logo,
  menuTabs,
  textColor = "black",
  fontFamily,
  backgroundColor,
}: NavigationLoginLoggedButtonProps) => {
  //const [translate] = useTranslation();
  const [menu, setMenu] = useState<boolean>(false);
  const organizedLoyalties = useGetRightWallet();
  const ref = useRef(null);

  useClickAway(ref, () => {
    if (menu) setMenu(false);
  });

  return (
    <div className="pw-ml-2" ref={ref}>
      <div onClick={() => setMenu(!menu)} className="pw-cursor-pointer">
        <div
          onClick={() => setMenu(!menu)}
          className="pw-ml-5 pw-flex pw-items-center pw-gap-[6px] pw-cursor-pointer"
        >
          <UserSimpleIcon style={{ stroke: textColor }} />
          {organizedLoyalties &&
            organizedLoyalties.length > 0 &&
            organizedLoyalties.some(
              (wallet) =>
                wallet.type == "loyalty" &&
                wallet?.balance &&
                parseFloat(wallet?.balance ?? "0") > 0
            ) ? (
            <p
              style={{ color: textColor }}
              className="pw-font-[400] pw-text-xs"
            >
              {organizedLoyalties.find(
                (wallet) =>
                  wallet.type == "loyalty" &&
                  wallet?.balance &&
                  parseFloat(wallet?.balance ?? "0") > 0
              ).pointsPrecision == "decimal"
                ? parseFloat(
                  organizedLoyalties.find(
                    (wallet) =>
                      wallet.type == "loyalty" &&
                      wallet?.balance &&
                      parseFloat(wallet?.balance ?? "0") > 0
                  )?.balance ?? "0"
                ).toFixed(2)
                : parseFloat(
                  organizedLoyalties.find(
                    (wallet) =>
                      wallet.type == "loyalty" &&
                      wallet?.balance &&
                      parseFloat(wallet?.balance ?? "0") > 0
                  )?.balance ?? "0"
                ).toFixed(0)}
            </p>
          ) : null}

          <ArrowDown
            style={{
              stroke: textColor,
              transform: menu ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </div>

      {menu && (
        <NavigationMenu
          textColor={textColor}
          backgroundColor={backgroundColor}
          menuTabs={menuTabs}
          logo={logo}
          fontFamily={fontFamily}
        />
      )}
    </div>
  );
};
export const useDefaultMenuTabs = (textColor: string) => {
  const router = useRouterConnect();
  const { signOut } = usePixwayAuthentication();
  const iconProps = useMemo(
    () => ({ style: { color: textColor, stroke: textColor } }),
    [textColor]
  );
  const sharedTabs = useInternalMenuTabs({ iconProps });

  return useMemo<NavigationMenuTabs[]>(
    () => [
      ...sharedTabs.map((tab) => ({
        name: tab.title,
        id: tab.id,
        route: tab.link,
        icon: tab.icon,
        isVisible: tab.isVisible,
      })),
      {
        name: "Logout",
        icon: <LogoutIcon style={{ color: textColor, stroke: textColor }} />,
        action: () => {
          signOut().then(() => {
            router.push(PixwayAppRoutes.SIGN_IN);
          });
        },
        isVisible: true,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sharedTabs, textColor]
  );
};

const NavigationMenu = ({
  menuTabs: _menuTabs,
  fontFamily,
  backgroundColor,
  textColor,
}: NavigationLoginLoggedButtonProps) => {
  const defaultTabs = useDefaultMenuTabs(textColor ?? "black");
  const organizedWallets = useGetRightWallet();
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const menuTabs = _menuTabs ?? defaultTabs;
  const { mainWallet: wallet } = useUserWallet();
  const { setAuthenticatePaymentModal } = useUserWallet();
  const { defaultTheme } = useThemeConfig();
  const hideLoyaltyAuthentication =
    defaultTheme?.configurations?.contentData?.hideLoyaltyAuthentication;
  const WithWallet = () => {
    return (organizedWallets &&
      organizedWallets.length > 0 &&
      organizedWallets[0].type == "loyalty") ||
      (organizedWallets &&
        organizedWallets.length > 0 &&
        parseFloat(organizedWallets[0].balance ?? "0") > 0) ? (
      <div
        style={{ color: textColor }}
        className="pw-py-[6px] pw-px-2 pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)]"
      >
        <div className="pw-flex">
          <p className="pw-text-[10px] pw-font-[500]">
            {wallet?.type === WalletTypes.Vault
              ? translate("header>logged>pixwayBalance")
              : translate("header>logged>metamaskBalance")}
          </p>
        </div>
        <div className="pw-flex pw-items-center">
          <CriptoValueComponent
            textColor={textColor}
            pointsPrecision={organizedWallets[0].pointsPrecision}
            fontClass="pw-text-sm"
            crypto={true}
            value={organizedWallets[0].balance}
            code={chainIdToCode(
              organizedWallets[0].chainId,
              organizedWallets[0].currency
            )}
          />
        </div>
      </div>
    ) : null;
  };

  return (
    <div className="pw-relative">
      <div
        style={{ backgroundColor, color: textColor }}
        className={`pw-absolute pw-mt-[1.68rem] ${organizedWallets.length ? "pw-right-[-16px]" : ""
          } pw-bg-white pw-w-[160px] pw-rounded-b-[20px] pw-z-30 pw-px-2 pw-py-3 pw-shadow-md -pw-left-[95px]`}
      >
        {organizedWallets.length ? <WithWallet /> : null}

        <div className="pw-mt-[10px]">
          {menuTabs.map((menu) =>
            menu.isVisible ? (
              <a
                onClick={() => {
                  if (menu.route) {
                    router.push(router.routerToHref(menu.route));
                  } else if (menu.action) {
                    menu.action();
                  }
                }}
                key={menu.name}
                className="pw-flex pw-items-center pw-gap-x-2 pw-py-[8px] pw-border-b pw-border-[#EFEFEF] pw-cursor-pointer pw-stroke-[#383857]"
              >
                {menu.icon}
                <p
                  className="pw-font-[400] pw-text-xs"
                  style={{
                    fontFamily:
                      (fontFamily ? fontFamily : "Poppins") + ", sans-serif",
                  }}
                >
                  {menu.name}
                </p>
              </a>
            ) : null
          )}
          {organizedWallets.length &&
            organizedWallets.some((w) => w.type == "loyalty") &&
            !hideLoyaltyAuthentication ? (
            <BaseButton
              onClick={() => setAuthenticatePaymentModal?.(true)}
              className="!pw-text-white !pw-py-[5px] !pw-px-[24px] pw-mt-4 pw-w-full"
            >
              {translate("shared>navigationLoginLoggedButton>toScore")}
            </BaseButton>
          ) : null}
        </div>
      </div>
    </div>
  );
};
