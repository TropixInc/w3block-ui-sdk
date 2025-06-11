import { useTranslation } from "react-i18next";
import { BenefitStatus } from "../../pass/enums/BenefitStatus";

interface StatusTagProps {
  status: BenefitStatus;
}

export const statusMobile = ({ status }: StatusTagProps) => {
  switch (status) {
    case BenefitStatus.active:
      return (
        <div className="pw-bg-[#009A6C] pw-w-[6px] pw-h-[6px] pw-rounded-full"></div>
      );
    case BenefitStatus.inactive:
      return (
        <div className="pw-bg-[#C63535] pw-w-[6px] pw-h-[6px] pw-rounded-full"></div>
      );
    case BenefitStatus.unavailable:
      return (
        <div className="pw-bg-[#777E8F] pw-w-[6px] pw-h-[6px] pw-rounded-full"></div>
      );
  }
};

const StatusTag = ({ status }: StatusTagProps) => {
  const [translate] = useTranslation();

  const containerStyle = 'pw-flex pw-items-center pw-gap-2';

  const defaultStyle =
    'pw-hidden pw-w-[20px] pw-overflow-hidden sm:pw-w-full sm:pw-block pw-font-poppins pw-font-semibold pw-text-sm pw-text-[#777E8F]';

  switch (status) {
    case BenefitStatus.active:
      return (
        <div className={containerStyle}>
          <div className="pw-bg-[#009A6C] pw-w-[6px] pw-h-[6px] pw-rounded-full"></div>
          <p className={defaultStyle}>{translate('tokens>StatusTag>active')}</p>
        </div>
      );

    case BenefitStatus.inactive:
      return (
        <div className={containerStyle}>
          <div className="pw-bg-[#C63535] pw-w-[6px] pw-h-[6px] pw-rounded-full"></div>
          <p className={defaultStyle}>
            {translate('tokens>StatusTag>inactive')}
          </p>
        </div>
      );
    case BenefitStatus.unavailable:
      return (
        <div className={containerStyle}>
          <div className="pw-bg-[#777E8F] pw-w-[6px] pw-h-[6px] pw-rounded-full"></div>
          <p className={`${defaultStyle} pw-opacity-80`}>
            {translate('tokens>StatusTag>unavailable')}
          </p>
        </div>
      );
  }
};

export default StatusTag;
