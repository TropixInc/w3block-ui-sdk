import { useMemo, useState } from 'react';

import { PixwayAppRoutes } from '../../../../enums/PixwayAppRoutes';
import { usePixwaySession } from '../../../../hooks/usePixwaySession';
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
  textColor?: string;
  hasSignUp?: boolean;
  fontFamily?: string;
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
  textColor = 'black',
  hasSignUp,
  fontFamily,
}: NavigationTabsPixwaySDKProps) => {
  const [translate] = useTranslation();
  const [openedTabs, setOpenedTabs] = useState<boolean>(false);
  const { data: session } = usePixwaySession();
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
          textColor={textColor}
          hasSignUp={hasSignUp}
        />
      </div>
      {session && tabs?.length === 0 ? null : (
        <div
          className="pw-block sm:pw-hidden"
          style={{
            fontFamily:
              (fontFamily ? fontFamily : 'Montserrat') + ', sans-serif',
          }}
        >
          <NavigationTabsPixwaySDKMobile
            opened={opened ? opened : openedTabs}
            toogleMenu={toggleTabsMemo}
            signInRoute={signInRoute}
            signUpRoute={signUpRoute}
            tabs={defaultTabs}
            classNames={classNames}
            textColor={textColor}
            hasSignUp={hasSignUp}
          />
        </div>
      )}
    </>
  );
};
