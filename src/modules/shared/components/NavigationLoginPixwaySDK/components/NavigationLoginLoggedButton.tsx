/* eslint-disable prettier/prettier */
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useClickAway } from "react-use";

import { WalletTypes } from "@w3block/sdk-id";
import { UserRoleEnum } from "@w3block/sdk-id/dist/types/enums";
import UserSimpleIcon from "../../../assets/icons/user.svg";
import ArrowDown from "../../../assets/icons/arrowDown.svg";
import WalletIcon from "../../../assets/icons/walletIconGray.svg";
import TicketIcon from "../../../assets/icons/ticketFilled.svg";
import DashboardIcon from "../../../assets/icons/dashboard.svg";
import MyOrdersIcon from "../../../assets/icons/myOrders.svg";
import NewsIcon from "../../../assets/icons/news.svg";
import ReceiptIcon from "../../../assets/icons/receipt.svg";
import UserIcon from "../../../assets/icons/user.svg";
import FormIcon from "../../../assets/icons/form.svg";
import IntegrationIcon from "../../../assets/icons/integrationIconOutlined.svg";
import LogoutIcon from "../../../assets/icons/logoutIconGray.svg";

import { NavigationMenuTabs } from "../interfaces/menu";
import { useRouterConnect } from "../../../hooks/useRouterConnect";

import { BaseButton } from "../../Buttons";
import { useTranslation } from "react-i18next";
import {
  chainIdToCode,
  useGetRightWallet,
} from "../../../utils/getRightWallet";
import { useIsProduction } from "../../../hooks/useIsProduction";

import { useProfile } from "../../../hooks/useProfile";
import { useIsHiddenMenuItem } from "../../../hooks/useIsHiddenMenuItem";

import { CriptoValueComponent } from "../../CriptoValueComponent";
import { usePixwayAuthentication } from "../../../../auth/hooks/usePixwayAuthentication";
import { useUserWallet } from "../../../hooks/useUserWallet/useUserWallet";
import { useLoyaltiesInfo } from "../../../../business/hooks/useLoyaltiesInfo";
import { useThemeConfig } from "../../../../storefront/hooks/useThemeConfig";
import { PixwayAppRoutes } from "../../../enums/PixwayAppRoutes";
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
  const isProduction = useIsProduction();
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const { signOut } = usePixwayAuthentication();
  const [tabsToShow, setTabsToShow] = useState<NavigationMenuTabs[]>([]);
  const { loyaltyWallet } = useUserWallet();
  const { data: profile } = useProfile();
  const userRoles = profile?.data.roles || [];
  const isHidden = useIsHiddenMenuItem(userRoles as Array<UserRoleEnum>);
  const isAdmin = Boolean(
    userRoles?.includes("admin") ||
      userRoles?.includes("superAdmin") ||
      userRoles?.includes("operator")
  );
  const isUser = Boolean(userRoles?.includes("user"));
  const isLoayaltyOperator = Boolean(userRoles?.includes("loyaltyOperator"));
  const hasLoyalty = !!useLoyaltiesInfo()?.loyalties?.length;
  const { defaultTheme } = useThemeConfig();
  const isCommerceReceiver = Boolean(
    userRoles.find((e: string) => e === "commerce.orderReceiver")
  );
  const internalMenuData = useMemo(() => {
    return defaultTheme?.configurations.styleData.internalMenu || {};
  }, [defaultTheme?.configurations.styleData.internalMenu]);

  const isShowAffiliates =
    (defaultTheme &&
      defaultTheme.configurations &&
      defaultTheme?.configurations?.styleData &&
      defaultTheme?.configurations?.styleData?.memberGetMember) ||
    false;

  const items: NavigationMenuTabs[] = [
    {
      name: internalMenuData["payment"]?.customLabel || "Pagamento",
      id: "payment",
      route: PixwayAppRoutes.LOYALTY_PAYMENT,
      icon: <WalletIcon style={{ color: textColor, stroke: textColor }} />,
      isVisible:
        (isLoayaltyOperator || isAdmin) && !isHidden("payment") && hasLoyalty,
    },
    {
      name:
        internalMenuData["pass"]?.customLabel ||
        translate("components>menu>tokenPass"),
      id: "pass",
      route: PixwayAppRoutes.TOKENPASS,
      icon: (
        <TicketIcon
          style={{ color: textColor, stroke: textColor }}
          width={17}
          height={17}
        />
      ),
      isVisible: isAdmin && !isHidden("pass"),
    },
    {
      name:
        internalMenuData["dash"]?.customLabel ||
        translate("components>menu>dashboard"),
      id: "dash",
      route: PixwayAppRoutes.LOYALTY_REPORT,
      icon: (
        <DashboardIcon
          style={{ color: textColor, stroke: textColor, fill: textColor }}
        />
      ),
      isVisible:
        (isLoayaltyOperator || isAdmin) && !isHidden("dash") && hasLoyalty,
    },
    {
      name:
        internalMenuData["wallet"]?.customLabel ||
        translate("components>menu>wallet"),
      id: "wallet",
      route: PixwayAppRoutes.WALLET,
      icon: <WalletIcon style={{ color: textColor, stroke: textColor }} />,
      isVisible: (isUser || isAdmin) && !isHidden("wallet"),
    },
    {
      name:
        internalMenuData["mySales"]?.customLabel ||
        translate("pages>mysales>mysales"),
      id: "mySales",
      icon: <MyOrdersIcon />,
      route: PixwayAppRoutes.MY_SALES,
      isVisible: isHidden("mySales") === false,
    },
    {
      name:
        internalMenuData["withdraws"]?.customLabel ||
        translate("components>menu>withdraws"),
      id: "withdraws",
      icon: <WalletIcon style={{ color: textColor, stroke: textColor }} />,
      route: PixwayAppRoutes.WITHDRAWS,
      isVisible: isHidden("withdraws") === false,
    },
    {
      name:
        internalMenuData["withdrawsAdmin"]?.customLabel ||
        "Relatório de saques",
      id: "withdrawsAdmin",
      icon: <WalletIcon style={{ color: textColor, stroke: textColor }} />,
      route: PixwayAppRoutes.WITHDRAWS_ADMIN,
      isVisible: isAdmin && !isHidden("withdrawsAdmin"),
    },
    {
      name:
        internalMenuData["affiliates"]?.customLabel ||
        translate("shared>menu>affiliates"),
      id: "affiliates",
      route: PixwayAppRoutes.AFFILIATES,
      icon: (
        <NewsIcon
          width={17}
          height={17}
          style={{ color: textColor, stroke: textColor }}
        />
      ),
      isVisible:
        (isUser || isAdmin) && !isHidden("affiliates") && isShowAffiliates,
    },
    {
      name:
        internalMenuData["extract"]?.customLabel ||
        translate("wallet>page>extract"),
      id: "extract",
      icon: (
        <ReceiptIcon
          style={{ color: textColor, stroke: textColor, fill: textColor }}
          width={15}
          height={15}
        />
      ),
      route: PixwayAppRoutes.WALLET_RECEIPT,
      isVisible:
        (isUser || isAdmin) &&
        loyaltyWallet &&
        loyaltyWallet.length > 0 &&
        !isHidden("extract"),
    },
    {
      name: internalMenuData["futureStatement"]?.customLabel || "Recebimentos",
      id: "futureStatement",
      icon: (
        <ReceiptIcon
          style={{ color: textColor, stroke: textColor, fill: textColor }}
          width={15}
          height={15}
        />
      ),
      route: PixwayAppRoutes.WALLET_FUTURE,
      isVisible:
        (isCommerceReceiver || isAdmin) &&
        loyaltyWallet &&
        loyaltyWallet.length > 0 &&
        !isHidden("futureStatement"),
    },
    {
      name: internalMenuData["staking"]?.customLabel || "Recompensas",
      id: "staking",
      icon: (
        <WalletIcon
          width={17}
          height={17}
          style={{ color: textColor, stroke: textColor }}
        />
      ),
      route: PixwayAppRoutes.STAKING,
      isVisible:
        !isHidden("staking") && loyaltyWallet && loyaltyWallet.length > 0,
    },
    {
      name:
        internalMenuData["myOrders"]?.customLabel ||
        translate("header>components>defaultTab>myOrders"),
      id: "myOrders",
      route: PixwayAppRoutes.MY_ORDERS,
      icon: <MyOrdersIcon style={{ color: textColor, stroke: textColor }} />,
      isVisible: (isUser || isAdmin) && !isHidden("myOrders"),
    },
    {
      name:
        internalMenuData["myProfile"]?.customLabel ||
        translate("components>menu>myProfile"),
      id: "myProfile",
      route: PixwayAppRoutes.MY_PROFILE,
      icon: <UserIcon style={{ color: textColor, stroke: textColor }} />,
      isVisible: (isUser || isAdmin) && !isHidden("myProfile"),
    },
    {
      name:
        internalMenuData["requests"]?.customLabel ||
        translate("components>menu>requests"),
      id: "requests",
      icon: (
        <FormIcon
          style={{ color: textColor, fill: textColor, stroke: textColor }}
          width={17}
          height={17}
        />
      ),
      route: PixwayAppRoutes.REQUESTS,
      isVisible: isHidden("requests") === false,
    },
    {
      name: internalMenuData["cards"]?.customLabel || "Meus cartões",
      id: "cards",
      icon: <WalletIcon style={{ color: textColor, stroke: textColor }} />,
      route: PixwayAppRoutes.CARDS,
      isVisible: (isUser || isAdmin) && !isHidden("cards"),
    },
    {
      name:
        internalMenuData["integration"]?.customLabel ||
        translate("components>menu>integration"),
      id: "integration",
      route: PixwayAppRoutes.CONNECTION,
      icon: <IntegrationIcon style={{ color: textColor, stroke: textColor }} />,
      isVisible: (isUser || isAdmin) && !isHidden("integration"),
    },
    // {
    //   name: internalMenuData['integration']?.customLabel || translate('header>components>defaultTab>settings'),
    //   id: 'integration',
    //   route: PixwayAppRoutes.SETTINGS,
    //   icon: <SettingsIcon />,
    // },
    // {
    //   name: internalMenuData['help']?.customLabel || translate('header>components>defaultTab>helpCenter'),
    //   id: 'help',
    //   route: PixwayAppRoutes.HELP,
    //   icon: <HelpIcon />,
    // },
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
  ];

  useEffect(() => {
    setTabsToShow(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProduction, profile, loyaltyWallet]);

  return tabsToShow;
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
        className={`pw-absolute pw-mt-[1.68rem] ${
          organizedWallets.length ? "pw-right-[-16px]" : ""
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
