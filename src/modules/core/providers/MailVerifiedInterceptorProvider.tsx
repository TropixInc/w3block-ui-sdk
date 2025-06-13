import { ReactNode, useCallback } from 'react';
import { useLockBodyScroll, useToggle } from 'react-use';
import { useProfile } from '../../shared/hooks/useProfile';
import { W3blockUISdkResendConfirmEmail } from '../context/ResendConfirmEmailContext';
import { ModalBlockedAction } from '../../shared/components/ModalBlockedAction';


interface Props {
  children?: ReactNode;
  code?: boolean;
}

export const MailVerifiedInterceptorProvider = ({ children, code }: Props) => {
  const [openModal, setOpenModal] = useToggle(false);
  const { data: profileResponse, refetch } = useProfile();
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
        code={code}
        minutesResendEmail={code ? 1 : 3}
        email={profileResponse?.data.email || ''}
        isOpen={openModal}
        toggleOpen={(val, refe) => {
          if (refe) {
            refetch();
          }
          setOpenModal(val);
        }}
      />
      {children}
    </W3blockUISdkResendConfirmEmail.Provider>
  );
};
