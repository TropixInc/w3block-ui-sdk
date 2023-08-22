import { ReactNode } from 'react';

interface ActionBusinessCardSDKProps {
  icon: ReactNode;
  title: string;
  description: string;
  buttonText?: string;
  onClick?: () => void;
}

export const ActionBusinessCardSDK = ({
  icon,
  title,
  description,
  buttonText = 'Default',
  onClick,
}: // onClick,
ActionBusinessCardSDKProps) => {
  return (
    <div className="pw-w-[270px] pw-h-[270px] pw-p-5 pw-bg-white pw-rounded-[20px] pw-shadow pw-flex-col pw-justify-start pw-items-start pw-gap-[14px] pw-flex">
      <div className="pw-w-[59px] pw-h-[59px]">{icon}</div>
      <div className="pw-text-black pw-text-lg pw-font-medium pw-leading-[23px]">
        {title}
      </div>
      <div className=" pw-max-h-[65px] pw-text-black pw-text-sm pw-font-normal">
        {description}
      </div>
      <button
        onClick={onClick}
        className=" pw-px-6 pw-py-[5px] pw-bg-blue-800 pw-rounded-[48px] pw-shadow pw-border-b pw-border-white pw-justify-center pw-tems-center pw-gap-2.5 "
      >
        <div className="pw-text-center pw-text-white pw-text-xs pw-font-medium">
          {buttonText}
        </div>
      </button>
    </div>
  );
};
