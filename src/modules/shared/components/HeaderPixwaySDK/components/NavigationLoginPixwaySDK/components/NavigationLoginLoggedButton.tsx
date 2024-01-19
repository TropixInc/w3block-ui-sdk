/* eslint-disable prettier/prettier */
import {
  ReactNode,  useEffect, useMemo, useRef,
  useState,
} from 'react';
import { useClickAway } from 'react-use';

import {  WalletTypes } from '@w3block/sdk-id';
import { useFlags } from 'launchdarkly-react-client-sdk';



import { usePixwayAuthentication } from '../../../../../../auth/hooks/usePixwayAuthentication';
import { useLoyaltiesInfo } from '../../../../../../business/hooks/useLoyaltiesInfo';
import { UseThemeConfig } from '../../../../../../storefront/hooks/useThemeConfig/useThemeConfig';
import  ArrowDown  from '../../../../../assets/icons/arrowDown.svg?react';
import DashboardIcon from '../../../../../assets/icons/dashboard.svg?react';
import  EyeIcon  from '../../../../../assets/icons/eyeGold.svg?react';
// import  HelpIcon  from '../../../../../assets/icons/helpIconGray.svg?react';
import  IntegrationIcon  from '../../../../../assets/icons/integrationIconOutlined.svg?react';
import  LogoutIcon  from '../../../../../assets/icons/logoutIconGray.svg?react';
import  MyOrdersIcon  from "../../../../../assets/icons/myOrders.svg?react"
import  NewsIcon  from '../../../../../assets/icons/news.svg?react';
import  ReceiptIcon from "../../../../../assets/icons/receipt.svg?react";
//import  MyTokenIcon  from '../../../../../assets/icons/myTokensIconGray.svg?react';
// import  SettingsIcon  from '../../../../../assets/icons/settingsIconGray.svg?react';
import  TicketIcon  from '../../../../../assets/icons/ticketFilled.svg?react';
import  UserSimpleIcon from "../../../../../assets/icons/user.svg?react"
import  UserIcon  from '../../../../../assets/icons/userIconGray.svg?react';
import  WalletIcon  from '../../../../../assets/icons/walletIconGray.svg?react';
import { PixwayAppRoutes } from '../../../../../enums/PixwayAppRoutes';
import { useProfile } from '../../../../../hooks';
import { useIsHiddenMenuItem } from '../../../../../hooks/useIsHiddenMenuItem/useIsHiddenMenuItem';
import { useIsProduction } from '../../../../../hooks/useIsProduction';
import { useRouterConnect } from '../../../../../hooks/useRouterConnect';
import useTranslation from '../../../../../hooks/useTranslation';
import { useUserWallet } from '../../../../../hooks/useUserWallet';
import { chainIdToCode, useGetRightWallet } from '../../../../../utils/getRightWallet';
import { CriptoValueComponent } from '../../../../CriptoValueComponent/CriptoValueComponent';
import { WeblockButton } from '../../../../WeblockButton/WeblockButton';
import { NavigationMenuTabs } from '../interfaces/menu';
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
  textColor = 'black',
  fontFamily,
  backgroundColor,
}: NavigationLoginLoggedButtonProps) => {
  //const [translate] = useTranslation();
  const [menu, setMenu] = useState<boolean>(false);
  const organizedLoyalties = useGetRightWallet()
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
        {organizedLoyalties && organizedLoyalties.length > 0 && organizedLoyalties.some(wallet => wallet.type == 'loyalty' && wallet?.balance && parseFloat(wallet?.balance ?? "0") > 0) ? (<p style={{ color: textColor }} className="pw-font-[400] pw-text-xs">
          {organizedLoyalties.find(wallet => (wallet.type == "loyalty" && wallet?.balance && parseFloat(wallet?.balance ?? "0") > 0)).pointsPrecision == "decimal" ? parseFloat(organizedLoyalties.find(wallet => (wallet.type == "loyalty" && wallet?.balance && parseFloat(wallet?.balance ?? "0") > 0))?.balance ?? "0").toFixed(2) : parseFloat(organizedLoyalties.find(wallet => (wallet.type == "loyalty" && wallet?.balance && parseFloat(wallet?.balance ?? "0") > 0))?.balance ?? "0").toFixed(0)}
        </p>) : null}
        
        <ArrowDown
          style={{
            stroke: textColor,
            transform: menu ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </div>
      </div>

      {menu && <NavigationMenu textColor={textColor} backgroundColor={backgroundColor} menuTabs={menuTabs} logo={logo} fontFamily={fontFamily} />}
    </div>
  );
};
export const useDefaultMenuTabs = (textColor: string) => {
  const isProduction = useIsProduction();
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const { signOut } = usePixwayAuthentication();
  const [tabsToShow, setTabsToShow] = useState<NavigationMenuTabs[]>([]);
  const { pass } = useFlags();
  const { loyaltyWallet } = useUserWallet();
  const { data: profile } = useProfile();
  const userRoles = profile?.data.roles || [];
  const isHidden = useIsHiddenMenuItem(userRoles);
  const isAdmin = Boolean(
    userRoles?.includes('admin') || userRoles?.includes('superAdmin') || userRoles?.includes('operator')
  );
  const isUser = Boolean(userRoles?.includes('user')); 
  const isLoayaltyOperator = Boolean(userRoles?.includes('loyaltyOperator'));
  const hasLoyalty = !!useLoyaltiesInfo()?.loyalties?.length;
  const { defaultTheme } = UseThemeConfig();

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
      name: internalMenuData['payment']?.customLabel || 'Pagamento',
      id: 'payment',
      route: PixwayAppRoutes.LOYALTY_PAYMENT,
      icon: <WalletIcon style={{color: textColor, stroke: textColor}} />,
      isVisible: (isLoayaltyOperator || isAdmin) && !isHidden('payment') && hasLoyalty,
    },
    {
      name: internalMenuData['pass']?.customLabel || translate('components>menu>tokenPass'),
      id: 'pass',
      route: PixwayAppRoutes.TOKENPASS,
      icon: <TicketIcon style={{color: textColor, stroke: textColor}} width={17} height={17} />,
      isVisible: pass && isAdmin && !isHidden('pass'),
    },
    {
      name: internalMenuData['dash']?.customLabel || translate('components>menu>dashboard'),
      id: 'dash',
      route: PixwayAppRoutes.LOYALTY_REPORT,
      icon: <DashboardIcon style={{color: textColor, stroke: textColor, fill: textColor}} />,
      isVisible: (isLoayaltyOperator || isAdmin) && !isHidden('dash') && hasLoyalty,
    },
    {
      name: internalMenuData['wallet']?.customLabel || translate('components>menu>wallet'),
      id: 'wallet',
      route: PixwayAppRoutes.WALLET,
      icon: <WalletIcon style={{color: textColor, stroke: textColor}} />,
      isVisible: (isUser || isAdmin) && !isHidden('wallet'),
    },
    {
      name: internalMenuData['affiliates']?.customLabel ||   translate('shared>menu>affiliates'),
      id: 'affiliates',
      route: PixwayAppRoutes.AFFILIATES,
      icon: <NewsIcon width={17} height={17} style={{color: textColor, stroke: textColor}} />,
      isVisible: (isUser || isAdmin) && !isHidden('affiliates') && isShowAffiliates,
    },
    {
      name: internalMenuData['extract']?.customLabel || translate('wallet>page>extract'),
      id: 'extract',
      icon: <ReceiptIcon style={{color: textColor, stroke: textColor, fill: textColor}} width={15} height={15} />,
      route: PixwayAppRoutes.WALLET_RECEIPT,
      isVisible:
        (isUser || isAdmin) && loyaltyWallet && loyaltyWallet.length > 0 && !isHidden('extract'),
    },
    {
      name:  internalMenuData['myOrders']?.customLabel ||
      translate('header>components>defaultTab>myOrders'),
      id: 'myOrders',
      route: PixwayAppRoutes.MY_ORDERS,
      icon: <MyOrdersIcon style={{color: textColor, stroke: textColor}} />,
      isVisible: (isUser || isAdmin) && !isHidden('myOrders'),
    },
    {
      name: internalMenuData['myProfile']?.customLabel ||
      translate('components>menu>myProfile'),
      id: 'myProfile',
      route: PixwayAppRoutes.MY_PROFILE,
      icon: <UserIcon style={{color: textColor, stroke: textColor}} />,
      isVisible: (isUser || isAdmin) && !isHidden('myProfile'),
    },
    {
      name: internalMenuData['integration']?.customLabel ||
      translate('components>menu>integration'),
      id: 'integration',
      route: PixwayAppRoutes.CONNECTION,
      icon: <IntegrationIcon style={{color: textColor, stroke: textColor}} />,
      isVisible: (isUser || isAdmin) && !isHidden('integration'),
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
      name: 'Logout',
      icon: <LogoutIcon style={{color: textColor, stroke: textColor}} />,
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
  }, [isProduction, pass, profile, loyaltyWallet]);

  return tabsToShow;
};

const NavigationMenu = ({
  menuTabs: _menuTabs,
  fontFamily,
  backgroundColor,
  textColor,
}: NavigationLoginLoggedButtonProps) => {
  const defaultTabs = useDefaultMenuTabs(textColor ?? "black");
  const organizedWallets = useGetRightWallet()
  const [translate] = useTranslation();
  const [showValue, setShowValue] = useState(false);
  const router = useRouterConnect();
  const menuTabs = _menuTabs ?? defaultTabs;
  const { mainWallet: wallet } = useUserWallet();
  const { setAuthenticatePaymentModal } = useUserWallet();
  const WithWallet = () => {
    return(organizedWallets &&
      organizedWallets.length > 0 &&
      organizedWallets[0].type == 'loyalty') ||
    (organizedWallets &&
      organizedWallets.length > 0 &&
      parseFloat(organizedWallets[0].balance ?? '0') > 0) ? (
      <div style={{color: textColor}} className="pw-py-[6px] pw-px-2 pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)]">
        <div className="pw-flex">
          <p className="pw-text-[10px] pw-font-[500]">
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
            <CriptoValueComponent fontClass='pw-text-white pw-text-sm' crypto={true} value={organizedWallets[0].balance} code={chainIdToCode(
              organizedWallets[0].chainId,
              organizedWallets[0].currency
            )}  />
            </>
          ) : (
            <p className="pw-font-[700] pw-text-xs">*****</p>
          )}
        </div>
      </div>
    ): null
  };

  return (
    <div className="pw-relative">
      <div
        style={{backgroundColor, color: textColor}}
        className={`pw-absolute pw-mt-[1.68rem] ${organizedWallets.length ? 'pw-right-[-16px]' : ''
          } pw-bg-white pw-w-[160px] pw-rounded-b-[20px] pw-z-30 pw-px-2 pw-py-3 pw-shadow-md`}
      >
        {organizedWallets.length ? <WithWallet /> : null}

        <div className="pw-mt-[10px]">
          {menuTabs.map((menu) => menu.isVisible ? (
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
              <p className="pw-font-[400] pw-text-xs" style={{ fontFamily: (fontFamily ? fontFamily : 'Poppins') + ', sans-serif' }}>
                {menu.name}
              </p>
            </a>
          ):null)}
          {organizedWallets.length && organizedWallets.some((w) => w.type == 'loyalty') ?<WeblockButton
          onClick={() => setAuthenticatePaymentModal?.(true)}
          className="!pw-text-white !pw-py-[5px] !pw-px-[24px] pw-mt-4 pw-w-full"
        >
          Pontuar
        </WeblockButton> : null}
          
        </div>
      </div>
    </div>
  );
};
