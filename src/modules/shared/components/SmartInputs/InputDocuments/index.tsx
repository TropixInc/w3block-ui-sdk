import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import ReactInputMask from 'react-input-mask';

import { UserDocumentStatus } from '@w3block/sdk-id';

import { FormItemContainer } from '../../Form/FormItemContainer';

interface InputDocuments {
  label: string;
  name: string;
  docValue?: object;
  docStatus?: UserDocumentStatus;
  hidenValidations?: boolean;
}

const InputDocuments = ({ name, docValue }: InputDocuments) => {
  const { field } = useController({ name });
  const [selectDocType, setSelectDocType] = useState<string | undefined>();
  const [document, setDocument] = useState<string | undefined>();
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
      setSelectDocType(apiSavedValue.docType);
      setDocument(apiSavedValue.document);
    }
  }, [apiSavedValue]);

  return (
    <div className="pw-mb-6 pw-w-full">
      <div className="pw-w-full">
        <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
          Documento de Identificação
        </p>
        <FormItemContainer className="pw-p-[0.6rem]">
          <select
            onChange={(e) => {
              setSelectDocType(e.target.value);
              setDocument('');
            }}
            className="pw-max-h-[180px] pw-w-full pw-h-6 pw-overflow-y-auto pw-bg-white pw-outline-none pw-text-black"
          >
            <option value={''}>Selecione o tipo de documento..</option>
            {docTypeOptions.map((val) => (
              <option
                selected={
                  apiSavedValue ? apiSavedValue.docType === val.value : false
                }
                key={val.value}
                value={val.value}
              >
                {val.label}
              </option>
            ))}
          </select>
        </FormItemContainer>
        <div className="pw-w-full pw-mt-7">
          <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
            Número do Documento
          </p>
          <FormItemContainer className="pw-p-[0.6rem]">
            {selectDocType === 'cpf' ? (
              <ReactInputMask
                mask={'999.999.999-99'}
                maskChar={''}
                name={name}
                onChange={(e) => handleChange(e.target.value)}
                value={document}
                placeholder="Digite apenas números"
                className="pw-mt-1 pw-text-base pw-text-[#969696] pw-leading-4 pw-w-full pw-outline-none"
                inputMode="numeric"
              />
            ) : (
              <input
                name={name}
                onChange={(e) => handleChange(e.target.value)}
                value={document}
                className="pw-mt-1 pw-text-base pw-text-[#969696] pw-leading-4 pw-w-full pw-outline-none"
              />
            )}
          </FormItemContainer>
        </div>
      </div>
    </div>
  );
};

export default InputDocuments;
