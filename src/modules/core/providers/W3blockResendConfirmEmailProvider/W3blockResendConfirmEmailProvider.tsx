import { ReactNode, useMemo } from 'react';
import { useLockBodyScroll, useToggle } from 'react-use';

import { ModalBlockedAction, useProfile } from '../../../shared';
import { useCompanyId } from '../../../shared/hooks/useCompanyId';
import { W3blockUISdkResendConfirmEmail } from '../../context/ResendConfirmEmailContext';

interface Props {
  children?: ReactNode;
}

export const W3blockResendConfirmEmailProvider = ({ children }: Props) => {
  const { data: user } = useProfile();
  const [openModal, setOpenModal] = useToggle(false);
  const tenant = useCompanyId();

  const handleOpenModal = () => {
    !!user?.data.email && !user.data.verified && setOpenModal();
  };

  useLockBodyScroll(openModal);

  const value = useMemo(() => {
    return {
      openModal,
      minutesResendEmail: 1,
      setOpenModal: handleOpenModal,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal, user]);

  return (
    <W3blockUISdkResendConfirmEmail.Provider value={value}>
      <ModalBlockedAction
        email={user?.data.email || ''}
        tenant={tenant || ''}
        isOpen={value.openModal}
        toggleOpen={setOpenModal}
      />
      {children}
    </W3blockUISdkResendConfirmEmail.Provider>
  );
};
