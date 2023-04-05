/* eslint-disable prettier/prettier */
import { useLockBodyScroll } from 'react-use'; 

import classNames from 'classnames';

import { ReactComponent as ErrorIcon } from '../../assets/icons/errorIconRed.svg';
import { ReactComponent as XIcon } from '../../assets/icons/xFilled.svg';
import useTranslation from '../../hooks/useTranslation';
import { Button } from '../Buttons';

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
  validateAgain: ()=> void;
}

export const QrCodeError = ({ hasOpen, onClose, validateAgain, type }: iProps) => {

  const [translate] = useTranslation();

  useLockBodyScroll(hasOpen);

  const handleNext = () => {
    onClose();
    validateAgain();
  }

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
        {type === TypeError.read
          ? translate('token>pass>notPossibleReadQrCode')
          : type === TypeError.expired
            ? translate('token>pass>outsideAllowedTime')
            : type === TypeError.use
              ? translate('token>pass>usedAllTokens')
              : type === TypeError.invalid 
                ? translate('token>pass>invalidBenefitQrCode')
                : ''}
      </div>

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
