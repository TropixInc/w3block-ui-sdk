/* eslint-disable i18next/no-literal-string */
import { ReactNode, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import classNames from 'classnames';
import { format } from 'date-fns/esm';

import CopyIcon from '../assets/icons/copyIconOutlined.svg';
import LogoutIcon from '../assets/icons/logoutOutlined.svg';
import { usePixwayAuthentication } from '../../auth/hooks/usePixwayAuthentication';
import { useThemeConfig } from '../../storefront/hooks/useThemeConfig';
import { PixwayAppRoutes } from '../enums/PixwayAppRoutes';
import { useInternalMenuTabs } from '../hooks/useInternalMenuTabs';
import { useProfile } from '../hooks/useProfile';
import { useProfileWithKYC } from '../hooks/useProfileWithKYC';
import { useRouterConnect } from '../hooks/useRouterConnect';
import useTranslation from '../hooks/useTranslation';
import { ImageSDK } from './ImageSDK';
import Skeleton from './Skeleton';
import TranslatableComponent from './TranslatableComponent';

interface MenuProps {
  tabs?: TabsConfig[];
  className?: string;
  /** Called after a navigation link is clicked (used by the mobile drawer). */
  onNavigate?: () => void;
}

export interface TabsConfig {
  title: string;
  id: string;
  icon: ReactNode;
  link: string;
  sub?: boolean;
  isVisible: boolean;
}

export const getInitials = (name?: string | null) => {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : '';
  return (first + last).toUpperCase();
};

export const shortAddress = (address?: string | null) =>
  address ? `${address.substring(0, 6)}…${address.substring(address.length - 4)}` : '';

const _Menu = ({ tabs, className, onNavigate }: MenuProps) => {
  const { data: profile } = useProfile();
  const router = useRouterConnect();
  const [translate] = useTranslation();
  const [state, copyToClipboard] = useCopyToClipboard();
  const { profile: profileWithKYC } = useProfileWithKYC();
  const [isCopied, setIsCopied] = useState(false);
  const { signOut } = usePixwayAuthentication();
  const { defaultTheme } = useThemeConfig();
  const defaultTabs = useInternalMenuTabs();
  const tabsToShow = tabs ?? defaultTabs;

  const createdAt = profile?.data.createdAt
    ? format(new Date(profile.data.createdAt as string), 'dd/MM/yyyy')
    : null;
  const name = profile?.data.name ?? '';
  const email = profile?.data.email ?? '';
  const address = profile?.data?.mainWallet?.address;
  const hideWallet =
    defaultTheme?.configurations?.contentData?.hideWalletAddress;
  const avatarSrc = profileWithKYC?.avatarSrc;
  const isLoading = !profile;

  const handleCopy = () => {
    copyToClipboard(address as string);
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
      <li key={tab.id || tab.title}>
        <a
          href={router.routerToHref(tab.link)}
          onClick={onNavigate}
          aria-current={isActive ? 'page' : undefined}
          className={classNames(
            'pw-flex pw-items-center pw-gap-2 pw-min-h-[38px] pw-px-2 pw-rounded-[7px] pw-border-l-[3px] pw-text-[13px] pw-leading-tight pw-no-underline pw-transition-colors',
            tab.sub ? 'pw-ml-4' : '',
            isActive
              ? 'pw-border-brand-primary pw-bg-[#EAF1FC] pw-text-[#0F1729] pw-font-semibold'
              : 'pw-border-transparent pw-text-[#4A5567] pw-font-medium hover:pw-bg-[#F1F3F6] hover:pw-text-[#0F1729]'
          )}
        >
          <span
            className={classNames(
              'pw-flex pw-shrink-0 pw-items-center pw-justify-center pw-w-4 pw-h-4 pw-stroke-current [&_svg]:pw-w-4 [&_svg]:pw-h-4',
              isActive ? 'pw-opacity-100' : 'pw-opacity-80'
            )}
            aria-hidden
          >
            {tab.icon}
          </span>
          <span className="pw-truncate">{tab.title}</span>
        </a>
      </li>
    );
  };

  return (
    <nav
      className={classNames(
        'pw-flex pw-flex-col pw-bg-white pw-rounded-[10px] pw-shadow-[0_2px_8px_rgba(0,0,0,0.06)] pw-py-[14px] pw-px-[10px] pw-w-full pw-font-poppins',
        className
      )}
      aria-label={translate('components>menu>openMenu')}
    >
      <div className="pw-flex pw-items-center pw-gap-[10px] pw-px-2 pw-pb-3 pw-mb-2 pw-border-b pw-border-[#E6E8EC]">
        {isLoading ? (
          <Skeleton className="pw-w-9 pw-h-9 pw-rounded-full pw-shrink-0" />
        ) : avatarSrc ? (
          <ImageSDK
            className="pw-rounded-full pw-w-9 pw-h-9 pw-object-cover pw-shrink-0"
            height={36}
            width={36}
            fit="fill"
            src={avatarSrc}
          />
        ) : (
          <span
            className="pw-grid pw-place-items-center pw-w-9 pw-h-9 pw-rounded-full pw-bg-brand-primary pw-text-white pw-text-[13px] pw-font-bold pw-shrink-0"
            aria-hidden
          >
            {getInitials(name)}
          </span>
        )}
        <div className="pw-min-w-0 pw-flex-1">
          {isLoading ? (
            <>
              <Skeleton className="pw-h-3 pw-w-24 pw-rounded pw-mb-1.5" />
              <Skeleton className="pw-h-2.5 pw-w-32 pw-rounded" />
            </>
          ) : (
            <>
              <p
                className="pw-text-[13px] pw-font-semibold pw-text-[#0F1729] pw-truncate pw-m-0"
                title={name}
              >
                {name}
              </p>
              {email ? (
                <p
                  className="pw-text-[11px] pw-text-[#6B7280] pw-truncate pw-m-0"
                  title={email}
                >
                  {email}
                </p>
              ) : null}
              {address && !hideWallet ? (
                <div className="pw-relative pw-flex pw-items-center pw-gap-1 pw-mt-0.5">
                  <span className="pw-text-[11px] pw-text-[#777E8F] pw-font-medium pw-tabular-nums">
                    {shortAddress(address)}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="pw-p-0.5 pw-rounded hover:pw-bg-[#F1F3F6]"
                    aria-label={translate('components>menu>copyAddress')}
                  >
                    <CopyIcon
                      width={13}
                      height={13}
                      className="pw-stroke-[#777E8F]"
                    />
                  </button>
                  {isCopied && (
                    <span className="pw-absolute pw-left-0 pw-top-5 pw-bg-[#0F1729] pw-text-white pw-text-[11px] pw-py-0.5 pw-px-2 pw-rounded-md pw-z-10">
                      {translate('components>menu>copied')}
                    </span>
                  )}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      <ul className="pw-flex pw-flex-col pw-gap-0.5 pw-m-0 pw-p-0 pw-list-none">
        {tabsToShow.map((tab) => (tab.isVisible ? RenderTab(tab) : null))}
        <li>
          <button
            type="button"
            onClick={handleSignOut}
            className="pw-flex pw-w-full pw-items-center pw-gap-2 pw-min-h-[38px] pw-px-2 pw-rounded-[7px] pw-border-l-[3px] pw-border-transparent pw-text-[13px] pw-font-medium pw-text-[#4A5567] hover:pw-bg-[#F1F3F6] hover:pw-text-[#0F1729] pw-transition-colors"
          >
            <span
              className="pw-flex pw-shrink-0 pw-items-center pw-justify-center pw-w-4 pw-h-4 pw-stroke-current pw-opacity-80"
              aria-hidden
            >
              <LogoutIcon width={16} height={16} />
            </span>
            <span>{translate('components>menu>logout')}</span>
          </button>
        </li>
      </ul>

      <p className="pw-mt-3 pw-pt-3 pw-px-2 pw-border-t pw-border-[#E6E8EC] pw-text-[11px] pw-text-[#8B93A3] pw-m-0">
        {createdAt ? (
          <>
            {translate('components>menu>memberSince')} {createdAt}
          </>
        ) : (
          <Skeleton className="pw-h-2.5 pw-w-28 pw-rounded" />
        )}
      </p>
    </nav>
  );
};

export const Menu = (props: MenuProps) => (
  <TranslatableComponent>
    <_Menu {...props} />
  </TranslatableComponent>
);
