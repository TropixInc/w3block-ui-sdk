import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import { UserDocumentStatus } from '@w3block/sdk-id';

import AuthFormController from '../../../../auth/components/AuthFormController/AuthFormController';

interface InputText {
  label: string;
  name: string;
  docValue?: string;
  docStatus?: UserDocumentStatus;
}

const InputText = ({ label, name, docValue, docStatus }: InputText) => {
  const { field } = useController({ name });
  const [inputValue, setInputValue] = useState<string | undefined>();
  const handleTextChange = (value: string) => {
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
        <input
          readOnly={Boolean(
            docValue && docStatus !== UserDocumentStatus.RequiredReview
          )}
          onChange={(e) => handleTextChange(e.target.value)}
          value={inputValue}
          className="pw-mt-1 pw-text-base pw-h-[48px] pw-text-[#969696] pw-leading-4 pw-w-full  pw-border !pw-border-[#11335b] pw-rounded-lg pw-bg-transparent pw-px-[10px] autofill:pw-bg-transparent focus:pw-outline-none"
        />
      </AuthFormController>
    </div>
  );
};

export default InputText;
