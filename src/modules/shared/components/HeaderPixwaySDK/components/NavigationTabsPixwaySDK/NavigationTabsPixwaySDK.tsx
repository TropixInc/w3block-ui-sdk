import { useMemo } from 'react';

import { PixwayAppRoutes } from '../../../../enums/PixwayAppRoutes';
import useTranslation from '../../../../hooks/useTranslation';
import { NavigationTabsPixwaySDKDesktop } from './components/NavigationTabsPixwaySDKDesktop';
import { NavigationTabsPixwaySDKMobile } from './components/NavigationTabsPixwaySDKMobile';

export interface NavigationTabsPixwaySDKProps {
  tabs?: NavigationTabsPixwaySDKTabs[];
  className?: string;
  tabClassName?: string;
  signInRoute?: string;
  signUpRoute?: string;
}

export interface NavigationTabsPixwaySDKTabs {
  name: string;
  router: string;
}

export const NavigationTabsPixwaySDK = ({
  tabs,
  className,
  tabClassName,
  signInRoute,
  signUpRoute,
}: NavigationTabsPixwaySDKProps) => {
  const [translate] = useTranslation();
  const defaultTabs: NavigationTabsPixwaySDKTabs[] = useMemo(() => {
    if (!tabs) {
      return [
        {
          name: translate('shared>components>header>tab>about'),
          router: PixwayAppRoutes.ABOUT,
        },
        {
          name: translate('shared>components>header>tab>teams'),
          router: PixwayAppRoutes.TEAMS,
        },
        {
          name: translate('shared>components>header>tab>marketplace'),
          router: PixwayAppRoutes.MARKETPLACE,
        },
        {
          name: translate('shared>components>header>tab>faq'),
          router: PixwayAppRoutes.FAQ,
        },
      ];
    }
    return tabs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs]);

  return (
    <>
      <div className="pw-hidden sm:pw-block">
        <NavigationTabsPixwaySDKDesktop
          tabs={defaultTabs}
          className={className}
          tabClassName={tabClassName}
        />
      </div>
      <div className="pw-block sm:pw-hidden">
        <NavigationTabsPixwaySDKMobile
          signInRoute={signInRoute}
          signUpRoute={signUpRoute}
          tabs={defaultTabs}
          className={className}
          tabClassName={tabClassName}
        />
      </div>
    </>
  );
};
