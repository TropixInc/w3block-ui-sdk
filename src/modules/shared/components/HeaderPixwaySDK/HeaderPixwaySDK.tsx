import { useContext, useState } from 'react';

import { Provider } from '@w3block/pixchain-react-metamask';
import classNames from 'classnames';

import { ThemeContext, ThemeProvider } from '../../../storefront/contexts';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../hooks/useCompanyConfig';
import { AttachWalletProvider } from '../../providers/AttachWalletProvider/AttachWalletProvider';
import { CartButton } from '../CartButton/CartButton';
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
  fontFamily?: string;
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
  fontFamily,
}: HeaderPixwaySDKProps) => {
  const context = useContext(ThemeContext);
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

  const tabsToPass = context?.defaultTheme?.header?.styleData?.tabs
    ? context?.defaultTheme?.header?.styleData?.tabs?.map((l: any) => ({
        name: l.label,
        router: l.value,
      }))
    : tabs;

  const LogoToShow = () => {
    if (
      context?.defaultTheme?.header?.styleData?.logoSrc?.assetUrl ||
      logoSrc
    ) {
      return (
        <img
          style={{ height: logoHeight + 'px' }}
          src={
            context?.defaultTheme?.header?.styleData?.logoSrc?.assetUrl ??
            logoSrc
          }
          className="pw-object-contain pw-max-w-[150px]"
        />
      );
    } else if (
      brandText ||
      context?.defaultTheme?.header?.styleData?.brandName
    ) {
      return (
        <div
          className="pw-text-[16px] pw-font-[600] pw-flex pw-full pw-items-center"
          style={{ color: textColor, height: logoHeight + 'px' }}
        >
          <p>
            {context?.defaultTheme?.header?.styleData?.brandName ?? brandText}
          </p>
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

  return context?.isThemeError || context?.isThemeSuccess ? (
    <div
      style={{
        backgroundColor:
          context?.defaultTheme?.header?.styleData?.backgroundColor ?? bgColor,
        margin,
        fontFamily:
          (fontFamily || context?.defaultTheme?.header?.styleData?.fontFamily
            ? context?.defaultTheme?.header?.styleData?.fontFamily ?? fontFamily
            : 'Poppins') + ', sans-serif',
      }}
      className="w-full pw-shadow-md"
    >
      <div
        style={{
          backgroundColor:
            context?.defaultTheme?.header?.styleData?.backgroundColor ??
            bgColor,
          padding: context?.defaultTheme?.header?.styleData?.padding ?? padding,
        }}
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
            <div className="pw-order-3 sm:pw-order-1">
              <NavigationTabsPixwaySDK
                tabs={tabsToPass}
                toogleMenu={toggleTabsMemo}
                opened={openedMenu ? openedMenu : openedTabs}
                hasSignUp={hasSignUp}
                textColor={
                  context?.defaultTheme?.header?.styleData?.textColor ??
                  textColor
                }
                fontFamily={
                  (fontFamily ||
                  context?.defaultTheme?.header?.styleData?.fontFamily
                    ? context?.defaultTheme?.header?.styleData?.fontFamily ??
                      fontFamily
                    : 'Poppins') + ', sans-serif'
                }
              />
            </div>
            <CartButton
              iconColor={
                context?.defaultTheme?.header?.styleData?.textColor ?? textColor
              }
              borderColor={
                context?.defaultTheme?.header?.styleData?.textColor ?? textColor
              }
              className="pw-border-x pw-ml-[40px]"
            />
            <div className="pw-order-1 sm:pw-order-3">
              <NavigationLoginPixwaySDK
                hasSignUp={hasSignUp}
                textColor={
                  context?.defaultTheme?.header?.styleData?.textColor ??
                  textColor
                }
                toggleLoginMenu={toggleMenuMemo}
                loginMenu={validatorMenuOpened}
                signInRouter={signInRouter}
                signUpRouter={signUpRouter}
                fontFamily={
                  (fontFamily ||
                  context?.defaultTheme?.header?.styleData?.fontFamily
                    ? context?.defaultTheme?.header?.styleData?.fontFamily ??
                      fontFamily
                    : 'Poppins') + ', sans-serif'
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
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
      <ThemeProvider>
        <AttachWalletProvider>
          <_HeaderPixwaySDK {...props} />
        </AttachWalletProvider>
      </ThemeProvider>
    </MetamaskProvider>
  </TranslatableComponent>
);
