
import CheckedIcon from '../../../shared/assets/icons/checkCircledOutlined.svg';
import useTranslation from '../../../shared/hooks/useTranslation';

export const UsedPass = () => {
  const [translate] = useTranslation();
  return (
    <div className="pw-relative pw-flex pw-flex-col pw-justify-center pw-items-center pw-rounded-[8px] pw-w-full pw-gap-[24px]">
      <div className="pw-w-[36px] pw-h-[36px]">
        <CheckedIcon className="pw-stroke-[#76DE8D] pw-w-[36px] pw-h-[36px]" />
      </div>
      <div className="pw-text-[#353945] pw-font-bold pw-text-[18px] pw-leading-[23px] pw-text-center">
        {translate('token>pass>qrCodeValidated')}
      </div>
    </div>
  );
};
