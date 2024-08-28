import { useState } from 'react';

import EyeIcon from '../../../shared/assets/icons/eyeIcon.svg?react';
import EyeCrossedIcon from '../../../shared/assets/icons/eyeIconCrossed.svg?react';

interface PasswordInputDTO {
  value: string;
  onChangeValue: (value: string) => void;
  placeholder: string;
}

const PasswordInput = ({
  onChangeValue,
  placeholder,
  value,
}: PasswordInputDTO) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  return (
    <div className="pw-border pw-border-blue-300 pw-mt-1 pw-w-full pw-flex pw-items-center pw-rounded-lg pw-bg-transparent !pw-px-[10px] !pw-py-[14px]">
      <input
        type={isShowPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        className=" pw-text-base pw-font-normal pw-w-full pw-outline-none pw-bg-transparent  placeholder:!pw-text-[#777E8F] !pw-leading-[18px] disabled:pw-text-[#353945] disabled:pw-bg-[#EFEFEF] pw-text-fill-[#353945] autofill:pw-bg-transparent autofill:pw-shadow-[0_0_0_30px_#ffffff_inset] focus:pw-outline-none"
        placeholder={placeholder}
      />
      <button onClick={() => setIsShowPassword(!isShowPassword)}>
        {isShowPassword ? (
          <EyeCrossedIcon className="pw-stroke-slate-700" />
        ) : (
          <EyeIcon className="pw-stroke-slate-700" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
