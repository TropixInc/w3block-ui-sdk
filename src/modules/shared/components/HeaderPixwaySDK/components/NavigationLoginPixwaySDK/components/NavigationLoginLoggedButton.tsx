/* eslint-disable prettier/prettier */
import {
  ReactNode,
  useContext, useEffect, useRef,
  useState,
} from 'react';
import { useClickAway } from 'react-use';

import { ChainId, WalletTypes } from '@w3block/sdk-id';
import { useFlags } from 'launchdarkly-react-client-sdk';


import { usePixwayAuthentication } from '../../../../../../auth/hooks/usePixwayAuthentication';
import useGetPassByUser from '../../../../../../pass/hooks/useGetPassByUser';
import { ReactComponent as ArrowDown } from '../../../../../assets/icons/arrowDown.svg';
import { ReactComponent as ETHIcon } from '../../../../../assets/icons/Eth.svg';
import { ReactComponent as EyeIcon } from '../../../../../assets/icons/eyeGold.svg';
// import { ReactComponent as HelpIcon } from '../../../../../assets/icons/helpIconGray.svg';
import { ReactComponent as IntegrationIcon } from '../../../../../assets/icons/integrationIconOutlined.svg';
import { ReactComponent as LogoutIcon } from '../../../../../assets/icons/logoutIconGray.svg';
import { ReactComponent as MaticIcon } from '../../../../../assets/icons/maticFilled.svg';
import { ReactComponent as MyOrdersIcon } from "../../../../../assets/icons/myOrders.svg"
//import { ReactComponent as MyTokenIcon } from '../../../../../assets/icons/myTokensIconGray.svg';
// import { ReactComponent as SettingsIcon } from '../../../../../assets/icons/settingsIconGray.svg';
import { ReactComponent as TicketIcon } from '../../../../../assets/icons/ticketFilled.svg';
import { ReactComponent as UserIcon } from '../../../../../assets/icons/userIconGray.svg';
import { ReactComponent as WalletIcon } from '../../../../../assets/icons/walletIconGray.svg';
import { PixwayAppRoutes } from '../../../../../enums/PixwayAppRoutes';
import { useProfile } from '../../../../../hooks';
import { useIsProduction } from '../../../../../hooks/useIsProduction';
import { useRouterConnect } from '../../../../../hooks/useRouterConnect';
import useTranslation from '../../../../../hooks/useTranslation';
import { useUserWallet } from '../../../../../hooks/useUserWallet';
import { AttachWalletContext } from '../../../../../providers/AttachWalletProvider/AttachWalletProvider';
import { PixwayButton } from '../../../../PixwayButton';
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
  const ref = useRef(null);
  useClickAway(ref, () => {
    if (menu) setMenu(false);
  });
  const { data: profile } = useProfile();
  //const { wallet } = useUserWallet();

  return (
    <div className="pw-ml-5" ref={ref}>
      <div onClick={() => setMenu(!menu)} className="pw-cursor-pointer">
        {/* <p style={{ color: textColor }} className="pw-text-xs pw-font-[400]">
          {wallet?.type === WalletTypes.Vault
            ? translate('header>logged>hiWallet', { name: profile?.data?.name })
            : translate('header>logged>metamaskHiWallet', {
              name: profile?.data?.name,
            })}
        </p> */}
        <div className="pw-flex pw-items-center">
          <p style={{ color: textColor }} className="pw-text-sm pw-font-[600] pw-w-[165px] pw-truncate pw-overflow-hidden pw-text-right">
            {profile?.data?.email || '-'}
          </p>
          <ArrowDown style={{ stroke: textColor }} className="pw-ml-1" />
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
  const { data: passData } = useGetPassByUser();
  const hasPassAssociated = passData?.data.items !== undefined && passData?.data?.items?.length > 0;

  const { data: profile } = useProfile();
  const userRoles = profile?.data.roles || [];
  const isAdmin = Boolean(
    userRoles?.includes('admin') || userRoles?.includes('superAdmin') || userRoles?.includes('operator')
  );
  const isUser = Boolean(userRoles?.includes('user')); 
  const isLoayaltyOperator = Boolean(userRoles?.includes('loyaltyOperator'));

  const items: NavigationMenuTabs[] = [
    {
      name: "Dashboard",
      route: PixwayAppRoutes.LOYALTY_REPORT,
      icon: <MyOrdersIcon style={{color: textColor, stroke: textColor}} />,
      isVisible: isLoayaltyOperator,
    },
    {
      name: "Pagamento",
      route: PixwayAppRoutes.LOYALTY_PAYMENT,
      icon: <WalletIcon style={{color: textColor, stroke: textColor}} />,
      isVisible: isLoayaltyOperator,
    },
    {
      name: translate('header>components>defaultTab>myAccount'),
      route: PixwayAppRoutes.MY_PROFILE,
      icon: <UserIcon style={{color: textColor, stroke: textColor}} />,
      isVisible: isUser || isAdmin,
    },
    {
      name: translate('header>components>defaultTab>wallet'),
      route: PixwayAppRoutes.WALLET,
      icon: <WalletIcon style={{color: textColor, stroke: textColor}} />,
      isVisible: isUser || isAdmin,
    },
    {
      name: translate('header>components>defaultTab>myOrders'),
      route: PixwayAppRoutes.MY_ORDERS,
      icon: <MyOrdersIcon style={{color: textColor, stroke: textColor}} />,
      isVisible: isUser || isAdmin,
    },
    {
      name: translate('header>components>defaultTab>tokenPass'),
      route: PixwayAppRoutes.TOKENPASS,
      icon: <TicketIcon style={{color: textColor, stroke: textColor}} width={17} height={17} />,
      isVisible: pass && isAdmin && hasPassAssociated,
    },
    {
      name: translate('components>menu>integration'),
      route: PixwayAppRoutes.CONNECTION,
      icon: <IntegrationIcon style={{color: textColor, stroke: textColor}} />,
      isVisible: isUser || isAdmin,
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
  }, [isProduction, pass]);

  return tabsToShow;
};

const NavigationMenu = ({
  menuTabs: _menuTabs,
  fontFamily,
  backgroundColor,
  textColor,
}: NavigationLoginLoggedButtonProps) => {
  const defaultTabs = useDefaultMenuTabs(textColor ?? "black");
  const { setAttachModal } = useContext(AttachWalletContext);
  const [translate] = useTranslation();
  const [showValue, setShowValue] = useState(false);
  const router = useRouterConnect();
  const menuTabs = _menuTabs ?? defaultTabs;
  const { data: profile } = useProfile();
  const { mainWallet: wallet } = useUserWallet();

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
              {renderIcon()}
              <p className="pw-font-[700] pw-text-xs pw-ml-1">
                {parseFloat(wallet?.balance ?? '').toFixed(2)}
              </p>
            </>
          ) : (
            <p className="pw-font-[700] pw-text-xs">*****</p>
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
        style={{backgroundColor, color: textColor}}
        className={`pw-absolute pw-mt-[1.68rem] ${hasMainWallet ? 'pw-ml-[50px]' : ''
          } pw-bg-white pw-w-[160px] pw-rounded-b-[20px] pw-z-30 pw-px-2 pw-py-3 pw-shadow-md`}
      >
        {hasMainWallet ? <WithWallet /> : <WithoutWallet />}

        <div className="pw-mt-[10px]">
          {menuTabs.map((menu) => menu.isVisible && (
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
          ))}
        </div>
      </div>
    </div>
  );
};
