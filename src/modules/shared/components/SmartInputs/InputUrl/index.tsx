import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import { UserDocumentStatus } from '@w3block/sdk-id';
import classNames from 'classnames';
import isURL from 'validator/lib/isURL';

import AuthFormController from '../../../../auth/components/AuthFormController/AuthFormController';

interface InputUrlProps {
  label: string;
  name: string;
  docValue?: string;
  docStatus?: UserDocumentStatus;
}

const InputUrl = ({ label, name, docValue, docStatus }: InputUrlProps) => {
  const { field } = useController({ name });
  const [url, setUrl] = useState('');
  const [validUrl, setValidUrl] = useState<boolean | undefined>();

  const onChangeUrl = (value: string) => {
    if (value) {
      setUrl(value);
      field.onChange({ inputId: name, value: value });
    } else {
      setUrl('');
      field.onChange({ inputId: name, value: '' });
    }
  };

  const onValidUrl = () => {
    if (isURL(url)) {
      setValidUrl(true);
    } else {
      setValidUrl(false);
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
      <AuthFormController label={label} name={name}>
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
          onBlur={() => onValidUrl()}
          className={classNames(
            'pw-mt-1 pw-text-base pw-h-[46px] pw-text-[#969696] pw-leading-4 pw-w-full pw-shadow-[0_4px_15px_#00000012] pw-outline-1 pw-outline-brand-primary pw-rounded-lg pw-outline-none pw-bg-transparent pw-px-[10px] autofill:pw-bg-transparent',
            validUrl ? 'pw-outline-brand-primary' : 'pw-outline-[#FF0505]'
          )}
        />
      </AuthFormController>
    </div>
  );
};

export default InputUrl;
