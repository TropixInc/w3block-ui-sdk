import { useMemo } from 'react';

import { usePixwaySession } from '../../../../hooks/usePixwaySession';
import { NavigationLoginLoggedButton } from './components/NavigationLoginLoggedButton';
import { NavigationLoginLoggedButtonMobile } from './components/NavigationLoginLoggedButtonMobile';
import { NavigationLoginNonLoggedButton } from './components/NavigationLoginNonLoggedButton';

interface NavigationLoginPixwaySDKProps {
  marginLeft?: number;
  signInRouter?: string;
  signUpRouter?: string;
}

export const NavigationLoginPixwaySDK = ({
  marginLeft = 40,
  signInRouter,
  signUpRouter,
}: NavigationLoginPixwaySDKProps) => {
  const { data: session } = usePixwaySession();

  const InfoToShow = useMemo(() => {
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
  }, [session, signInRouter, signUpRouter]);

  const InfoToShowMobile = useMemo(() => {
    return <NavigationLoginLoggedButtonMobile />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, signInRouter, signUpRouter]);

  return (
    <div>
      <div
        style={{ marginLeft: marginLeft + 'px' }}
        className="sm:pw-flex pw-border-l pw-border-[#777E8F] pw-items-center pw-hidden"
      >
        {InfoToShow}
      </div>
      <div className="sm:pw-hidden ">{InfoToShowMobile}</div>
    </div>
  );
};
