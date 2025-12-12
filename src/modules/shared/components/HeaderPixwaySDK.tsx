import { useContext, useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';
import { NavigationTabsPixwaySDKTabs } from '../interfaces/NavigationTabsPixwaySDKTabs';
import { ThemeContext } from '../../storefront/contexts/ThemeContext';
import { useRouterConnect } from '../hooks/useRouterConnect';
import { useCompanyConfig } from '../hooks/useCompanyConfig';
import { NavigationTabsPixwaySDK } from './NavigationTabsPixwaySDK';
import { PixwayAppRoutes } from '../enums/PixwayAppRoutes';
import { LanguageSelector } from './LanguageSelector';
import { NavigationLoginPixwaySDK } from './NavigationLoginPixwaySDK';
import TranslatableComponent from './TranslatableComponent';
import { AttachWalletProvider } from '../providers/AttachWalletProvider';
import { AppDownloadModal } from './AppDownloadModal';

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
  logoLink?: string;
  standalone?: boolean;
  hasLogIn?: boolean;
  bgSelectionColor?: string;
  textSelectionColor?: string;
  themeData?: any;
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
  logoLink,
  standalone = false,
  hasLogIn = true,
  bgSelectionColor,
  textSelectionColor,
  themeData,
}: HeaderPixwaySDKProps) => {
  const context = useContext(ThemeContext);
  const theme = themeData || context?.defaultTheme;
  const { query } = useRouterConnect();
  const [isOpen, setIsOpen] = useState(false);
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

  const toggleTabsMemo = () => {
    if (openedLogin || openedloginState) {
      toggleMenuMemo();
    }
    if (toogleOpenedTabs) {
      toogleOpenedTabs();
    } else setOpenedTabs(!openedTabs);
  };

  const defaultTabs = theme?.header?.styleData?.tabs;
  const tabsToPass = tabs ? tabs : defaultTabs;

  const LogoToShow = useMemo(() => {
    if (logoSrc || theme?.header?.styleData?.logoSrc?.assetUrl) {
      return (
        <img
          style={{ height: logoHeight + 'px' }}
          src={logoSrc ?? theme?.header?.styleData?.logoSrc?.assetUrl}
          className="pw-object-contain pw-max-w-[150px]"
        />
      );
    } else if (brandText || theme?.header?.styleData?.brandName) {
      return (
        <div
          className="pw-text-[16px] pw-font-[600] pw-flex pw-full pw-items-center"
          style={{ color: textColor, height: logoHeight + 'px' }}
        >
          <p>{brandText ?? theme?.header?.styleData?.brandName}</p>
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
  }, [
    brandText,
    theme?.header?.styleData?.brandName,
    theme?.header?.styleData?.logoSrc?.assetUrl,
    logoHeight,
    logoSrc,
    logoUrl,
    textColor,
  ]);

  const defaultBgColor = theme?.header?.styleData?.backgroundColor;
  const headerBgColor = bgColor ?? defaultBgColor;

  const selectionBgColor =
    bgSelectionColor ?? theme?.header?.styleData?.bgSelectionColor;

  const selectionTextColor =
    textSelectionColor ?? theme?.header?.styleData?.textSelectionColor;
  const lang = theme?.configurations?.contentData?.i18nJson?.locales;

  return theme || standalone ? (
    <div
      id="sf-header"
      style={{
        minHeight: '90px',
        backgroundColor: headerBgColor,
        margin,
        fontFamily:
          (fontFamily || theme?.header?.styleData?.fontFamily
            ? fontFamily ?? theme?.header?.styleData?.fontFamily
            : 'Poppins') + ', sans-serif',
      }}
      className="w-full pw-shadow-md"
    >
      <div
        style={{
          backgroundColor: headerBgColor,
          padding: padding ?? theme?.header?.styleData?.padding,
        }}
        className={classNames(
          'pw-container pw-mx-auto pw-px-4 sm:pw-px-0',
          headerClassName ?? ''
        )}
      >
        <div className="pw-flex pw-justify-between pw-py-5 pw-items-center pw-px-6">
          <div className="pw-flex pw-items-center pw-justify-start pw-gap-x-4 pw-pl-4">
            <div className="sm:pw-hidden">
              <NavigationTabsPixwaySDK
                tabs={tabsToPass}
                toogleMenu={toggleTabsMemo}
                opened={openedMenu ? openedMenu : openedTabs}
                hasSignUp={hasSignUp}
                textColor={textColor ?? theme?.header?.styleData?.textColor}
                bgColor={headerBgColor}
                fontFamily={
                  (fontFamily || theme?.header?.styleData?.fontFamily
                    ? fontFamily ?? theme?.header?.styleData?.fontFamily
                    : 'Poppins') + ', sans-serif'
                }
                hasLogIn={hasLogIn}
                bgSelectionColor={selectionBgColor}
                textSelectionColor={selectionTextColor}
              />
            </div>
            <a
              href={
                logoLink && logoLink.trim() != ''
                  ? logoLink
                  : PixwayAppRoutes.HOME
              }
            >
              {LogoToShow}
            </a>
          </div>
          <div className="pw-flex pw-items-center">
            <div className="pw-order-1 sm:pw-order-1 pw-hidden sm:pw-block">
              <NavigationTabsPixwaySDK
                tabs={tabsToPass}
                toogleMenu={toggleTabsMemo}
                opened={openedMenu ? openedMenu : openedTabs}
                hasSignUp={hasSignUp}
                textColor={textColor ?? theme?.header?.styleData?.textColor}
                bgColor={headerBgColor}
                fontFamily={
                  (fontFamily || theme?.header?.styleData?.fontFamily
                    ? fontFamily ?? theme?.header?.styleData?.fontFamily
                    : 'Poppins') + ', sans-serif'
                }
                hasLogIn={hasLogIn}
                bgSelectionColor={bgSelectionColor}
                textSelectionColor={textSelectionColor}
              />
            </div>
            {/* {hasCart && (
              <CartButton
                iconColor={
                  textColor ??
                  context?.defaultTheme?.header?.styleData?.textColor
                }
                borderColor={
                  textColor ??
                  context?.defaultTheme?.header?.styleData?.textColor
                }
                className="sm:pw-border-l sm:pw-ml-4"
              />
            )} */}
            {lang?.length > 1 ? (
              <div
                style={{ backgroundColor: bgColor }}
                className="pw-flex pw-items-center pw-gap-2 pw-ml-1 sm:pw-border-l sm:pw-ml-4 pw-order-3 sm:pw-order-3 pw-cursor-pointer"
              >
                <LanguageSelector
                  bgColor={bgColor ?? ''}
                  textColor={textColor}
                  fontFamily={fontFamily ?? ''}
                />
              </div>
            ) : null}
            {hasLogIn && (
              <div className="pw-order-4 sm:pw-order-4 sm:pw-border-l sm:pw-ml-3">
                <NavigationLoginPixwaySDK
                  backgroundColor={headerBgColor}
                  hasSignUp={hasSignUp}
                  textColor={textColor ?? theme?.header?.styleData?.textColor}
                  signInRouter={signInRouter}
                  signUpRouter={signUpRouter}
                  fontFamily={
                    (fontFamily || theme?.header?.styleData?.fontFamily
                      ? fontFamily ?? theme?.header?.styleData?.fontFamily
                      : 'Poppins') + ', sans-serif'
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <AppDownloadModal
        isOpen={
          (query?.utm_campaign === 'm2m' || query?.download === 'true') &&
          theme?.configurations?.contentData?.appDownload
            ? true
            : isOpen
        }
        onClose={() => setIsOpen(false)}
        themeData={themeData}
      />
    </div>
  ) : null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HeaderPixwaySDK = (props: HeaderPixwaySDKProps) => (
  <TranslatableComponent>
    <AttachWalletProvider>
      <_HeaderPixwaySDK {...props} />
    </AttachWalletProvider>
  </TranslatableComponent>
);
