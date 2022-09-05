import { ReactNode } from 'react';
import { useLockBodyScroll } from 'react-use';

import classNames from 'classnames';

import { ReactComponent as XIcon } from '../../assets/icons/xFilled.svg';
import { Backdrop } from '../Backdrop';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  classes?: {
    dialogCard?: string;
    closeButton?: string;
  };
  children?: ReactNode;
  ownClass?: string;
  hideCloseButton?: boolean;
}

export const ModalBase = ({
  isOpen,
  onClose,
  classes = {},
  children,
  ownClass,
  hideCloseButton = false,
}: Props) => {
  useLockBodyScroll(isOpen);
  return isOpen ? (
    <>
      <Backdrop onClick={onClose} />
      <div
        className={
          ownClass
            ? ownClass
            : classNames(
                'pw-fixed pw-bg-white pw-rounded-2xl pw-pl-8 pw-pr-[101px] pw-pt-10 pw-pb-12 pw-max-w-[656px] pw-left-1/2 pw-top-1/2 -pw-translate-x-1/2 -pw-translate-y-1/2 pw-z-50',
                classes.dialogCard ?? ''
              )
        }
      >
        {!hideCloseButton && (
          <button
            onClick={onClose}
            className={classNames(
              'pw-bg-white pw-rounded-full pw-shadow-[0px_0px_5px_rgba(0,0,0,0.25)] pw-w-8 pw-h-8 pw-absolute pw-right-4 pw-top-4 pw-flex pw-items-center pw-justify-center',
              classes.closeButton ?? ''
            )}
          >
            <XIcon className="pw-fill-[#5682C3]" />
          </button>
        )}
        {children}
      </div>
    </>
  ) : null;
};
