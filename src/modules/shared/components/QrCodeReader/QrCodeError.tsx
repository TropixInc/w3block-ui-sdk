/* eslint-disable prettier/prettier */
import { useLockBodyScroll } from 'react-use';

import { ReactComponent as ErrorIcon } from '../../assets/icons/errorIconRed.svg';
import useRouter from '../../hooks/useRouter';
import useTranslation from '../../hooks/useTranslation';
import { Button } from '../Buttons';

export enum TypeError {
  read,
  use,
  expired,
}

interface iProps {
  hasOpen: boolean;
  onClose: () => void;
  type: TypeError;
}

export const QrCodeError = ({ hasOpen, onClose, type }: iProps) => {
  const router = useRouter();

  const [translate] = useTranslation();

  useLockBodyScroll(hasOpen);

  return hasOpen ? (
    <div className="pw-flex pw-flex-col pw-gap-6 pw-fixed pw-top-0 pw-left-0 pw-w-full pw-h-screen pw-z-50 pw-bg-white pw-px-4 pw-py-8">
      <div
        className="pw-rounded-full pw-flex pw-justify-center pw-items-center pw-w-9 pw-h-9 pw-text-xs pw-text-[#353945] pw-border pw-border-[#777E8F] pw-absolute pw-top-4 pw-right-4 pw-cursor-pointer"
        onClick={onClose}
      >
        x
      </div>

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
              : ''}
      </div>

      <Button
        type="button"
        model="secondary"
        width="full"
        onClick={() => router.back()}
      >
        {translate('token>pass>validatedToken>back')}
      </Button>
    </div>
  ) : (
    <></>
  );
};
