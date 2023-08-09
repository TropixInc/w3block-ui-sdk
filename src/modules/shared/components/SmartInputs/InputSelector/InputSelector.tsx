/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
// import { useController } from 'react-hook-form';

interface Options {
  label: string;
  value: string;
}

interface Props {
  options: Options[];
  name: string;
  onClick: (value: any) => void;
  productId: string;
}

export const ProductVariants = ({ options, name }: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  // const { field, fieldState } = useController({ name });
  return (
    <div className="pw-mt-4">
      <p className="pw-text-sm pw-text-black pw-mb-1">{name}</p>
      <div
        onClick={() => setIsOpened(!isOpened)}
        className={`pw-p-3 pw-flex pw-items-center pw-rounded-lg pw-justify-between pw-cursor-pointer ${
          isOpened ? 'pw-border-none pw-bg-white' : 'pw-border pw-border-black'
        }`}
      >
        <label className="pw-text-xs pw-font-[600] pw-text-black pw-truncate">
          {name}
        </label>
        <select name={name} className="pw-max-h-[180px] pw-overflow-y-auto">
          {options.map((val) => (
            <option
              key={val.value}
              value={val.value}
              onClick={() => setIsOpened(false)}
              className="pw-px-3 pw-py-2 pw-truncate pw-text-sm pw-cursor-pointer hover:pw-bg-slate-100 pw-text-black"
            >
              {val.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
