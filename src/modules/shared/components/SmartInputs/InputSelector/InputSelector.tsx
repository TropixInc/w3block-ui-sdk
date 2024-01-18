import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import { FormItemContainer } from '../../Form/FormItemContainer';

export interface Options {
  label: string;
  value: string;
  type?: string;
  valuePath?: string;
  labelPath?: string;
}

interface Props {
  options: Options[];
  name: string;
  label: string;
}

export const InputSelector = ({ options, name, label }: Props) => {
  const { field } = useController({ name });
  const [firstInput, setFirstInput] = useState(true);
  const handleTextChange = (value: string) => {
    if (value) {
      field.onChange({ inputId: name, value: value });
    } else {
      field.onChange({
        inputId: undefined,
        value: undefined,
      });
    }
  };

  useEffect(() => {
    if (firstInput) {
      field.onChange({ inputId: name, value: options[0].value });
      setFirstInput(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pw-mt-4 pw-mb-3">
      <label className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
        {label}
      </label>
      <FormItemContainer className="pw-p-[0.6rem]">
        <select
          name={name}
          onChange={(e) => handleTextChange(e.target.value)}
          className="pw-max-h-[180px] pw-w-full pw-overflow-y-auto"
        >
          {options.map((val) => (
            <option key={val.value} value={val.value}>
              {val.label}
            </option>
          ))}
        </select>
      </FormItemContainer>
    </div>
  );
};
