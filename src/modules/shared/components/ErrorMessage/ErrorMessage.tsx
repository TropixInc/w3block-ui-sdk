import { ReactComponent as ErrorIcon } from '../../assets/icons/errorIconRed.svg';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import useRouter from '../../hooks/useRouter';
import useTranslation from '../../hooks/useTranslation';
import { PixwayButton } from '../PixwayButton';

interface ErrorMessageProps {
  className?: string;
  message?: string;
  tryAgain?: () => void;
  cancel?: () => void;
}

export const ErrorMessage = ({
  className,
  message,
  tryAgain,
  cancel,
}: ErrorMessageProps) => {
  const router = useRouter();
  const [translate] = useTranslation();
  return (
    <div
      className={`pw-w-[300px] pw-flex pw-flex-col pw-items-center ${className}`}
    >
      <ErrorIcon />
      <p className="pw-mt-[26px] pw-text-lg pw-font-[700] pw-text-[#353945] pw-text-center">
        {message}
      </p>
      <PixwayButton
        onClick={
          tryAgain
            ? tryAgain
            : () => {
                router.back();
              }
        }
        className="!pw-py-3 !pw-px-[42px] !pw-bg-[#295BA6] !pw-text-xs !pw-text-[#FFFFFF] pw-border pw-border-[#295BA6] !pw-rounded-full hover:pw-bg-[#295BA6] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF] pw-w-full pw-mt-4"
      >
        {translate('shared>tryAgain')}
      </PixwayButton>
      <PixwayButton
        onClick={
          cancel
            ? cancel
            : () => {
                router.push(PixwayAppRoutes.HOME);
              }
        }
        className="!pw-py-3 !pw-px-[42px] !pw-bg-[#EFEFEF] !pw-text-xs pw-text-[#383857] pw-border pw-border-[#DCDCDC] !pw-rounded-full hover:pw-bg-[#EFEFEF] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF] pw-w-full pw-mt-4"
      >
        {translate('shared>cancel')}
      </PixwayButton>
    </div>
  );
};
