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
  hasCart?: boolean;
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
  bgColor,
  textColor = 'black',
  hasSignUp = true,
  brandText = '',
  logoSrc = '',
  margin,
  padding,
  fontFamily,
  hasCart = true,
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

  const defaultTabs = tabs || context?.defaultTheme?.header?.styleData?.tabs;
  const tabsToPass = defaultTabs?.map(mapOptionsToTabs);

  const LogoToShow = () => {
    if (
      logoSrc ||
      context?.defaultTheme?.header?.styleData?.logoSrc?.assetUrl
    ) {
      return (
        <img
          style={{ height: logoHeight + 'px' }}
          src={
            logoSrc ??
            context?.defaultTheme?.header?.styleData?.logoSrc?.assetUrl
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
            {brandText ?? context?.defaultTheme?.header?.styleData?.brandName}
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

  const defaultBgColor =
    context?.defaultTheme?.header?.styleData?.backgroundColor;
  const headerBgColor = bgColor ?? defaultBgColor;

  return context?.isThemeError || context?.isThemeSuccess ? (
    <div
      style={{
        backgroundColor: headerBgColor,
        margin,
        fontFamily:
          (fontFamily || context?.defaultTheme?.header?.styleData?.fontFamily
            ? fontFamily ?? context?.defaultTheme?.header?.styleData?.fontFamily
            : 'Poppins') + ', sans-serif',
      }}
      className="w-full pw-shadow-md"
    >
      <div
        style={{
          backgroundColor: headerBgColor,
          padding: padding ?? context?.defaultTheme?.header?.styleData?.padding,
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
                  textColor ??
                  context?.defaultTheme?.header?.styleData?.textColor
                }
                bgColor={headerBgColor}
                fontFamily={
                  (fontFamily ||
                  context?.defaultTheme?.header?.styleData?.fontFamily
                    ? fontFamily ??
                      context?.defaultTheme?.header?.styleData?.fontFamily
                    : 'Poppins') + ', sans-serif'
                }
              />
            </div>
            {hasCart && (
              <CartButton
                iconColor={
                  textColor ??
                  context?.defaultTheme?.header?.styleData?.textColor
                }
                borderColor={
                  textColor ??
                  context?.defaultTheme?.header?.styleData?.textColor
                }
                className="pw-border-x pw-ml-[40px] pw-mr-4"
              />
            )}

            <div className="pw-order-1 sm:pw-order-3">
              <NavigationLoginPixwaySDK
                hasSignUp={hasSignUp}
                textColor={
                  textColor ??
                  context?.defaultTheme?.header?.styleData?.textColor
                }
                toggleLoginMenu={toggleMenuMemo}
                loginMenu={validatorMenuOpened}
                signInRouter={signInRouter}
                signUpRouter={signUpRouter}
                fontFamily={
                  (fontFamily ||
                  context?.defaultTheme?.header?.styleData?.fontFamily
                    ? fontFamily ??
                      context?.defaultTheme?.header?.styleData?.fontFamily
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

const mapOptionsToTabs = (item: any): NavigationTabsPixwaySDKTabs => {
  if (item.value) return { name: item.label, router: item.value };

  return {
    name: item.label,
    tabs: item.tabs.map((t: any) => ({ name: t.label, router: t.value })),
  };
};
