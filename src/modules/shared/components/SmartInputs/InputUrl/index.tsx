import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import { UserDocumentStatus } from '@w3block/sdk-id';
import classNames from 'classnames';
import isURL from 'validator/lib/isURL';

import { FormItemContainer } from '../../Form/FormItemContainer';
import InputStatus from '../InputStatus';

interface InputUrlProps {
  label: string;
  name: string;
  docValue?: string;
  docStatus?: UserDocumentStatus;
}

const InputUrl = ({ label, name, docValue, docStatus }: InputUrlProps) => {
  const { field, fieldState } = useController({ name });
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
    if (
      docValue &&
      isURL(docValue) &&
      docStatus !== UserDocumentStatus.RequiredReview
    ) {
      setUrl(docValue);
      field.onChange({ inputId: name, value: docValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docValue]);

  return (
    <div className="pw-mb-3">
      <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
        {label}
      </p>
      <FormItemContainer invalid={fieldState.invalid || !field.value}>
        <input
          name={name}
          readOnly={Boolean(
            docValue &&
              docStatus !== UserDocumentStatus.RequiredReview &&
              isURL(docValue)
          )}
          type="url"
          value={url}
          onChange={(e) => onChangeUrl(e.target.value)}
          className={classNames(
            'pw-mt-1 pw-text-base pw-h-[46px] pw-text-[#969696] pw-leading-4 pw-w-full pw-shadow-[0_4px_15px_#00000012] !pw-rounded-lg pw-outline-none pw-bg-transparent pw-px-[10px] autofill:pw-bg-transparent'
          )}
        />
      </FormItemContainer>
      <p className="mt-5">
        {field.value && <InputStatus invalid={fieldState.invalid} />}
      </p>
    </div>
  );
};

export default InputUrl;
