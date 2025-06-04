/* eslint-disable i18next/no-literal-string */
import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useRouterConnect } from '../../../hooks/useRouterConnect';
import { PixwayButton } from '../../PixwayButton';
import UserIcon from '../../../assets/icons/user.svg'
import ArrowDown from '../../../assets/icons/arrowDown.svg'
import { PixwayAppRoutes } from '../../../enums/PixwayAppRoutes';

interface NavigationLoginNonLoggedButtonProps {
  signInRoute?: string;
  signUpRoute?: string;
  hasSignUp?: boolean;
  textColor?: string;
  backgroundColor?: string;
}

export const NavigationLoginNonLoggedButton = ({
  signInRoute = PixwayAppRoutes.SIGN_IN,
  signUpRoute = PixwayAppRoutes.SIGN_UP,
  hasSignUp = true,
  textColor = 'black',
  backgroundColor = 'white',
}: NavigationLoginNonLoggedButtonProps) => {
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  return (
    <div className="pw-hidden sm:pw-block">
      <div
        onClick={() => setOpenMenu(!openMenu)}
        className="pw-ml-5 pw-flex pw-items-center pw-gap-[6px] pw-cursor-pointer"
      >
        <UserIcon style={{ stroke: textColor }} />
        <p style={{ color: textColor }} className="pw-font-[400] pw-text-xs">
          Login
        </p>
        <ArrowDown
          style={{
            stroke: textColor,
            transform: openMenu ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </div>
      {openMenu ? (
        <div className="pw-relative">
          <div
            style={{ backgroundColor }}
            className="pw-absolute pw-mt-[1.68rem] pw-w-[140px] pw-z-30 pw-px-[10px] pw-py-3 pw-rounded-b-[20px] pw-shadow-md"
          >
            <PixwayButton
              onClick={() => router.pushConnect(signInRoute)}
              fullWidth
              className="!pw-bg-brand-primary !pw-text-white !pw-text-xs !pw-py-[9px] pw-rounded-[48px] pw-shadow-[0px_2px_4px_rgba(0,0,0,0.26)]"
            >
              {translate('shared>login')}
            </PixwayButton>
            {hasSignUp ? (
              <PixwayButton
                onClick={() => router.pushConnect(signUpRoute)}
                fullWidth
                className="!pw-bg-[#EFEFEF] !pw-text-black !pw-text-xs !pw-py-[9px] pw-rounded-[48px] !pw-outline-1 !pw-border-[#DCDCDC] !pw-border-1 pw-mt-[6px]"
              >
                {translate('shared>register')}
              </PixwayButton>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};
