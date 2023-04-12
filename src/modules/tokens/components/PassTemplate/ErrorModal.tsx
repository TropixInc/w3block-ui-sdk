import { useLockBodyScroll } from 'react-use';

import { ReactComponent as ErrorIcon } from '../../../shared/assets/icons/errorIconRed.svg';
import { CloseButton } from '../../../shared/components/CloseButton';
import useTranslation from '../../../shared/hooks/useTranslation';
import { Button } from '../../../tokens/components/Button';

interface iProps {
  hasOpen: boolean;
  onClose: () => void;
}

export const ErrorModal = (props: iProps) => {
  useLockBodyScroll(props.hasOpen);
  const [translate] = useTranslation();

  if (props.hasOpen) {
    return (
      <div className="pw-flex pw-flex-col pw-gap-6 pw-fixed pw-top-0 pw-left-0 pw-w-full pw-h-screen pw-z-50 pw-bg-white pw-px-4 pw-py-8">
        <CloseButton onClose={props.onClose} />
        <div className="pw-w-full pw-h-full pw-flex pw-justify-center pw-items-center">
          <CloseButton onClose={props.onClose} />
          <div className="pw-w-full pw-h-full pw-flex pw-justify-center pw-items-center">
            <div className="pw-flex pw-flex-col pw-gap-6 pw-justify-center pw-items-center">
              <ErrorIcon className="pw-w-[60px] pw-h-[60px]" />
              <p className="pw-font-bold pw-text-[18px] pw-leading-[23px] pw-text-black pw-text-center">
                {translate('token>pass>selfError')}
              </p>
              <Button
                className="pw-mt-5 !pw-w-[250px] !pw-border-black"
                variant="secondary"
                onClick={props.onClose}
              >
                {translate('token>pass>close')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
