/* eslint-disable react/jsx-key */
import {
  ReactNode,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useCopyToClipboard } from 'react-use';

import classNames from 'classnames';
import { format } from 'date-fns/esm';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { usePixwayAuthentication } from '../../../auth/hooks/usePixwayAuthentication';
import useGetPassByUser from '../../../pass/hooks/useGetPassByUser';
import CopyIcon from '../../assets/icons/copyIconOutlined.svg?react';
import CardIcon from '../../assets/icons/creditCardOutlined.svg?react';
import DashboardIcon from '../../assets/icons/dashboard.svg?react';
// import  HelpIcon  from '../../assets/icons/helpCircleOutlined.svg?react';
import DashIcon from '../../assets/icons/dashOutlined.svg?react';
//import  ImageIcon  from '../../assets/icons/imageOutlined.svg?react';
import IntegrationIcon from '../../assets/icons/integrationIconOutlined.svg?react';
// import  HelpIcon  from '../../assets/icons/helpCircleOutlined.svg?react';
import LogoutIcon from '../../assets/icons/logoutOutlined.svg?react';
import MyOrdersIcon from '../../assets/icons/myOrders.svg?react';
import ReceiptIcon from '../../assets/icons/receipt.svg?react';
import TicketIcon from '../../assets/icons/ticketFilled.svg?react';
// import  SettingsIcon  from '../../assets/icons/settingsOutlined.svg?react';
import UserIcon from '../../assets/icons/userOutlined.svg?react';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useProfile } from '../../hooks';
import { useProfileWithKYC } from '../../hooks/useProfileWithKYC/useProfileWithKYC';
import { useRouterConnect } from '../../hooks/useRouterConnect';
import useTranslation from '../../hooks/useTranslation';
import { useUserWallet } from '../../hooks/useUserWallet';
const ImageSDK = lazy(() =>
  import('../ImageSDK').then((module) => ({
    default: module.ImageSDK,
  }))
);
import TranslatableComponent from '../TranslatableComponent';
import { UseThemeConfig } from '../../../storefront/hooks/useThemeConfig/useThemeConfig';

interface MenuProps {
  tabs?: TabsConfig[];
  className?: string;
}

interface TabsConfig {
  title: string;
  id: string;
  icon: ReactNode;
  link: string;
  sub?: boolean;
  isVisible: boolean;
}

const _Menu = ({ tabs, className }: MenuProps) => {
  const { data: profile } = useProfile();
  const router = useRouterConnect();
  const [translate] = useTranslation();
  const [state, copyToClipboard] = useCopyToClipboard();
  const { profile: profileWithKYC } = useProfileWithKYC();
  const [isCopied, setIsCopied] = useState(false);
  const createdAt = new Date((profile?.data.createdAt as string) || 0);
  const { signOut } = usePixwayAuthentication();
  const formatedDate = format(createdAt, 'dd/MM/yyyy');
  const [tabsToShow, setTabsToShow] = useState(tabs);
  const { pass } = useFlags();
  const { data: passData } = useGetPassByUser();
  const { loyaltyWallet } = useUserWallet();
  const hasPassAssociated =
    passData?.data.items !== undefined && passData?.data?.items?.length > 0;

  const userRoles = profile?.data?.roles || [];
  const isAdmin = Boolean(
    userRoles.find(
      (e: string) => e === 'admin' || e === 'superAdmin' || e === 'operator'
    )
  );
  const { defaultTheme } = UseThemeConfig();

  const isUser = Boolean(userRoles.find((e: string) => e === 'user'));

  const isLoayaltyOperator = Boolean(
    userRoles.find((e: string) => e === 'loyaltyOperator')
  );

  const internalMenuData = useMemo(() => {
    return defaultTheme?.configurations.styleData.internalMenu || {};
  }, [defaultTheme?.configurations.styleData.internalMenu]);

  const isHidden = useCallback(
    (id: string) => {
      if (defaultTheme?.configurations.styleData.internalMenu) {
        const hiddenOption = internalMenuData[id]?.hidden;

        let computedRole = 'user';

        if (
          userRoles?.find((e: string) => e === 'admin' || e === 'superAdmin')
        ) {
          computedRole = 'admin';
        } else if (userRoles?.find((e: string) => e === 'operator')) {
          computedRole = 'operator';
        } else if (userRoles?.find((e: string) => e === 'loyaltyOperator')) {
          computedRole = 'loyaltyOperator';
        }

        if (hiddenOption) {
          return hiddenOption[computedRole];
        }
      }
    },
    [defaultTheme, internalMenuData, userRoles]
  );

  useEffect(() => {
    const tabsDefault: TabsConfig[] = [
      {
        title: internalMenuData['payment']?.customLabel || 'Pagamento',
        id: 'payment',
        icon: <CardIcon width={17} height={17} />,
        link: PixwayAppRoutes.LOYALTY_PAYMENT,
        isVisible: (isLoayaltyOperator || isAdmin) && !isHidden('payment'),
      },
      {
        title:
          internalMenuData['pass']?.customLabel ||
          translate('components>menu>tokenPass'),
        id: 'pass',
        icon: <TicketIcon width={17} height={17} />,

        link: PixwayAppRoutes.TOKENPASS,
        isVisible: pass && isAdmin && hasPassAssociated && !isHidden('pass'),
      },
      {
        title:
          internalMenuData['dash']?.customLabel ||
          translate('components>menu>dashboard'),
        id: 'dash',
        icon: <DashboardIcon width={17} height={17} />,
        link: isLoayaltyOperator
          ? PixwayAppRoutes.LOYALTY_REPORT
          : PixwayAppRoutes.DASHBOARD,
        isVisible: isLoayaltyOperator && !isHidden('dash'),
      },
      {
        title:
          internalMenuData['wallet']?.customLabel ||
          translate('components>menu>wallet'),
        id: 'wallet',
        icon: <CardIcon width={17} height={17} />,
        link: PixwayAppRoutes.WALLET,
        isVisible: (isUser || isAdmin) && !isHidden('wallet'),
      },
      {
        title:
          internalMenuData['extract']?.customLabel ||
          translate('wallet>page>extract'),
        id: 'extract',
        icon: (
          <ReceiptIcon className="pw-fill-slate-700" width={15} height={15} />
        ),
        link: PixwayAppRoutes.WALLET_RECEIPT,
        isVisible:
          (isUser || isAdmin) &&
          loyaltyWallet &&
          loyaltyWallet.length > 0 &&
          !isHidden('extract'),
      },
      {
        title:
          internalMenuData['myOrders']?.customLabel ||
          translate('header>components>defaultTab>myOrders'),
        id: 'myOrders',
        link: PixwayAppRoutes.MY_ORDERS,
        icon: <MyOrdersIcon />,
        isVisible: (isUser || isAdmin) && !isHidden('myOrders'),
      },
      {
        title:
          internalMenuData['myProfile']?.customLabel ||
          translate('components>menu>myProfile'),
        id: 'myProfile',
        icon: <UserIcon width={17} height={17} />,
        link: PixwayAppRoutes.PROFILE,
        isVisible: (isUser || isAdmin) && !isHidden('myProfile'),
      },
      {
        title:
          internalMenuData['integration']?.customLabel ||
          translate('components>menu>integration'),
        icon: <IntegrationIcon width={17} height={17} />,
        id: 'integration',
        link: PixwayAppRoutes.CONNECTION,
        isVisible: (isUser || isAdmin) && !isHidden('integration'),
      },
      {
        title:
          internalMenuData['clients']?.customLabel ||
          translate('components>menu>clients'),
        id: 'clients',
        icon: <DashIcon width={17} height={17} />,
        link: PixwayAppRoutes.TOKENS_CLIENTS,
        isVisible: false && !isHidden('clients'),
        sub: true,
      },
    ];

    if (!tabs) setTabsToShow(tabsDefault);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pass,
    profile,
    loyaltyWallet,
    isAdmin,
    hasPassAssociated,
    isLoayaltyOperator,
    defaultTheme,
  ]);

  const handleCopy = () => {
    copyToClipboard(profile?.data.mainWallet?.address as string);
    if (!state.error) setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleSignOut = () => {
    signOut().then(() => {
      router.pushConnect(PixwayAppRoutes.SIGN_IN);
    });
  };

  const RenderTab = (tab: TabsConfig) => {
    const isActive: boolean = router.pathname === tab.link;

    return (
      <a href={router.routerToHref(tab.link)} key={tab.title}>
        <li
          key={tab.title}
          className={classNames(
            'group pw-flex pw-items-center pw-justify-start pw-h-[47px] pw-rounded-[4px] hover:pw-bg-brand-primary hover:pw-bg-opacity-[0.4] pw-text-[#35394C] pw-pl-3 hover:pw-stroke-brand-primary',
            tab.sub ? 'pw-pl-6' : '',
            isActive
              ? 'pw-bg-brand-primary pw-bg-opacity-[0.4] pw-stroke-brand-primary'
              : 'pw-stroke-[#383857]'
          )}
        >
          <span
            className={classNames(
              isActive ? 'pw-opacity-40' : 'group-hover:pw-opacity-40'
            )}
          >
            {tab.icon}
          </span>

          <p className="pw-font-poppins pw-text-lg pw-font-medium pw-ml-5">
            {tab.title}
          </p>
        </li>
      </a>
    );
  };

  return (
    <div
      className={classNames(
        'pw-flex pw-flex-col pw-justify-between pw-bg-white pw-py-7 pw-px-[23px] pw-w-[295px] pw-rounded-[20px] pw-shadow-[2px_2px_10px] pw-shadow-[#00000014]',
        className
      )}
    >
      <div className="pw-w-full">
        <div className="pw-flex pw-flex-col pw-justify-center pw-items-center pw-mb-10">
          <ImageSDK
            className="pw-rounded-full pw-w-[180px] pw-h-[180px] pw-mb-[20px] pw-object-cover"
            height={180}
            width={180}
            fit="fill"
            src={profileWithKYC?.avatarSrc ?? ''}
          />
          <p className="pw-text-center pw-font-poppins pw-text-2xl pw-font-semibold pw-text-[#35394C] pw-mx-auto pw-mb-2 pw-truncate pw-w-full">
            {profile?.data.name}
          </p>

          <div className="pw-flex pw-items-center pw-justify-center ">
            {profile?.data.mainWallet?.address ? (
              <>
                <p className="pw-font-poppins pw-text-sm pw-font-semibold pw-text-[#777E8F] pw-mr-2 pw-mt-[1px]">
                  {profile?.data.mainWallet?.address?.substring(0, 8)}
                  {'...'}
                  {profile?.data.mainWallet?.address?.substring(
                    profile?.data.mainWallet.address.length - 6,
                    profile?.data.mainWallet.address.length
                  )}
                </p>
                <button onClick={handleCopy}>
                  <CopyIcon
                    width={17}
                    height={17}
                    className="pw-stroke-[#777E8F]"
                  />
                </button>
                {isCopied && (
                  <span className="pw-absolute pw-right-3 pw-top-5 pw-bg-[#E6E8EC] pw-py-1 pw-px-2 pw-rounded-md">
                    {translate('components>menu>copied')}
                  </span>
                )}
              </>
            ) : (
              '-'
            )}
          </div>
        </div>

        <ul className="pw-mx-auto pw-w-[248px]">
          {tabsToShow?.map((e) => e.isVisible && RenderTab(e))}
          <button
            onClick={handleSignOut}
            className="group pw-flex pw-items-center pw-justify-start pw-h-[47px] pw-w-full pw-rounded-[4px] hover:pw-bg-brand-primary hover:pw-bg-opacity-[0.4] pw-text-[#35394C] pw-pl-3 pw-stroke-[#383857] hover:pw-stroke-brand-primary"
          >
            <LogoutIcon
              width={17}
              height={17}
              className="group-hover:pw-opacity-40"
            />
            <p className="pw-font-poppins pw-text-lg pw-font-medium pw-ml-5">
              Logout
            </p>
          </button>
        </ul>
      </div>
      <p className="pw-font-nunito pw-text-sm pw-font-normal pw-text-[#35394C] pw-opacity-[0.5] pw-mt-15 pw-mx-auto">
        {translate('components>menu>memberSince')} {formatedDate}
      </p>
    </div>
  );
};

export const Menu = (props: MenuProps) => (
  <TranslatableComponent>
    <_Menu {...props} />
  </TranslatableComponent>
);
