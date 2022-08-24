import { useMemo } from 'react';

import { PixwayAppRoutes } from '../../../../enums/PixwayAppRoutes';
import useTranslation from '../../../../hooks/useTranslation';

interface NavigationTabsPixwaySDKProps {
  tabs?: NavigationTabsPixwaySDKTabs[];
  className?: string;
  tabClassName?: string;
}

export interface NavigationTabsPixwaySDKTabs {
  name: string;
  router: string;
}

export const NavigationTabsPixwaySDK = ({
  tabs,
  className,
  tabClassName,
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
    <div className={`pw-flex pw-gap-x-[24px] ${className}`}>
      {defaultTabs.map((tab) => (
        <a
          className={`pw-font-poppins pw-text-[14px] pw-font-[600] ${tabClassName}`}
          key={tab.name}
          href={tab.router}
        >
          {tab.name}
        </a>
      ))}
    </div>
  );
};
