/* eslint-disable prettier/prettier */
import { useLockBodyScroll } from 'react-use';

import classNames from 'classnames'

import  ErrorIcon from '../../assets/icons/errorIconRed.svg';
import  XIcon from '../../assets/icons/xFilled.svg';
import { Button } from '../Buttons';
import useTranslation from '../../hooks/useTranslation';



export enum TypeError {
  read,
  use,
  expired,
  invalid,
}

interface iProps {
  hasOpen: boolean;
  onClose: () => void;
  type: TypeError;
  validateAgain: () => void;
  error?: string;
}

export const QrCodeError = ({ hasOpen, onClose, validateAgain, type, error = '' }: iProps) => {

  const [translate] = useTranslation();

  useLockBodyScroll(hasOpen);

  const handleNext = () => {
    onClose();
    validateAgain();
  }

  const getMessageByTypeError = (type: TypeError) => {
    switch (type) {
      case TypeError.read:
        return translate('token>pass>notPossibleReadQrCode');
      case TypeError.expired:
        return translate('token>pass>outsideAllowedTime');
      case TypeError.use:
        return translate('token>pass>usedAllTokens');
      case TypeError.invalid:
        return translate('token>pass>invalidBenefitQrCode');
      default:
        return '';
    }
  };

  return hasOpen ? (
    <div className="pw-flex pw-flex-col pw-gap-6 pw-fixed pw-top-0 pw-left-0 pw-w-full pw-h-screen pw-z-50 pw-bg-white pw-px-4 pw-py-8">
      <button
        onClick={onClose}
        className={classNames(
          'pw-bg-white pw-rounded-full pw-shadow-[0px_0px_5px_rgba(0,0,0,0.25)] pw-w-8 pw-h-8 pw-absolute pw-right-4 pw-top-4 pw-flex pw-items-center pw-justify-center'
        )}
      >
        <XIcon className="pw-pw-fill-[#5682C3]" />
      </button>

      <div className="pw-flex pw-flex-col pw-gap-6 pw-justify-center pw-items-center">
        <ErrorIcon className="pw-w-[60px] pw-h-[60px]" />
        <p className="pw-font-bold pw-text-[18px] pw-leading-[23px]">
          {translate('token>pass>invalidQrCode')}
        </p>
      </div>

      <div className="pw-w-full pw-flex pw-justify-center pw-text-center">
        {getMessageByTypeError(type)}
      </div>
      {error != undefined && error != "" &&
        <div className="pw-w-full pw-flex pw-justify-center pw-text-center">
          {error}
        </div>}


      <div className='pw-col'>
        <Button
          type="button"
          model="secondary"
          width="full"
          onClick={onClose}
        >
          {translate('token>pass>validatedToken>back')}
        </Button>
        <Button
          type="button"
          width="full"
          model="secondary"
          className='pw-mt-5'
          onClick={handleNext}
        >
          {translate('token>qrCode>tryAgain')}
        </Button>
      </div>
    </div>
  ) : (
    <></>
  );
};
