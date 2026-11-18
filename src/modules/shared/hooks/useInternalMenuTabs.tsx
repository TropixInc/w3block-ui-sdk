/* eslint-disable i18next/no-literal-string */
import { CSSProperties, FC, ReactNode, SVGProps, useMemo } from 'react';

import { UserRoleEnum } from '@w3block/sdk-id';

import CardIcon from '../assets/icons/creditCardOutlined.svg';
import DashboardIcon from '../assets/icons/dashboard.svg';
import DashIcon from '../assets/icons/dashOutlined.svg';
import FormIcon from '../assets/icons/form.svg';
import IntegrationIcon from '../assets/icons/integrationIconOutlined.svg';
import MyOrdersIcon from '../assets/icons/myOrders.svg';
import NewsIcon from '../assets/icons/news.svg';
import NotifyIcon from '../assets/icons/notifyOutlined.svg';
import ReceiptIcon from '../assets/icons/receipt.svg';
import TicketIcon from '../assets/icons/ticketFilled.svg';
import UserIcon from '../assets/icons/userOutlined.svg';
import { useLoyaltiesInfo } from '../../business/hooks/useLoyaltiesInfo';
import { useThemeConfig } from '../../storefront/hooks/useThemeConfig';
import { PixwayAppRoutes } from '../enums/PixwayAppRoutes';
import { sortInternalMenuTabs } from '../utils/internalMenuOrder';
import { useIsHiddenMenuItem } from './useIsHiddenMenuItem';
import { useProfile } from './useProfile';
import useTranslation from './useTranslation';
import { useUserWallet } from './useUserWallet/useUserWallet';

export interface InternalMenuTab {
  id: string;
  title: string;
  icon: ReactNode;
  link: string;
  isVisible: boolean;
  sub?: boolean;
}

export interface InternalMenuIconProps {
  className?: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
}

interface Options {
  /** Props forwarded to every icon (size, color via `style`/`className`). */
  iconProps?: InternalMenuIconProps;
}

/**
 * Single source of truth for the logged-in area menu: items, labels
 * (with the tenant `internalMenu[*].customLabel` override), routes,
 * visibility by role/theme and the fixed display order.
 *
 * Used by the side menu (`Menu`) and by the avatar dropdown in the header
 * (`useDefaultMenuTabs`), so both always agree.
 */
export const useInternalMenuTabs = ({ iconProps }: Options = {}) => {
  const [translate] = useTranslation();
  const { data: profile } = useProfile();
  const { loyaltyWallet } = useUserWallet();
  const { defaultTheme } = useThemeConfig();
  const hasLoyalty = !!useLoyaltiesInfo()?.loyalties?.length;

  const userRoles = useMemo(
    () => (profile?.data?.roles || []) as Array<string>,
    [profile?.data?.roles]
  );
  const isHidden = useIsHiddenMenuItem(userRoles as Array<UserRoleEnum>);

  const isAdmin = userRoles.some(
    (e) => e === 'admin' || e === 'superAdmin' || e === 'operator'
  );
  const isUser = userRoles.includes('user');
  const isLoyaltyOperator = userRoles.includes('loyaltyOperator');
  const isCommerceReceiver = userRoles.includes('commerce.orderReceiver');
  const hasLoyaltyWallet = Boolean(loyaltyWallet && loyaltyWallet.length > 0);

  const internalMenuData = useMemo(
    () => defaultTheme?.configurations?.styleData?.internalMenu || {},
    [defaultTheme?.configurations?.styleData?.internalMenu]
  );
  const isShowAffiliates = Boolean(
    defaultTheme?.configurations?.styleData?.memberGetMember
  );

  const size = { width: 16, height: 16 };
  const icon = (Icon: FC<SVGProps<SVGSVGElement>>, extraClassName = '') => (
    <Icon
      {...size}
      {...iconProps}
      className={[extraClassName, iconProps?.className ?? '']
        .filter(Boolean)
        .join(' ')}
    />
  );
  const label = (id: string, fallback: string) =>
    internalMenuData[id]?.customLabel || fallback;

  return useMemo<InternalMenuTab[]>(() => {
    const tabs: InternalMenuTab[] = [
      {
        id: 'payment',
        title: label('payment', 'Pagamento'),
        icon: icon(CardIcon),
        link: PixwayAppRoutes.LOYALTY_PAYMENT,
        isVisible:
          (isLoyaltyOperator || isAdmin) && !isHidden('payment') && hasLoyalty,
      },
      {
        id: 'pass',
        title: label('pass', translate('components>menu>tokenPass')),
        icon: icon(TicketIcon),
        link: PixwayAppRoutes.TOKENPASS,
        isVisible: isAdmin && !isHidden('pass'),
      },
      {
        id: 'dash',
        title: label('dash', translate('components>menu>dashboard')),
        icon: icon(DashboardIcon),
        link: hasLoyalty
          ? PixwayAppRoutes.LOYALTY_REPORT
          : PixwayAppRoutes.DASHBOARD,
        isVisible:
          (isLoyaltyOperator || isAdmin) && !isHidden('dash') && hasLoyalty,
      },
      {
        id: 'wallet',
        title: label('wallet', translate('components>menu>wallet')),
        icon: icon(CardIcon),
        link: PixwayAppRoutes.WALLET,
        isVisible: (isUser || isAdmin) && !isHidden('wallet'),
      },
      {
        id: 'withdraws',
        title: label('withdraws', translate('components>menu>withdraws')),
        icon: icon(CardIcon),
        link: PixwayAppRoutes.WITHDRAWS,
        isVisible: isHidden('withdraws') === false,
      },
      {
        id: 'withdrawsAdmin',
        title: label(
          'withdrawsAdmin',
          translate('auth>withdrawModal>withdrawReports')
        ),
        icon: icon(CardIcon),
        link: PixwayAppRoutes.WITHDRAWS_ADMIN,
        isVisible: isAdmin && !isHidden('withdrawsAdmin'),
      },
      {
        id: 'affiliates',
        title: label('affiliates', translate('shared>menu>affiliates')),
        icon: icon(NewsIcon),
        link: PixwayAppRoutes.AFFILIATES,
        isVisible:
          (isUser || isAdmin) && !isHidden('affiliates') && isShowAffiliates,
      },
      {
        id: 'extract',
        title: label('extract', translate('wallet>page>extract')),
        icon: icon(ReceiptIcon, 'pw-fill-current'),
        link: PixwayAppRoutes.WALLET_RECEIPT,
        isVisible: (isUser || isAdmin) && hasLoyaltyWallet && !isHidden('extract'),
      },
      {
        id: 'futureStatement',
        title: label('futureStatement', translate('statement>future>menu')),
        icon: icon(ReceiptIcon, 'pw-fill-current'),
        link: PixwayAppRoutes.WALLET_FUTURE,
        isVisible:
          (isCommerceReceiver || isAdmin) &&
          hasLoyaltyWallet &&
          !isHidden('futureStatement'),
      },
      {
        id: 'staking',
        title: label('staking', 'Recompensas'),
        icon: icon(CardIcon),
        link: PixwayAppRoutes.STAKING,
        isVisible: !isHidden('staking') && hasLoyaltyWallet,
      },
      {
        id: 'myOrders',
        title: label(
          'myOrders',
          translate('header>components>defaultTab>myOrders')
        ),
        icon: icon(MyOrdersIcon),
        link: PixwayAppRoutes.MY_ORDERS,
        isVisible: (isUser || isAdmin) && !isHidden('myOrders'),
      },
      {
        id: 'mySales',
        title: label('mySales', translate('pages>mysales>mysales')),
        icon: icon(MyOrdersIcon),
        link: PixwayAppRoutes.MY_SALES,
        isVisible: isHidden('mySales') === false,
      },
      {
        id: 'myProfile',
        title: label('myProfile', translate('components>menu>myProfile')),
        icon: icon(UserIcon),
        link: PixwayAppRoutes.PROFILE,
        isVisible: (isUser || isAdmin) && !isHidden('myProfile'),
      },
      {
        id: 'notifications',
        title: label(
          'notifications',
          translate('notifications>notificationsTemplate>title')
        ),
        icon: icon(NotifyIcon),
        link: PixwayAppRoutes.MY_NOTIFICATIONS,
        isVisible: (isUser || isAdmin) && !isHidden('notifications'),
      },
      {
        id: 'requests',
        title: label('requests', translate('components>menu>requests')),
        icon: icon(FormIcon),
        link: PixwayAppRoutes.REQUESTS,
        isVisible: isHidden('requests') === false,
      },
      {
        id: 'cards',
        title: label('cards', 'Meus cartões'),
        icon: icon(CardIcon),
        link: PixwayAppRoutes.CARDS,
        isVisible: (isUser || isAdmin) && !isHidden('cards'),
      },
      {
        id: 'integration',
        title: label('integration', translate('components>menu>integration')),
        icon: icon(IntegrationIcon),
        link: PixwayAppRoutes.CONNECTION,
        isVisible: (isUser || isAdmin) && !isHidden('integration'),
      },
      {
        id: 'clients',
        title: label('clients', translate('components>menu>clients')),
        icon: icon(DashIcon),
        link: PixwayAppRoutes.TOKENS_CLIENTS,
        isVisible: false && !isHidden('clients'),
        sub: true,
      },
    ];
    return sortInternalMenuTabs(tabs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    profile,
    loyaltyWallet,
    defaultTheme,
    hasLoyalty,
    isAdmin,
    isUser,
    isLoyaltyOperator,
    isCommerceReceiver,
    hasLoyaltyWallet,
    isShowAffiliates,
    internalMenuData,
    iconProps?.style?.color,
    iconProps?.className,
    translate,
  ]);
};
