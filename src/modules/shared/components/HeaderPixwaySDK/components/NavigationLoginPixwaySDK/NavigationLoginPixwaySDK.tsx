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
  hasSignUp?: boolean;
}

export const NavigationLoginPixwaySDK = ({
  className,
  signInRouter,
  signUpRouter,
  toggleLoginMenu,
  loginMenu,
  hasSignUp,
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

  return (
    <div>
      <div
        className={`sm:pw-flex pw-border-l pw-border-[#777E8F] pw-items-center pw-hidden pw-ml-[40px] ${className}`}
      >
        {session ? (
          <NavigationLoginLoggedButton />
        ) : (
          <NavigationLoginNonLoggedButton
            signInRoute={signInRouter}
            signUpRoute={signUpRouter}
            hasSignUp={hasSignUp}
          />
        )}
      </div>
      <div className="sm:pw-hidden ">
        <NavigationLoginLoggedButtonMobile
          menuOpened={validatorOpened}
          toggleMenu={toggleTabsMemo}
        />
      </div>
    </div>
  );
};
