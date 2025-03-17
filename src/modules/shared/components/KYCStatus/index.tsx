import { KycStatus } from '@w3block/sdk-id';

import useTranslation from '../../hooks/useTranslation';

interface KYCStatusProps {
  status: KycStatus;
}

const KYCStatus = ({ status }: KYCStatusProps) => {
  const [translate] = useTranslation();
  const renderKYCStatus = () => {
    switch (status) {
      case KycStatus.Approved:
        return (
          <div className="pw-flex pw-items-center pw-gap-x-2">
            <div className="pw-w-[6px] pw-h-[6px] pw-rounded-full pw-bg-[#009A6C]"></div>
            <p className="pw-text-sm pw-text-[#272727] pw-font-semibold">
              {translate('shared>KYCStatys>approved')}
            </p>
          </div>
        );

      case KycStatus.Denied:
        return (
          <div className="pw-flex pw-items-center pw-gap-x-2">
            <div className="pw-w-[6px] pw-h-[6px] pw-rounded-fulll pw-bg-[#D02428]"></div>
            <p className="pw-text-sm pw-text-[#272727] pw-font-semibold">
              {translate('contacts>KYCListInterface>denied')}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return renderKYCStatus();
};

export default KYCStatus;
