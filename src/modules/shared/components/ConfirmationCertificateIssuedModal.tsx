import { lazy } from 'react';

import CheckCircledFilled from '../assets/icons/checkCircledFilled.svg';
import { useTranslation } from 'react-i18next';
import { ModalBase } from './ModalBase';


interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfirmationCertificateIssuedModal = ({
  isOpen,
  onClose,
}: Props) => {
  const [translate] = useTranslation();
  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      classes={{
        dialogCard: '!pw-p-[108px_40px_106px] !pw-max-w-[650px] !pw-w-full',
      }}
    >
      <div className="pw-flex pw-items-center pw-justify-center">
        <CheckCircledFilled className="!pw-w-6 !pw-h-6 pw-shrink-0" />

        <p className="pw-text-2xl pw-leading-7 pw-font-semibold pw-text-[#000000] pw-pl-4">
          {translate('components>confirmationCertificateIssuedModal>message')}
        </p>
      </div>
    </ModalBase>
  );
};
