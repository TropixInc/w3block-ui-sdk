import { ReactNode } from 'react';
import { useLockBodyScroll } from 'react-use';

import classNames from 'classnames';

import { ModalBase } from '../ModalBase';
import { WeblockButton } from '../WeblockButton/WeblockButton';

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
  confirmButtonText: string;
  cancelButtonText: string;
  classes?: {
    backdrop?: string;
    container?: string;
    dialogCard?: string;
    actionContainer?: string;
    closeButton?: string;
  };
  children: ReactNode;
  isConfirmButtonDisabled?: boolean;
  isCancelButtonDIsabled?: boolean;
}

export const DialogBase = ({
  isOpen,
  onCancel,
  onConfirm,
  classes = {},
  children,
  cancelButtonText,
  onClose,
  confirmButtonText,
  isCancelButtonDIsabled = false,
  isConfirmButtonDisabled = false,
}: Props) => {
  useLockBodyScroll(isOpen);
  return isOpen ? (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      classes={{
        dialogCard: classNames(
          'pw-bg-white pw-rounded-2xl pw-pl-8 pw-pr-[101px] pw-pt-10 pw-pb-12 pw-max-w-[656px] pw-w-full',
          classes.dialogCard ?? ''
        ),
        closeButton: classes.closeButton ?? '',
      }}
    >
      {children}
      <div
        className={classNames(
          'pw-flex pw-justify-end pw-gap-x-15',
          classes.actionContainer ?? ''
        )}
      >
        <WeblockButton
          onClick={onCancel}
          tailwindBgColor="pw-bg-white"
          fullWidth
          disabled={isCancelButtonDIsabled}
        >
          {cancelButtonText}
        </WeblockButton>
        <WeblockButton
          onClick={onConfirm}
          fullWidth
          disabled={isConfirmButtonDisabled}
        >
          {confirmButtonText}
        </WeblockButton>
      </div>
    </ModalBase>
  ) : null;
};
