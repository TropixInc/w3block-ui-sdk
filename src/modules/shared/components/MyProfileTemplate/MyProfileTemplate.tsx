import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import classNames from 'classnames';

import { useRequestConfirmationMail } from '../../../auth/hooks/useRequestConfirmationMail';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useProfile } from '../../hooks';
import { usePixwaySession } from '../../hooks/usePixwaySession';
import { usePrivateRoute } from '../../hooks/usePrivateRoute';
import { Menu } from '../Menu';
import { ModalBase } from '../ModalBase';
import { MyProfile } from '../MyProfile/MyProfile';
import { PixwayButton } from '../PixwayButton';
import TranslatableComponent from '../TranslatableComponent';

const _MyProfileTemplate = () => {
  const { mutate } = useRequestConfirmationMail();
  const { data: profile } = useProfile();
  const { status } = usePixwaySession();
  const email = profile?.data?.email ?? '';
  const callbackPath = PixwayAppRoutes.COMPLETE_SIGNUP;
  const [isOpen, setIsOpen] = useState(false);

  const formattedEmail = useMemo(() => {
    const emailSplitted = email.split('@');
    if (emailSplitted.length === 1) return emailSplitted;
    return emailSplitted[0]
      .substring(0, 3)
      .concat('****@')
      .concat(emailSplitted[1]);
  }, [email]);

  const handleConfirm = () => {
    setIsOpen(true);
    mutate({ email, callbackPath });
  };

  const UnsignedUserAlert = () => {
    const [translate] = useTranslation();
    return (
      <>
        <ModalBase isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <p className="pw-font-montserrat pw-text-lg pw-font-bold pw-mb-[24px] pw-text-center">
            {translate('shared>myProfile>verifyEmail')}
          </p>
          <p className="pw-font-montserrat pw-text-sm pw-font-normal pw-text-center">
            {translate('auth>modalActionBlocked>verifyEmail>sendEmail')}
            <p>{formattedEmail}</p>
          </p>
        </ModalBase>
        <div className="pw-p-[16px_16px_24px] pw-h-[75px] pw-bg-[#FBEEF2] pw-rounded-[8px] pw-flex pw-justify-between pw-items-center pw-w-full pw-mt-[25px]">
          <div>
            <div>
              <p className="pw-font-montserrat pw-text-sm pw-font-semibold pw-text-[#ED4971]">
                {translate('auth>emailConfirmation>mailResentStepTitle')}
              </p>
              <p className="pw-font-montserrat pw-text-sm pw-font-normal pw-hidden sm:pw-block ">
                {translate('shared>myProfile>confirmText')}
              </p>
            </div>
          </div>
          <PixwayButton
            onClick={handleConfirm}
            className={classNames(
              '!pw-font-medium !pw-p-[5px_24px] !pw-text-xs !pw-leading-[18px] !pw-rounded-full !pw-shadow-[0_2px_4px_#00000042] pw-border-b pw-border-b-[#FFFFFF] pw-cursor-pointer !pw-bg-[#ED4971]',
              'hover:!pw-shadow-[0_2px_4px_#00000042]'
            )}
          >
            {translate('shared>myProfile>confirm')}
          </PixwayButton>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="pw-flex pw-flex-col pw-w-screen pw-min-h-screen pw-font-poppins">
        <div
          className={classNames(
            'pw-flex pw-flex-col pw-max-w-[1332px] pw-w-full pw-mx-auto pw-flex-1 pw-pt-[59px] pw-px-8'
          )}
        >
          {status === 'unauthenticated' ? <UnsignedUserAlert /> : null}
          <div className="pw-flex pw-mt-[25px]">
            <div className="pw-w-[295px] pw-shrink-0 pw-hidden sm:pw-block">
              <Menu />
            </div>
            <div className="pw-flex pw-flex-col pw-w-full">
              <div className={classNames('pw-flex-1 sm:pw-pl-8')}>
                <MyProfile />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const MyProfileTemplate = () => {
  const { isLoading, isAuthorized } = usePrivateRoute();

  return isLoading || !isAuthorized ? null : (
    <TranslatableComponent>
      <_MyProfileTemplate />
    </TranslatableComponent>
  );
};
