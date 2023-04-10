/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { useLockBodyScroll } from 'react-use';


import { ReactComponent as CheckCircledIcon } from '../../../shared/assets/icons/checkCircledOutlined.svg';
import { ReactComponent as ErrorIcon } from '../../../shared/assets/icons/errorIconRed.svg';
import { CloseButton } from '../../../shared/components/CloseButton'
import { Spinner } from '../../../shared/components/Spinner';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import useRouter from '../../../shared/hooks/useRouter';
import useTranslation from '../../../shared/hooks/useTranslation';
import { Button } from '../../../tokens/components/Button';

interface iProps {
  hasOpen: boolean;
  onClose: () => void;
  useBenefit(): void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  benefit?: {
    name?: string;
    usesLeft?: number;
  }
}

const RenderChildren = ({ isSuccess, isLoading, isError, benefit, useBenefit, onClose }: iProps) => {
  const [translate] = useTranslation();
  const router = useRouter();

  if (isLoading) {
    return (
      <Spinner />
    )
  }
  if (isSuccess) {
    return (
      <>
        <CloseButton onClose={() => router.push(PixwayAppRoutes.WALLET)} />
        <div className="pw-w-full pw-h-full pw-flex pw-justify-center pw-items-center">
          <div className="pw-flex pw-flex-col pw-gap-6 pw-justify-center pw-items-center">
            <CheckCircledIcon className="pw-w-[60px] pw-h-[60px] pw-stroke-[#76DE8D]" />
            <p className="pw-text-[18px] pw-leading-[23px] pw-text-black pw-text-center">
              {translate('token>pass>selfUseValidated', { name: benefit?.name })}
            </p>
            <Button
              className='pw-mt-5 !pw-w-[250px] !pw-border-black'
              variant='secondary'
              onClick={() => router.push(PixwayAppRoutes.WALLET)}
            >
              {translate('token>pass>close')}
            </Button>
          </div>
        </div>
      </>
    )
  }
  if (isError) {
    return (
      <>
        <CloseButton onClose={onClose} />
        <div className="pw-w-full pw-h-full pw-flex pw-justify-center pw-items-center">
          <div className="pw-flex pw-flex-col pw-gap-6 pw-justify-center pw-items-center">
            <ErrorIcon className="pw-w-[60px] pw-h-[60px]" />
            <p className="pw-font-bold pw-text-[18px] pw-leading-[23px] pw-text-black pw-text-center">
              {translate('token>pass>selfError')}
            </p>
            <Button
              className='pw-mt-5 !pw-w-[250px] !pw-border-black'
              variant='secondary'
              onClick={onClose}
            >
              {translate('token>pass>close')}
            </Button>
          </div>
        </div>
      </>
    )
  } else {
    return (
      <>
        <CloseButton onClose={onClose} />
        <div className="pw-w-full pw-h-full pw-flex pw-justify-center pw-items-center">
          <div className="pw-flex pw-flex-col">
            <p className="pw-text-[18px] pw-leading-[23px] pw-text-black pw-text-center">
              {translate('token>pass>validateSelfUse', { name: benefit?.name })}
            </p>
            <Button
              className='pw-mt-5'
              onClick={useBenefit}
            >
              {translate('token>pass>selfUse')}
            </Button>
            <Button
              className='pw-mt-5'
              variant='secondary'
              onClick={onClose}
            >
              {translate('token>pass>cancel')}
            </Button>
          </div>
        </div>
      </>
    )
  }
}

export const SelfUseModal = (props: iProps) => {
  useLockBodyScroll(props.hasOpen);

  if (props.hasOpen) {
    return (
      <div className="pw-flex pw-flex-col pw-gap-6 pw-fixed pw-top-0 pw-left-0 pw-w-full pw-h-screen pw-z-50 pw-bg-white pw-px-4 pw-py-8">
        <CloseButton onClose={props.onClose} />
        <div className="pw-w-full pw-h-full pw-flex pw-justify-center pw-items-center">
          <RenderChildren {...props} />
        </div>
      </div>
    )
  }
  return null
};
