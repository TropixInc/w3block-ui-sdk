import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import classNames from 'classnames';

import AuthFormController from '../../../../auth/components/AuthFormController/AuthFormController';

interface InputUrlProps {
  label: string;
  name: string;
  docValue?: string;
}

const InputUrl = ({ label, name, docValue }: InputUrlProps) => {
  const { field } = useController({ name });
  const [url, setUrl] = useState('');

  const onChangeUrl = (value: string) => {
    if (value) {
      setUrl(value);
      field.onChange({ inputId: name, value: value });
    } else {
      setUrl('');
      field.onChange({ inputId: name, value: '' });
    }
  };

  useEffect(() => {
    if (docValue) {
      setUrl(docValue);
      field.onChange({ inputId: name, value: docValue });
    }
  }, [docValue]);

  return (
    <div className="pw-mb-3">
      <AuthFormController label={label} name={name}>
        <input
          name={name}
          readOnly={Boolean(docValue)}
          type="url"
          value={url}
          onChange={(e) => onChangeUrl(e.target.value)}
          className={classNames(
            'pw-mt-1 pw-text-base pw-h-[46px] pw-text-[#969696] pw-leading-4 pw-w-full pw-shadow-[0_4px_15px_#00000012] pw-outline-1 pw-outline-brand-primary pw-rounded-lg pw-outline-none pw-bg-transparent pw-px-[10px] autofill:pw-bg-transparent'
          )}
        />
      </AuthFormController>
    </div>
  );
};

export default InputUrl;
