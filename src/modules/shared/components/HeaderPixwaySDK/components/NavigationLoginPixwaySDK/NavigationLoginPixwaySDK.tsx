import { useMemo } from 'react';

import { useSession } from 'next-auth/react';

import { NavigationLoginNonLoggedButton } from './components/NavigationLoginNonLoggedButton';

interface NavigationLoginPixwaySDKProps {
  marginLeft?: number;
}

export const NavigationLoginPixwaySDK = ({
  marginLeft = 40,
}: NavigationLoginPixwaySDKProps) => {
  const { data: session } = useSession();

  const InfoToShow = useMemo(() => {
    if (session) {
      return null;
    } else {
      return <NavigationLoginNonLoggedButton />;
    }
  }, [session]);

  return (
    <div
      style={{ marginLeft: marginLeft + 'px' }}
      className="pw-flex pw-border-l pw-border-[#777E8F]"
    >
      {InfoToShow}
    </div>
  );
};
