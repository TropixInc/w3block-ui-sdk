/* eslint-disable i18next/no-literal-string */
import { useRef, useState } from 'react';
import { useClickAway, useCopyToClipboard } from 'react-use';


import { NavigationMenuTabs } from '../interfaces/menu';
import { useDefaultMenuTabs } from './NavigationLoginLoggedButton';

import { useTranslation } from 'react-i18next';
import { useRouterConnect } from '../../../hooks/useRouterConnect';

import { usePixwaySession } from '../../../hooks/usePixwaySession';
import { useGetRightWallet } from '../../../utils/getRightWallet';

import { BaseButton } from '../../Buttons';
import { PixwayButton } from '../../PixwayButton';

import UserSimpleIcon from '../../../assets/icons/user.svg'
import ArrowDown from '../../../assets/icons/arrowDown.svg'
import CopyIcon from "../../../assets/icons/copyIcon.svg"
import { useUserWallet } from '../../../hooks/useUserWallet/useUserWallet';
import { useProfileWithKYC } from '../../../hooks/useProfileWithKYC';
import { useThemeConfig } from '../../../../storefront/hooks/useThemeConfig';
import { PixwayAppRoutes } from '../../../enums/PixwayAppRoutes';

// const PixwayButton = lazy(() =>
//   import('../../../../PixwayButton/PixwayButton').then((mod) => ({
//     default: mod.PixwayButton,
//   }))
// );
// const WeblockButton = lazy(() =>
//   import('../../../../WeblockButton/WeblockButton').then((mod) => ({
//     default: mod.WeblockButton,
//   }))
// );

interface NavigationLoginLoggedButtonMobileProps {
  menuOpened?: boolean;
  toggleMenu?: () => void;
  menuTabs?: NavigationMenuTabs[];
  backgroundColor?: string;
  textColor?: string;
  hasSignUp?: boolean;
}

export const NavigationLoginLoggedButtonMobile = ({
  menuOpened,
  toggleMenu,
  menuTabs: _menuTabs,
  backgroundColor,
  textColor,
  hasSignUp,
}: NavigationLoginLoggedButtonMobileProps) => {
  // const { setAttachModal } = useContext(AttachWalletContext);
  const [loginMenu, setLoginMenu] = useState<boolean>(false);
  const { setAuthenticatePaymentModal } = useUserWallet();
  const defaultTabs = useDefaultMenuTabs(textColor ?? 'black');
  // const [hideBalance, setHideBalance] = useState(true);
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const { profile } = useProfileWithKYC();
  // const { mainWallet: wallet } = useUserWallet();
  const [userMenu, setUserMenu] = useState<boolean>(false);
  const { data: session } = usePixwaySession();
  const toggleTabsMemo = () => {
    if (toggleMenu) {
      toggleMenu();
    } else setUserMenu(!userMenu);
  };
  const divRef = useRef<HTMLDivElement>(null);
  useClickAway(divRef, () => {
    setLoginMenu(false);
  });

  const [copied, setCopied] = useState<boolean>(false);
  const [_, setCopy] = useCopyToClipboard();
  const copyAddress = (address: string) => {
    setCopied(true);
    setCopy(address || '');
    setTimeout(() => setCopied(false), 5000);
  };
  const menuTabs = _menuTabs ?? defaultTabs;
  const validatorOpened = menuOpened ? menuOpened : userMenu;

  const organizedWallets = useGetRightWallet();

  // const WithWallet = () => {
  //   return (
  //     <div className="pw-mt-3 pw-px-[20px] pw-py-4 pw-shadow-[1px_1px_10px_rgba(0,0,0,0.2)] pw-bg-white pw-rounded-2xl pw-w-full pw-flex">
  //       <div className="pw-flex-1">
  //         <div
  //           onClick={() => setHideBalance(!hideBalance)}
  //           className="pw-flex pw-items-center pw-gap-2 pw-cursor-pointer"
  //         >
  //           <p className="pw-text-xs pw-font-[400] pw-text-slate-600">
  //             {wallet?.type === WalletTypes.Vault
  //               ? translate('header>logged>pixwayBalance')
  //               : translate('header>logged>metamaskBalance')}
  //           </p>
  //           <EyeIcon />
  //         </div>
  //         {hideBalance ? (
  //           <CriptoValueComponent
  //             fontClass="pw-text-sm pw-text-slate-900"
  //             crypto={true}
  //             value={
  //               organizedWallets?.length ? organizedWallets[0].balance : '0'
  //             }
  //             code={chainIdToCode(
  //               organizedWallets[0].chainId,
  //               organizedWallets[0].currency
  //             )}
  //           />
  //         ) : (
  //           <p className="pw-font-[700] pw-text-xs pw-text-slate-900">*****</p>
  //         )}
  //       </div>
  //     </div>
  //   );
  // };

  // const WithoutWallet = () => {
  //   return (
  //     <PixwayButton
  //       onClick={() => setAttachModal(true)}
  //       fullWidth
  //       className="!pw-bg-brand-primary !pw-text-white !pw-text-xs !pw-py-[9px] pw-rounded-[48px] pw-shadow-[0px_2px_4px_rgba(0,0,0,0.26)]"
  //     >
  //       {translate('shared>header>connectWallet')}
  //     </PixwayButton>
  //   );
  // };

  const { defaultTheme } = useThemeConfig();
  const hideLoyaltyAuthentication =
    defaultTheme?.configurations?.contentData?.hideLoyaltyAuthentication;
  const hideWallet =
    defaultTheme?.configurations?.contentData?.hideWalletAddress;
  return session ? (
    <div style={{ backgroundColor }}>
      <div onClick={() => setUserMenu(!userMenu)} className="pw-cursor-pointer">
        <div
          onClick={() => setUserMenu(!userMenu)}
          className="pw-ml-5 pw-flex pw-items-center pw-gap-[6px] pw-cursor-pointer"
        >
          <UserSimpleIcon style={{ stroke: textColor }} />
          {organizedWallets &&
          organizedWallets.length > 0 &&
          organizedWallets.some(
            (wallet) =>
              wallet.type == 'loyalty' &&
              wallet?.balance &&
              parseFloat(wallet?.balance ?? '0') > 0
          ) ? (
            <p
              style={{ color: textColor }}
              className="pw-font-[400] pw-text-xs"
            >
              {organizedWallets.find(
                (wallet) =>
                  wallet.type == 'loyalty' &&
                  wallet?.balance &&
                  parseFloat(wallet?.balance ?? '0') > 0
              ).pointsPrecision == 'decimal'
                ? parseFloat(
                    organizedWallets.find(
                      (wallet) =>
                        wallet.type == 'loyalty' &&
                        wallet?.balance &&
                        parseFloat(wallet?.balance ?? '0') > 0
                    )?.balance ?? '0'
                  ).toFixed(2)
                : parseFloat(
                    organizedWallets.find(
                      (wallet) =>
                        wallet.type == 'loyalty' &&
                        wallet?.balance &&
                        parseFloat(wallet?.balance ?? '0') > 0
                    )?.balance ?? '0'
                  ).toFixed(0)}
            </p>
          ) : null}

          <ArrowDown
            style={{
              stroke: textColor,
              transform: userMenu ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </div>
      </div>
      {validatorOpened ? (
        <div
          style={{ backgroundColor: backgroundColor }}
          className=" pw-absolute pw-top-[90px] pw-left-0 pw-w-screen pw-z-30 pw-shadow-inner pw-pt-4 pw-pb-[30px] pw-px-[30px] pw-flex pw-flex-col pw-items-center"
        >
          {!hideWallet ? (
            <>
              <p
                style={{ color: textColor }}
                className="pw-text-xs pw-font-[400]"
              >
                {translate('header>logged>hiWallet', { name: profile?.name })}
              </p>
              <div
                onClick={() => copyAddress(profile?.mainWallet?.address || '')}
                className="pw-flex pw-gap-x-1 pw-mt-1 pw-cursor-pointer"
              >
                <p
                  style={{ color: textColor }}
                  className="pw-text-xs pw-font-[400] pw-cursor-pointer"
                >
                  {profile?.mainWallet?.address || '-'}
                </p>
                <CopyIcon />
                {copied ? (
                  <div className="pw-relative">
                    <div className="pw-flex pw-items-center pw-mt-2 pw-gap-x-2 pw-absolute pw-bg-slate-300 pw-shadow-md pw-rounded-md pw-right-0 pw-top-3 pw-p-1">
                      <p className="pw-text-sm pw-text-[#353945]">
                        {translate('components>menu>copied')}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
          <div className="pw-w-full pw-h-[1px] pw-bg-[#E6E8EC] pw-mt-3"></div>
          {/* {wallet ? <WithWallet /> : <WithoutWallet />} */}
          <div className="pw-mt-3 pw-w-full">
            {menuTabs.map((tab) =>
              tab.isVisible ? (
                <div
                  onClick={() => {
                    if (tab.action) tab.action();
                    else if (tab.route) {
                      toggleTabsMemo();
                      router.pushConnect(tab.route);
                    }
                  }}
                  style={{ color: textColor }}
                  className="pw-flex pw-gap-x-5 pw-items-center pw-justify-center pw-w-full pw-py-3 hover:pw-bg-brand-primary pw-cursor-pointer pw-rounded pw-text-lg"
                  key={tab.name}
                >
                  {tab.icon}
                  <p>{tab.name}</p>
                </div>
              ) : null
            )}
            {organizedWallets.length &&
            organizedWallets.some((w) => w.type == 'loyalty') &&
            !hideLoyaltyAuthentication ? (
              <BaseButton
                onClick={() => setAuthenticatePaymentModal?.(true)}
                className="!pw-text-white !pw-py-[10px] !pw-px-[24px] pw-mt-4 pw-w-full"
              >
                {translate('shared>navigationLoginLoggedButton>toScore')}
              </BaseButton>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  ) : (
    <div ref={divRef}>
      <div
        onClick={() => setLoginMenu(!loginMenu)}
        className="pw-cursor-pointer"
      >
        <div
          onClick={() => setLoginMenu(!loginMenu)}
          className="pw-ml-2 pw-flex pw-items-center pw-gap-[6px] pw-cursor-pointer"
        >
          <UserSimpleIcon style={{ stroke: textColor }} />

          <p style={{ color: textColor }} className="pw-font-[400] pw-text-xs">
            Login
          </p>

          <ArrowDown
            style={{
              stroke: textColor,
              transform: loginMenu ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </div>
      </div>
      {loginMenu && (
        <div
          style={{ backgroundColor: backgroundColor }}
          className="pw-absolute pw-top-[90px] pw-left-0 pw-z-10 pw-w-[100vw] pw-px-4 pw-py-8"
        >
          <div className="pw-flex pw-justify-center pw-gap-x-[26px]">
            <PixwayButton
              onClick={() => router?.pushConnect(PixwayAppRoutes.SIGN_IN)}
              fullWidth
              className="!pw-bg-brand-primary !pw-px-[40px] !pw-text-white !pw-text-xs !pw-py-[9px] pw-rounded-[48px] pw-shadow-[0px_2px_4px_rgba(0,0,0,0.26)]"
            >
              {translate('shared>login')}
            </PixwayButton>
            {hasSignUp && (
              <PixwayButton
                onClick={() => router.pushConnect(PixwayAppRoutes.SIGN_UP)}
                fullWidth
                className="!pw-bg-[#EFEFEF] !pw-px-[40px] !pw-text-black !pw-text-xs !pw-py-[9px] pw-rounded-[48px]  !pw-border-[#DCDCDC] !pw-border-1"
              >
                {translate('shared>register')}
              </PixwayButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
