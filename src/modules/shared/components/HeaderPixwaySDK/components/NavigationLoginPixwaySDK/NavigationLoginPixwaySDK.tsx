import { useState } from 'react';

import { usePixwaySession } from '../../../../hooks/usePixwaySession';
import { NavigationLoginLoggedButton } from './components/NavigationLoginLoggedButton';
import { NavigationLoginLoggedButtonMobile } from './components/NavigationLoginLoggedButtonMobile';
import { NavigationLoginNonLoggedButton } from './components/NavigationLoginNonLoggedButton';

interface NavigationLoginPixwaySDKProps {
  className?: string;
  signInRouter?: string;
  signUpRouter?: string;
  toggleLoginMenu?: () => void;
  loginMenu?: boolean;
}

export const NavigationLoginPixwaySDK = ({
  className,
  signInRouter,
  signUpRouter,
  toggleLoginMenu,
  loginMenu,
}: NavigationLoginPixwaySDKProps) => {
  const { data: session } = usePixwaySession();
  const [userMenu, setUserMenu] = useState<boolean>(false);

  const toggleTabsMemo = () => {
    if (toggleLoginMenu) {
      toggleLoginMenu();
    } else {
      setUserMenu(!userMenu);
    }
  };

  const validatorOpened = loginMenu ? loginMenu : userMenu;

  const InfoToShow = () => {
    if (session) {
      return <NavigationLoginLoggedButton />;
    } else {
      return (
        <NavigationLoginNonLoggedButton
          signInRoute={signInRouter}
          signUpRoute={signUpRouter}
        />
      );
    }
  };

  const InfoToShowMobile = () => {
    return (
      <NavigationLoginLoggedButtonMobile
        menuOpened={validatorOpened}
        toggleMenu={toggleTabsMemo}
      />
    );
  };

  return (
    <div>
      <div
        className={`sm:pw-flex pw-border-l pw-border-[#777E8F] pw-items-center pw-hidden pw-ml-[40px] ${className}`}
      >
        <InfoToShow />
      </div>
      <div className="sm:pw-hidden ">
        <InfoToShowMobile />
      </div>
    </div>
  );
};
