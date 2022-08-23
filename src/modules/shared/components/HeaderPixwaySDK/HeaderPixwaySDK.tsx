import { ReactNode, useMemo } from 'react';

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
}

export const HeaderPixwaySDK = ({
  headerClassName,
  logo,
  logoHeight = 50,
  tabs,
}: HeaderPixwaySDKProps) => {
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
  return (
    <div className={`pw-container pw-mx-auto pw-bg-white ${headerClassName}`}>
      <div className="pw-flex pw-justify-between pw-py-5 pw-items-center">
        {LogoToShow}
        <div className="pw-flex">
          <NavigationTabsPixwaySDK tabs={tabs} />
          <NavigationLoginPixwaySDK />
        </div>
      </div>
    </div>
  );
};
