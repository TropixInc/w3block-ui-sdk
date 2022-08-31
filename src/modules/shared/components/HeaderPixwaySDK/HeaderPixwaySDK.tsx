import { ReactNode, useMemo, useState } from 'react';

import {
  NavigationLoginPixwaySDK,
  NavigationTabsPixwaySDK,
  NavigationTabsPixwaySDKTabs,
} from './components';

interface HeaderPixwaySDKProps {
  headerClassName?: string;
  logo?: string | ReactNode;
  logoHeight?: number;
  tabs?: NavigationTabsPixwaySDKTabs[];
  signInRouter?: string;
  signUpRouter?: string;
  openedMenu?: boolean;
  toogleOpenedTabs?: () => void;
}

export const HeaderPixwaySDK = ({
  headerClassName,
  logo,
  logoHeight = 50,
  tabs,
  signInRouter,
  signUpRouter,
  openedMenu,
  toogleOpenedTabs,
}: HeaderPixwaySDKProps) => {
  const [openedTabs, setOpenedTabs] = useState<boolean>(false);
  const LogoToShow = useMemo(() => {
    if (typeof logo === 'string') {
      return (
        <img
          style={{ height: logoHeight + 'px' }}
          src={logo}
          className=" pw-object-contain"
        />
      );
    } else {
      <div style={{ height: logoHeight + 'px' }}>{logo}</div>;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logo]);

  const toggleTabsMemo = () => {
    if (toogleOpenedTabs) {
      toogleOpenedTabs();
    } else setOpenedTabs(!openedTabs);
  };

  return (
    <div
      className={`pw-container pw-mx-auto pw-bg-white ${headerClassName} pw-px-4 sm:pw-px-0`}
    >
      <div className="pw-flex pw-justify-between pw-py-5 pw-items-center">
        {LogoToShow}
        <div className="pw-flex pw-items-center">
          <div className="pw-order-2 sm:pw-order-1">
            <NavigationTabsPixwaySDK
              tabs={tabs}
              toogleMenu={toggleTabsMemo}
              opened={openedMenu ? openedMenu : openedTabs}
            />
          </div>

          <div className="pw-order-1 sm:pw-order-2">
            <NavigationLoginPixwaySDK
              signInRouter={signInRouter}
              signUpRouter={signUpRouter}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
