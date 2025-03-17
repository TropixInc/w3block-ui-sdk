/* eslint-disable i18next/no-literal-string */
/* eslint-disable react/jsx-key */
import { ReactNode, lazy, useEffect, useMemo, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import { UserRoleEnum } from '@w3block/sdk-id';
import classNames from 'classnames';
import { format } from 'date-fns/esm';

import { usePixwayAuthentication } from '../../../auth/hooks/usePixwayAuthentication';
import { useLoyaltiesInfo } from '../../../business/hooks/useLoyaltiesInfo';
import { UseThemeConfig } from '../../../storefront/hooks/useThemeConfig/useThemeConfig';
import CopyIcon from '../../assets/icons/copyIconOutlined.svg?react';
import CardIcon from '../../assets/icons/creditCardOutlined.svg?react';
import DashboardIcon from '../../assets/icons/dashboard.svg?react';
// import  HelpIcon  from '../../assets/icons/helpCircleOutlined.svg?react';
import DashIcon from '../../assets/icons/dashOutlined.svg?react';
//import  ImageIcon  from '../../assets/icons/imageOutlined.svg?react';
import FormIcon from '../../assets/icons/form.svg?react';
import IntegrationIcon from '../../assets/icons/integrationIconOutlined.svg?react';
// import  HelpIcon  from '../../assets/icons/helpCircleOutlined.svg?react';
import LogoutIcon from '../../assets/icons/logoutOutlined.svg?react';
import MyOrdersIcon from '../../assets/icons/myOrders.svg?react';
import NewsIcon from '../../assets/icons/news.svg?react';
import ReceiptIcon from '../../assets/icons/receipt.svg?react';
import TicketIcon from '../../assets/icons/ticketFilled.svg?react';
// import  SettingsIcon  from '../../assets/icons/settingsOutlined.svg?react';
import UserIcon from '../../assets/icons/userOutlined.svg?react';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useProfile } from '../../hooks';
import { useIsHiddenMenuItem } from '../../hooks/useIsHiddenMenuItem/useIsHiddenMenuItem';
import { useProfileWithKYC } from '../../hooks/useProfileWithKYC/useProfileWithKYC';
import { useRouterConnect } from '../../hooks/useRouterConnect';
import useTranslation from '../../hooks/useTranslation';
import { useUserWallet } from '../../hooks/useUserWallet';
import TranslatableComponent from '../TranslatableComponent';

const ImageSDK = lazy(() =>
  import('../ImageSDK').then((module) => ({
    default: module.ImageSDK,
  }))
);
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
  const { loyaltyWallet } = useUserWallet();

  const userRoles = useMemo(() => {
    return profile?.data?.roles || [];
  }, [profile?.data?.roles]);
  const isAdmin = Boolean(
    userRoles.find(
      (e: string) => e === 'admin' || e === 'superAdmin' || e === 'operator'
    )
  );

  const isCommerceReceiver = Boolean(
    userRoles.find((e: string) => e === 'commerce.orderReceiver')
  );

  const isHidden = useIsHiddenMenuItem(userRoles as Array<UserRoleEnum>);

  const { defaultTheme } = UseThemeConfig();

  const isShowAffiliates =
    (defaultTheme &&
      defaultTheme.configurations &&
      defaultTheme?.configurations?.styleData &&
      defaultTheme?.configurations?.styleData?.memberGetMember) ||
    false;

  const isUser = Boolean(userRoles.find((e: string) => e === 'user'));

  const isLoyaltyOperator = Boolean(
    userRoles.find((e: string) => e === 'loyaltyOperator')
  );

  const internalMenuData = useMemo(() => {
    return defaultTheme?.configurations.styleData.internalMenu || {};
  }, [defaultTheme?.configurations.styleData.internalMenu]);

  const hasLoyalty = !!useLoyaltiesInfo()?.loyalties?.length;

  useEffect(() => {
    const tabsDefault: TabsConfig[] = [
      {
        title: internalMenuData['payment']?.customLabel || 'Pagamento',
        id: 'payment',
        icon: <CardIcon width={17} height={17} />,
        link: PixwayAppRoutes.LOYALTY_PAYMENT,
        isVisible:
          (isLoyaltyOperator || isAdmin) && !isHidden('payment') && hasLoyalty,
      },
      {
        title:
          internalMenuData['pass']?.customLabel ||
          translate('components>menu>tokenPass'),
        id: 'pass',
        icon: <TicketIcon width={17} height={17} />,

        link: PixwayAppRoutes.TOKENPASS,
        isVisible: isAdmin && !isHidden('pass'),
      },
      {
        title:
          internalMenuData['dash']?.customLabel ||
          translate('components>menu>dashboard'),
        id: 'dash',
        icon: <DashboardIcon width={17} height={17} />,
        link: hasLoyalty
          ? PixwayAppRoutes.LOYALTY_REPORT
          : PixwayAppRoutes.DASHBOARD,
        isVisible:
          (isLoyaltyOperator || isAdmin) && !isHidden('dash') && hasLoyalty,
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
          internalMenuData['withdraws']?.customLabel ||
          translate('components>menu>withdraws'),
        id: 'withdraws',
        icon: <CardIcon width={17} height={17} />,
        link: PixwayAppRoutes.WITHDRAWS,
        isVisible: isHidden('withdraws') === false,
      },
      {
        title:
          internalMenuData['withdrawsAdmin']?.customLabel ||
          'Relatório de saques',
        id: 'withdrawsAdmin',
        icon: <CardIcon width={17} height={17} />,
        link: PixwayAppRoutes.WITHDRAWS_ADMIN,
        isVisible: isAdmin && !isHidden('withdrawsAdmin'),
      },
      {
        title:
          internalMenuData['affiliates']?.customLabel ||
          translate('shared>menu>affiliates'),
        id: 'affiliates',
        icon: <NewsIcon width={17} height={17} />,
        link: PixwayAppRoutes.AFFILIATES,
        isVisible:
          (isUser || isAdmin) && !isHidden('affiliates') && isShowAffiliates,
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
          internalMenuData['futureStatement']?.customLabel || 'Recebimentos',
        id: 'futureStatement',
        icon: (
          <ReceiptIcon className="pw-fill-slate-700" width={15} height={15} />
        ),
        link: PixwayAppRoutes.WALLET_FUTURE,
        isVisible:
          (isCommerceReceiver || isAdmin) &&
          loyaltyWallet &&
          loyaltyWallet.length > 0 &&
          !isHidden('futureStatement'),
      },
      {
        title: internalMenuData['staking']?.customLabel || 'Recompensas',
        id: 'staking',
        icon: <CardIcon width={17} height={17} />,
        link: PixwayAppRoutes.STAKING,
        isVisible:
          !isHidden('staking') && loyaltyWallet && loyaltyWallet.length > 0,
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
          internalMenuData['requests']?.customLabel ||
          translate('components>menu>requests'),
        id: 'requests',
        icon: <FormIcon width={17} height={17} />,
        link: PixwayAppRoutes.REQUESTS,
        isVisible: isHidden('requests') === false,
      },
      {
        title: internalMenuData['cards']?.customLabel || 'Meus cartões',
        id: 'cards',
        icon: <CardIcon width={17} height={17} />,
        link: PixwayAppRoutes.CARDS,
        isVisible: (isUser || isAdmin) && !isHidden('cards'),
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
  }, [profile, loyaltyWallet, isAdmin, isLoyaltyOperator, defaultTheme]);

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

  const hideWallet =
    defaultTheme?.configurations?.contentData?.hideWalletAddress;

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
            {profile?.data.mainWallet?.address && !hideWallet ? (
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
