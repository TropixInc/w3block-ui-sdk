import { useCallback, useMemo, useState } from 'react';

const useModalController = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return useMemo(() => {
    return {
      isOpen,
      closeModal,
      openModal,
    };
  }, [isOpen, closeModal, openModal]);
};

export default useModalController;
