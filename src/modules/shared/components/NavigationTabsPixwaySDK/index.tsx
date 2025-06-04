import { useMemo, useState } from 'react';
import useTranslation from '../../hooks/useTranslation';

import { usePixwaySession } from '../../hooks/usePixwaySession';

import { NavigationTabsPixwaySDKDesktop } from './components/NavigationTabsPixwaySDKDesktop';
import { NavigationTabsPixwaySDKMobile } from './components/NavigationTabsPixwaySDKMobile';
import { NavigationTabsPixwaySDKProps, NavigationTabsPixwaySDKTabs } from '../../interfaces/NavigationTabsPixwaySDKTabs';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';




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
  bgColor,
  hasLogIn = true,
  bgSelectionColor,
  textSelectionColor,
}: NavigationTabsPixwaySDKProps) => {
  const [translate] = useTranslation();
  const [openedTabs, setOpenedTabs] = useState<boolean>(false);
  const { data: session } = usePixwaySession();

  
  const defaultTabs: NavigationTabsPixwaySDKTabs[] = useMemo(() => {
    if (!tabs) {
      return [
        {
          name: translate('shared>components>header>tab>about') as string,
          router: PixwayAppRoutes.ABOUT,
        },
        {
          name: translate('shared>components>header>tab>teams') as string,
          router: PixwayAppRoutes.TEAMS,
        },
        {
          name: translate('shared>components>header>tab>marketplace') as string,
          router: PixwayAppRoutes.MARKETPLACE,
        },
        {
          name: translate('shared>components>header>tab>faq') as string,
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
          bgColor={bgColor}
          bgSelectionColor={bgSelectionColor}
          textSelectionColor={textSelectionColor}
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
            bgColor={bgColor}
            hasLogIn={hasLogIn}
            bgSelectionColor={bgSelectionColor}
            textSelectionColor={textSelectionColor}
          />
        </div>
      )}
    </>
  );
};
