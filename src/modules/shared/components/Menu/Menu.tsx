/* eslint-disable react/jsx-key */
import { ReactNode, useEffect, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import classNames from 'classnames';
import { format } from 'date-fns/esm';

import { usePixwayAuthentication } from '../../../auth/hooks/usePixwayAuthentication';
import { ReactComponent as CopyIcon } from '../../assets/icons/copyIconOutlined.svg';
import { ReactComponent as CardIcon } from '../../assets/icons/creditCardOutlined.svg';
import { ReactComponent as DashboardIcon } from '../../assets/icons/dashboard.svg';
// import { ReactComponent as HelpIcon } from '../../assets/icons/helpCircleOutlined.svg';
import { ReactComponent as ImageIcon } from '../../assets/icons/imageOutlined.svg';
import { ReactComponent as LogoutIcon } from '../../assets/icons/logoutOutlined.svg';
import { ReactComponent as TicketIcon } from '../../assets/icons/ticketFilled.svg';
// import { ReactComponent as SettingsIcon } from '../../assets/icons/settingsOutlined.svg';
import { ReactComponent as UserIcon } from '../../assets/icons/userOutlined.svg';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useProfile } from '../../hooks';
import { useIsProduction } from '../../hooks/useIsProduction';
import useRouter from '../../hooks/useRouter';
import useTranslation from '../../hooks/useTranslation';
import { Link } from '../Link';
import TranslatableComponent from '../TranslatableComponent';

interface MenuProps {
  tabs?: TabsConfig[];
  className?: string;
}

interface TabsConfig {
  title: string;
  icon: ReactNode;
  link: string;
}

const _Menu = ({ tabs, className }: MenuProps) => {
  const { data: profile } = useProfile();
  const router = useRouter();
  const isProduction = useIsProduction();
  const [translate] = useTranslation();
  const [state, copyToClipboard] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);
  const createdAt = new Date((profile?.data.createdAt as string) || 0);
  const { signOut } = usePixwayAuthentication();
  const formatedDate = format(createdAt, 'dd/MM/yyyy');
  const [tabsToShow, setTabsToShow] = useState(tabs);

  const tabsDefault: TabsConfig[] = [
    {
      title: translate('components>menu>dashboard'),
      icon: <DashboardIcon width={17} height={17} />,
      link: PixwayAppRoutes.DASHBOARD,
    },
    {
      title: translate('components>menu>myProfile'),
      icon: <UserIcon width={17} height={17} />,
      link: PixwayAppRoutes.PROFILE,
    },
    {
      title: translate('components>menu>myTokens'),
      icon: <ImageIcon width={17} height={17} />,
      link: PixwayAppRoutes.TOKENS,
    },
    {
      title: translate('components>menu>wallet'),
      icon: <CardIcon width={17} height={17} />,
      link: PixwayAppRoutes.WALLET,
    },
    // {
    //   title: translate('components>menu>settings'),
    //   icon: <SettingsIcon width={17} height={17} />,
    //   link: PixwayAppRoutes.SETTINGS,
    // },
    // {
    //   title: translate('components>menu>help'),
    //   icon: <HelpIcon width={17} height={17} />,
    //   link: PixwayAppRoutes.HELP,
    // },
  ];

  useEffect(() => {
    if (!tabs)
      if (!isProduction) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setTabsToShow([
          ...tabsDefault,
          {
            title: translate('components>menu>tokenPass'),
            icon: <TicketIcon width={17} height={17} />,
            link: PixwayAppRoutes.TOKENPASS,
          },
        ]);
      } else {
        setTabsToShow(tabsDefault);
      }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = () => {
    copyToClipboard(profile?.data.mainWallet?.address as string);
    if (!state.error) setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleSignOut = () => {
    signOut();
    router.push(PixwayAppRoutes.HOME);
  };

  const RenderTab = (tab: TabsConfig) => {
    const isActive: boolean = router.pathname === tab.link;

    return (
      <Link href={tab.link} key={tab.title}>
        <li
          key={tab.title}
          className={classNames(
            'group pw-flex pw-items-center pw-justify-start pw-h-[47px] pw-rounded-[4px] hover:pw-bg-brand-primary hover:pw-bg-opacity-[0.4] pw-text-[#35394C] pw-pl-3 hover:pw-stroke-brand-primary',
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
      </Link>
    );
  };

  return (
    <div
      className={classNames(
        'pw-flex pw-flex-col pw-justify-between pw-bg-white pw-py-7 pw-px-[23px] pw-w-[295px] pw-max-h-[595px] pw-rounded-[20px] pw-shadow-[2px_2px_10px] pw-shadow-[#00000014]',
        className
      )}
    >
      <div>
        <p className="pw-text-center pw-font-poppins pw-text-2xl pw-font-semibold pw-text-[#35394C] pw-mx-auto pw-mb-2">
          {profile?.data.name}
        </p>
        <div className="pw-flex pw-items-center pw-justify-center pw-mb-10">
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
                <CopyIcon width={17} height={17} />
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
        <ul className="pw-mx-auto pw-w-[248px]">
          {tabsToShow?.map(RenderTab)}
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
