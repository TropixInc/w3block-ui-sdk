import { useState } from 'react';

import classNames from 'classnames';

import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../hooks/useCompanyConfig';
import { AttachWalletProvider } from '../../providers/AttachWalletProvider/AttachWalletProvider';
import TranslatableComponent from '../TranslatableComponent';
import {
  NavigationLoginPixwaySDK,
  NavigationTabsPixwaySDK,
  NavigationTabsPixwaySDKTabs,
} from './components';

interface HeaderPixwaySDKProps {
  headerClassName?: string;
  logoHeight?: number;
  tabs?: NavigationTabsPixwaySDKTabs[];
  signInRouter?: string;
  signUpRouter?: string;
  openedMenu?: boolean;
  toogleOpenedTabs?: () => void;
  openedLogin?: boolean;
  toggleOpenedLogin?: () => void;
}

const _HeaderPixwaySDK = ({
  headerClassName,
  logoHeight = 50,
  tabs,
  signInRouter,
  signUpRouter,
  openedMenu,
  toogleOpenedTabs,
  openedLogin,
  toggleOpenedLogin,
}: HeaderPixwaySDKProps) => {
  const [openedTabs, setOpenedTabs] = useState<boolean>(false);
  const [openedloginState, setopenedLoginState] = useState<boolean>(false);
  const { logoUrl } = useCompanyConfig();
  const toggleMenuMemo = () => {
    if (openedMenu || openedTabs) {
      toggleTabsMemo();
    }
    if (toggleOpenedLogin) {
      toggleOpenedLogin();
    } else setopenedLoginState(!openedloginState);
  };

  const validatorMenuOpened = openedLogin ? openedLogin : openedloginState;

  const toggleTabsMemo = () => {
    if (openedLogin || openedloginState) {
      toggleMenuMemo();
    }
    if (toogleOpenedTabs) {
      toogleOpenedTabs();
    } else setOpenedTabs(!openedTabs);
  };

  return (
    <div className="w-full bg-white pw-shadow-md">
      <div
        className={classNames(
          'pw-container pw-mx-auto pw-bg-white pw-px-4 sm:pw-px-0',
          headerClassName ?? ''
        )}
      >
        <div className="pw-flex pw-justify-between pw-py-5 pw-items-center">
          <a href={PixwayAppRoutes.HOME}>
            <img
              style={{ height: logoHeight + 'px' }}
              src={logoUrl}
              className=" pw-object-contain pw-max-w-[150px]"
            />
          </a>

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
                toggleLoginMenu={toggleMenuMemo}
                loginMenu={validatorMenuOpened}
                signInRouter={signInRouter}
                signUpRouter={signUpRouter}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HeaderPixwaySDK = (props: HeaderPixwaySDKProps) => (
  <TranslatableComponent>
    <AttachWalletProvider>
      <_HeaderPixwaySDK {...props} />
    </AttachWalletProvider>
  </TranslatableComponent>
);
