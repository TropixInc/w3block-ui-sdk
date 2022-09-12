import { ReactNode } from 'react';
import { useLockBodyScroll } from 'react-use';

import classNames from 'classnames';

import { ModalBase } from '../ModalBase';
import { PixwayButton } from '../PixwayButton/index';

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
    cancelButton?: string;
    dialogCard?: string;
    confirmButton?: string;
    actionContainer?: string;
    closeButton?: string;
  };
  children: ReactNode;
  isConfirmButtonDisabled?: boolean;
  isCancelButtonDIsabled?: boolean;
}

const DialogBase = ({
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
          'bg-white rounded-2xl pl-8 pr-[101px] pt-10 pb-12 max-w-[656px] w-full',
          classes.dialogCard ?? ''
        ),
        closeButton: classes.closeButton ?? '',
      }}
    >
      {children}
      <div
        className={classNames(
          'flex justify-end gap-x-15',
          classes.actionContainer ?? ''
        )}
      >
        <PixwayButton
          type="button"
          variant="outlined"
          className={classNames(
            '!text-[14px] leading-4 max-w-[200px]',
            classes.cancelButton ?? ''
          )}
          onClick={onCancel}
          fullWidth
          disabled={isCancelButtonDIsabled}
        >
          {cancelButtonText}
        </PixwayButton>
        <PixwayButton
          type="button"
          className={classNames(
            '!text-[14px] leading-4 max-w-[200px]',
            classes.confirmButton ?? ''
          )}
          onClick={onConfirm}
          fullWidth
          disabled={isConfirmButtonDisabled}
        >
          {confirmButtonText}
        </PixwayButton>
      </div>
    </ModalBase>
  ) : null;
};

export default DialogBase;
