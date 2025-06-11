import { useTranslation } from 'react-i18next';
import CloseCircledIcon from '../../../shared/assets/icons/closeCircledOutlined.svg';
import ErrorIcon from '../../../shared/assets/icons/errorIconRed.svg';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';

export const ErrorTemplate = ({
  title,
  description,
  showButton = false,
}: {
  title: string;
  description: string;
  showButton?: boolean;
}) => {
  const [translate] = useTranslation();
  const router = useRouterConnect();
  return (
    <div className="pw-relative pw-w-full pw-flex pw-flex-col pw-justify-center pw-items-center pw-py-[32px] pw-px-[23px] pw-gap-[36px]">
      <div className="pw-absolute pw-right-[18px] pw-top-[18px] pw-w-[36px] pw-h-[36px] pw-rounded-full pw-border pw-border-[#777E8F] pw-flex pw-justify-center pw-items-center pw-cursor-pointer">
        <CloseCircledIcon className="pw-w-[8.5px] pw-h-[8.5px] pw-stroke-[#353945]" />
      </div>

      <div className="pw-w- pw-flex pw-flex-col pw-justify-center pw-items-center pw-gap-[24px]">
        <ErrorIcon className="pw-w-[36px] pw-h-[36px]" />
        <div className="pw-text-[#353945] pw-font-bold pw-text-[18px] pw-leading-[23px] pw-text-center">
          {title}
        </div>
      </div>
      <div className="pw-w-[320px] pw-text-[#353945] pw-font-normal pw-text-[14px] pw-leading-[21px] pw-text-center">
        {description}
      </div>
      <div className="pw-flex pw-flex-col pw-justify-center pw-items-center pw-gap-[12px] pw-w-full">
        {showButton ? (
          <button className="pw-w-full pw-rounded-[48px] pw-py-[5px] pw-flex pw-justify-center pw-bg-[#EFEFEF] hover:pw-bg-[#295BA6] pw-text-[#FFFFFF] sm:pw-text-[#383857] pw-font-medium pw-text-[12px] pw-leading-[18px] pw-border-[#295BA6] hover:pw-border-[#FFFFFF] pw-border hover:pw-shadow-[0px_2px_4px_rgba(0,0,0,0.26)] pw-cursor-pointer">
            {translate('token>pass>generateNewQrCode')}
          </button>
        ) : null}
        <button
          className="pw-w-full pw-rounded-[48px] pw-py-[5px] pw-flex pw-justify-center pw-bg-[#EFEFEF] hover:pw-bg-[#295BA6] pw-text-[#FFFFFF] sm:pw-text-[#383857] pw-font-medium pw-text-[12px] pw-leading-[18px] pw-border-[#295BA6] hover:pw-border-[#FFFFFF] pw-border hover:pw-shadow-[0px_2px_4px_rgba(0,0,0,0.26)] pw-cursor-pointer"
          onClick={() => router.back()}
        >
          {translate('token>pass>back')}
        </button>
      </div>
    </div>
  );
};
