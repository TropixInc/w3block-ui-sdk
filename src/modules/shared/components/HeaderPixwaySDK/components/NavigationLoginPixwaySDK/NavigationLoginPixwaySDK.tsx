import { useMemo } from 'react';

import { usePixwaySession } from '../../../../hooks/usePixwaySession';
import { NavigationLoginLoggedButton } from './components/NavigationLoginLoggedButton';
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

  return (
    <div
      style={{ marginLeft: marginLeft + 'px' }}
      className="pw-flex pw-border-l pw-border-[#777E8F] pw-items-center"
    >
      {InfoToShow}
    </div>
  );
};
