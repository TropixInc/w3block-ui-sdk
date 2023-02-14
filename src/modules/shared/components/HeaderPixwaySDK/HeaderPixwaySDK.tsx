import { useState } from 'react';

import { Provider } from '@w3block/pixchain-react-metamask';
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
  bgColor?: string;
  textColor?: string;
  hasSignUp?: boolean;
  brandText?: string;
  logoSrc?: string;
  margin?: string;
  padding?: string;
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
  bgColor = 'white',
  textColor = 'black',
  hasSignUp = true,
  brandText = '',
  logoSrc = '',
  margin,
  padding,
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

  const LogoToShow = () => {
    if (logoSrc) {
      return (
        <img
          style={{ height: logoHeight + 'px' }}
          src={logoSrc}
          className="pw-object-contain pw-max-w-[150px]"
        />
      );
    } else if (brandText) {
      return (
        <div
          className="pw-font-poppins pw-text-[16px] pw-font-[600] pw-flex pw-full pw-items-center"
          style={{ color: textColor, height: logoHeight + 'px' }}
        >
          <p>{brandText}</p>
        </div>
      );
    } else {
      return (
        <img
          style={{ height: logoHeight + 'px' }}
          src={logoUrl}
          className="pw-object-contain pw-max-w-[150px]"
        />
      );
    }
  };

  return (
    <div
      style={{ backgroundColor: bgColor, margin, padding }}
      className="w-full pw-shadow-md"
    >
      <div
        style={{ backgroundColor: bgColor }}
        className={classNames(
          'pw-container pw-mx-auto pw-px-4 sm:pw-px-0',
          headerClassName ?? ''
        )}
      >
        <div className="pw-flex pw-justify-between pw-py-5 pw-items-center">
          <a href={PixwayAppRoutes.HOME}>
            <LogoToShow />
          </a>

          <div className="pw-flex pw-items-center">
            <div className="pw-order-2 sm:pw-order-1">
              <NavigationTabsPixwaySDK
                tabs={tabs}
                toogleMenu={toggleTabsMemo}
                opened={openedMenu ? openedMenu : openedTabs}
                hasSignUp={hasSignUp}
                textColor={textColor}
              />
            </div>

            <div className="pw-order-1 sm:pw-order-2">
              <NavigationLoginPixwaySDK
                hasSignUp={hasSignUp}
                textColor={textColor}
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MetamaskProvider = Provider as any;

export const HeaderPixwaySDK = (props: HeaderPixwaySDKProps) => (
  <TranslatableComponent>
    <MetamaskProvider
      dappConfig={{
        autoConnect: true,
      }}
    >
      <AttachWalletProvider>
        <_HeaderPixwaySDK {...props} />
      </AttachWalletProvider>
    </MetamaskProvider>
  </TranslatableComponent>
);
