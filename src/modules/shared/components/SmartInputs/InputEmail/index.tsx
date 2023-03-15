import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import { UserDocumentStatus } from '@w3block/sdk-id';
import classNames from 'classnames';
import isEmail from 'validator/lib/isEmail';

import AuthFormController from '../../../../auth/components/AuthFormController/AuthFormController';

interface InputEmailProps {
  label: string;
  name: string;
  docValue?: string;
  docStatus?: UserDocumentStatus;
}

const InputEmail = ({ label, name, docValue, docStatus }: InputEmailProps) => {
  const { field } = useController({ name });
  const [inputValue, setInputValue] = useState<string | undefined>();
  const [isValid, setIsValid] = useState(true);
  const handleChange = (value: string) => {
    if (value) {
      setInputValue(value);
      field.onChange({ inputId: name, value: value });
    } else {
      setInputValue('');
    }
  };

  const validEmail = () => {
    if (inputValue) {
      setIsValid(isEmail(inputValue));
    }
  };

  useEffect(() => {
    if (docValue && docStatus !== UserDocumentStatus.RequiredReview) {
      setInputValue(docValue);
      field.onChange({ inputId: name, value: docValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docValue]);

  return (
    <div className="pw-mb-3">
      <AuthFormController label={label} name={name}>
        <input
          name={name}
          readOnly={Boolean(
            docValue && docStatus !== UserDocumentStatus.RequiredReview
          )}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={validEmail}
          value={inputValue}
          type="email"
          className={classNames(
            'pw-mt-1 pw-text-base pw-h-[46px] pw-text-[#969696] pw-leading-4 pw-w-full pw-shadow-[0_4px_15px_#00000012] pw-outline-1 pw-rounded-lg pw-outline-none pw-bg-transparent pw-px-[10px] autofill:pw-bg-transparent',
            isValid ? 'pw-outline-brand-primary' : 'pw-outline-[#FF0505]'
          )}
        />
      </AuthFormController>
    </div>
  );
};

export default InputEmail;
