import { ReactNode, useCallback } from 'react';
import { useLockBodyScroll, useToggle } from 'react-use';

import { useProfile } from '../../../shared';
import { ModalBlockedAction } from '../../../shared/components/ModalBlockedAction';
import { W3blockUISdkResendConfirmEmail } from '../../context/ResendConfirmEmailContext';

interface Props {
  children?: ReactNode;
}

export const MailVerifiedInterceptorProvider = ({ children }: Props) => {
  const [openModal, setOpenModal] = useToggle(false);
  const { data: profileResponse } = useProfile();
  useLockBodyScroll(openModal);

  const needsMailConfirmationInterceptor = useCallback(
    (cb: () => void) => {
      if (profileResponse && profileResponse.data.verified) {
        cb();
      } else {
        setOpenModal(true);
      }
    },
    [profileResponse, setOpenModal]
  );

  return (
    <W3blockUISdkResendConfirmEmail.Provider
      value={needsMailConfirmationInterceptor}
    >
      <ModalBlockedAction
        minutesResendEmail={3}
        email={profileResponse?.data.email || ''}
        isOpen={openModal}
        toggleOpen={setOpenModal}
      />
      {children}
    </W3blockUISdkResendConfirmEmail.Provider>
  );
};
