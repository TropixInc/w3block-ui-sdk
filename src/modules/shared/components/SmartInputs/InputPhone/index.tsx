import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import Input from 'react-phone-number-input/input';

import { UserDocumentStatus } from '@w3block/sdk-id';
import classNames from 'classnames';

import AuthFormController from '../../../../auth/components/AuthFormController/AuthFormController';

interface InputPhoneProps {
  label: string;
  name: string;

  docValue?: string;
  docStatus?: UserDocumentStatus;
}

const InputPhone = ({ label, name, docValue, docStatus }: InputPhoneProps) => {
  const { field } = useController({ name });
  const [inputValue, setInputValue] = useState<string | undefined>();
  const [invalidNumber, onChangeInvalidNumber] = useState(false);

  const handleChange = (value: string) => {
    if (value) {
      setInputValue(value);
      field.onChange({ inputId: name, value: value });
    } else {
      setInputValue('');
    }
  };

  useEffect(() => {
    if (docValue && docStatus !== UserDocumentStatus.RequiredReview) {
      setInputValue(docValue);
      field.onChange({ inputId: name, value: docValue });
    }
  }, [docValue]);

  return (
    <div className="pw-mb-3">
      <AuthFormController label={label} name={name}>
        <Input
          readOnly={Boolean(
            docValue && docStatus !== UserDocumentStatus.RequiredReview
          )}
          name={name}
          value={inputValue}
          onChange={handleChange}
          placeholder="+XX XX XXXXX XXXX"
          onBlur={
            inputValue
              ? () => onChangeInvalidNumber(!isValidPhoneNumber(inputValue))
              : () => onChangeInvalidNumber(false)
          }
          className={classNames(
            'pw-mt-1 pw-text-base pw-h-[46px] pw-text-[#969696] pw-leading-4 pw-w-full pw-shadow-[0_4px_15px_#00000012] pw-outline-1 pw-rounded-lg pw-outline-none pw-bg-transparent pw-px-[10px] autofill:pw-bg-transparent',
            invalidNumber ? 'pw-outline-[#FF0505]' : 'pw-outline-brand-primary'
          )}
        />
      </AuthFormController>
    </div>
  );
};

export default InputPhone;
