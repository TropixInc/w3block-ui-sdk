/* eslint-disable prettier/prettier */
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
              'fixed bg-white rounded-2xl pl-8 pr-[101px] pt-10 pb-12 max-w-[656px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
              classes.dialogCard ?? ''
            )
        }
      >
        {!hideCloseButton && (
          <button
            onClick={onClose}
            className={classNames(
              'bg-white rounded-full shadow-[0px_0px_5px_rgba(0,0,0,0.25)] w-8 h-8 absolute right-4 top-4 flex items-center justify-center',
              classes.closeButton ?? ''
            )}
          >
            <XIcon className="fill-[#5682C3]" />
          </button>
        )}
        {children}
      </div>
    </>
  ) : null;
};