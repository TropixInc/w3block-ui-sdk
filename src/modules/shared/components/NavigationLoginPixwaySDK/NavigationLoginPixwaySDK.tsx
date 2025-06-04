import { lazy, useState } from 'react';
import { usePixwaySession } from '../../hooks/usePixwaySession';
import { NavigationLoginLoggedButton } from './components/NavigationLoginLoggedButton';
import { NavigationLoginNonLoggedButton } from './components/NavigationLoginNonLoggedButton';
import { NavigationLoginLoggedButtonMobile } from './components/NavigationLoginLoggedButtonMobile';



interface NavigationLoginPixwaySDKProps {
  className?: string;
  signInRouter?: string;
  signUpRouter?: string;
  toggleLoginMenu?: () => void;
  loginMenu?: boolean;
  hasSignUp?: boolean;
  textColor?: string;
  fontFamily?: string;
  backgroundColor?: string;
}

export const NavigationLoginPixwaySDK = ({
  className,
  signInRouter,
  signUpRouter,
  toggleLoginMenu,
  loginMenu,
  hasSignUp,
  textColor = 'black',
  fontFamily,
  backgroundColor = 'white',
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
    <div
      style={{
        fontFamily: (fontFamily ? fontFamily : 'Montserrat') + ', sans-serif',
      }}
    >
      <div className={`sm:pw-flex  pw-items-center pw-hidden ${className}`}>
        {session ? (
          <NavigationLoginLoggedButton
            textColor={textColor}
            fontFamily={fontFamily}
            backgroundColor={backgroundColor}
          />
        ) : (
          <NavigationLoginNonLoggedButton
            signInRoute={signInRouter}
            signUpRoute={signUpRouter}
            hasSignUp={hasSignUp}
            textColor={textColor}
            backgroundColor={backgroundColor}
          />
        )}
      </div>
      <div className="sm:pw-hidden">
        <NavigationLoginLoggedButtonMobile
          hasSignUp={hasSignUp}
          textColor={textColor}
          menuOpened={validatorOpened}
          toggleMenu={toggleTabsMemo}
          backgroundColor={backgroundColor}
        />
      </div>
    </div>
  );
};
