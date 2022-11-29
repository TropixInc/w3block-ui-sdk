import { useState } from 'react';

import { ReactComponent as ArrowDown } from '../../../../../assets/icons/arrowDown.svg';
import { PixwayAppRoutes } from '../../../../../enums/PixwayAppRoutes';
import { useRouterConnect } from '../../../../../hooks/useRouterConnect';
import useTranslation from '../../../../../hooks/useTranslation';
import { PixwayButton } from '../../../../PixwayButton';

interface NavigationLoginNonLoggedButtonProps {
  signInRoute?: string;
  signUpRoute?: string;
  hasSignUp?: boolean;
  textColor?: string;
}

export const NavigationLoginNonLoggedButton = ({
  signInRoute = PixwayAppRoutes.SIGN_IN,
  signUpRoute = PixwayAppRoutes.SIGN_UP,
  hasSignUp = true,
  textColor = 'black',
}: NavigationLoginNonLoggedButtonProps) => {
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  return (
    <div className="pw-hidden sm:pw-block">
      <div
        onClick={() => setOpenMenu(!openMenu)}
        className="pw-ml-5 pw-cursor-pointer"
      >
        <p
          style={{ color: textColor }}
          className="pw-font-montserrat pw-font-[400] pw-text-xs"
        >
          Login
        </p>
        <div className="pw-flex pw-items-center pw-gap-x-1">
          <p
            style={{ color: textColor }}
            className="pw-text-sm pw-font-[600] pw-font-montserrat"
          >
            {translate('shared>myAcount')}
          </p>
          <ArrowDown style={{ stroke: textColor }} />
        </div>
      </div>
      {openMenu ? (
        <div className="pw-relative">
          <div className="pw-absolute pw-mt-[1.68rem] pw-bg-white pw-w-[140px] pw-z-30 pw-px-[10px] pw-py-3 pw-rounded-b-[20px] pw-shadow-brand-shadow">
            <PixwayButton
              onClick={() => router.pushConnect(signInRoute)}
              fullWidth
              className="!pw-bg-brand-primary !pw-text-white !pw-text-xs !pw-py-[9px] pw-rounded-[48px] pw-shadow-[0px_2px_4px_rgba(0,0,0,0.26)]"
            >
              {translate('shared>login')}
            </PixwayButton>
            {hasSignUp && (
              <PixwayButton
                onClick={() => router.pushConnect(signUpRoute)}
                fullWidth
                className="!pw-bg-[#EFEFEF] !pw-text-black !pw-text-xs !pw-py-[9px] pw-rounded-[48px] !pw-outline-1 !pw-border-[#DCDCDC] !pw-border-1 pw-mt-[6px]"
              >
                {translate('shared>register')}
              </PixwayButton>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
