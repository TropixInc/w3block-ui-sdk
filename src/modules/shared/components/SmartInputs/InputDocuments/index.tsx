import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import { UserDocumentStatus } from '@w3block/sdk-id';

import useTranslation from '../../../hooks/useTranslation';
import { BaseInput } from '../../BaseInput';
import { BaseSelect } from '../../BaseSelect';
import LabelWithRequired from '../../LabelWithRequired';
import { InputError } from '../../SmartInputsController';
import InputStatus from '../InputStatus';

interface InputDocuments {
  label: string;
  name: string;
  docValue?: object;
  docStatus?: UserDocumentStatus;
  hidenValidations?: boolean;
  required?: boolean;
  readonly?: boolean;
}

const InputDocuments = ({
  name,
  docValue,
  label,
  required,
  hidenValidations = false,
  readonly,
}: InputDocuments) => {
  const { field, fieldState } = useController({ name });
  const [selectDocType, setSelectDocType] = useState<string | undefined>();
  const [document, setDocument] = useState<string | undefined>();
  const [translate] = useTranslation();
  const error = fieldState?.error as unknown as InputError;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [apiSavedValue, setApiSavedValue] = useState<any>();
  const docTypeOptions = [
    {
      label: 'Passaporte',
      value: 'passport',
    },
    {
      label: 'CPF',
      value: 'cpf',
    },
    {
      label: 'RG',
      value: 'rg',
    },
  ];

  const handleChange = (value: string | undefined) => {
    if (value) {
      setDocument(value);
      field.onChange({
        inputId: name,
        value: {
          docType: selectDocType,
          document: value,
        },
      });
    } else {
      setDocument('');
      field.onChange({
        inputId: undefined,
        value: undefined,
      });
    }
  };

  useEffect(() => {
    if (docValue) {
      setApiSavedValue(docValue);
    }
  }, [docValue]);

  useEffect(() => {
    if (apiSavedValue) {
      field.onChange({
        inputId: name,
        value: apiSavedValue,
      });
      setSelectDocType(apiSavedValue?.docType);
      setDocument(apiSavedValue?.document);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiSavedValue]);

  return (
    <div className="pw-mb-4 pw-w-full">
      <div className="pw-w-full">
        <LabelWithRequired name={name} required={required}>
          {label ?? 'Documento de Identificação'}
        </LabelWithRequired>
        <BaseSelect
          disableClasses={readonly}
          invalid={fieldState.invalid}
          valid={!!field?.value && !fieldState.invalid}
          disabled={readonly}
          onChangeValue={(e) => {
            setSelectDocType(e);
            setDocument('');
          }}
          options={docTypeOptions}
          value={apiSavedValue?.docType}
          placeholder="Selecione o tipo de documento.."
        />
        <div className="pw-w-full pw-mt-4">
          <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
            {translate('shared>inputDocument>docNumber')}
          </p>
          <BaseInput
            disableClasses={readonly}
            invalid={fieldState.invalid}
            valid={!!field?.value && !fieldState.invalid}
            disabled={readonly}
            name={name}
            onChange={(e) => handleChange(e.target.value)}
            value={document}
            readOnly={readonly}
            inputMode={selectDocType === 'cpf' ? 'numeric' : 'text'}
            mask={selectDocType === 'cpf' ? '999.999.999-99' : undefined}
            maskChar={''}
            placeholder={selectDocType === 'cpf' ? 'Digite apenas números' : ''}
          />
        </div>
        {!hidenValidations && (
          <div className="mt-5">
            {field.value && (
              <InputStatus
                invalid={fieldState.invalid}
                errorMessage={error?.value?.message}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputDocuments;
