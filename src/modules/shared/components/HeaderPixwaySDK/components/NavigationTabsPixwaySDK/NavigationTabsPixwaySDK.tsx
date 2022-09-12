import { useMemo, useState } from 'react';

import { PixwayAppRoutes } from '../../../../enums/PixwayAppRoutes';
import useTranslation from '../../../../hooks/useTranslation';
import { NavigationTabsPixwaySDKDesktop } from './components/NavigationTabsPixwaySDKDesktop';
import { NavigationTabsPixwaySDKMobile } from './components/NavigationTabsPixwaySDKMobile';

export interface NavigationTabsPixwaySDKProps {
  tabs?: NavigationTabsPixwaySDKTabs[];
  classNames?: NavigationTabsClassNames;
  signInRoute?: string;
  signUpRoute?: string;
  opened?: boolean;
  toogleMenu?: () => void;
}

interface NavigationTabsClassNames {
  className?: string;
  tabClassName?: string;
}

export interface NavigationTabsPixwaySDKTabs {
  name: string;
  router: string;
}

export const NavigationTabsPixwaySDK = ({
  tabs,
  classNames,
  signInRoute,
  signUpRoute,
  toogleMenu,
  opened,
}: NavigationTabsPixwaySDKProps) => {
  const [translate] = useTranslation();
  const [openedTabs, setOpenedTabs] = useState<boolean>(false);
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

  const toggleTabsMemo = () => {
    if (toogleMenu) {
      toogleMenu();
    } else setOpenedTabs(!openedTabs);
  };

  return (
    <>
      <div className="pw-hidden sm:pw-block">
        <NavigationTabsPixwaySDKDesktop
          tabs={defaultTabs}
          classNames={classNames}
        />
      </div>
      <div className="pw-block sm:pw-hidden">
        <NavigationTabsPixwaySDKMobile
          opened={opened ? opened : openedTabs}
          toogleMenu={toggleTabsMemo}
          signInRoute={signInRoute}
          signUpRoute={signUpRoute}
          tabs={defaultTabs}
          classNames={classNames}
        />
      </div>
    </>
  );
};
