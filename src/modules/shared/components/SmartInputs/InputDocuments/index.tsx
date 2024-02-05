import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import { UserDocumentStatus } from '@w3block/sdk-id';

import { FormItemContainer } from '../../Form/FormItemContainer';

interface InputDocuments {
  label: string;
  name: string;
  docValue?: string;
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
      value: 'passaport',
    },
    {
      label: 'CPF',
      value: 'cpf',
    },
  ];

  const CPFMask = /^(\d{3})(\d{3})(\d{3})(\d{2})/;

  const handleChange = (value: string | undefined) => {
    if (value) {
      setDocument(value);
      const valueObject = {
        docType: selectDocType,
        document: value,
      };
      field.onChange({
        inputId: name,
        value: JSON.stringify(valueObject),
      });
    } else {
      setDocument('');
      field.onChange({
        inputId: undefined,
        value: undefined,
      });
    }
  };

  const formatCpfValue = () => {
    if (document && document.length === 11) {
      setDocument(document.replace(CPFMask, '$1.$2.$3-$4'));
    }
  };

  useEffect(() => {
    if (docValue) {
      setApiSavedValue(JSON.parse(docValue));
    }
  }, [docValue]);

  useEffect(() => {
    if (apiSavedValue) {
      setSelectDocType(apiSavedValue.docType);
      setDocument(apiSavedValue.document);
    }
  }, [apiSavedValue]);

  return (
    <div className="pw-mb-3 pw-w-full">
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
        <div className="pw-w-full pw-mt-3">
          <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
            Número do Documento
          </p>
          <FormItemContainer className="pw-p-[0.6rem]">
            {selectDocType === 'cpf' ? (
              <input
                name={name}
                onChange={(e) => handleChange(e.target.value)}
                value={document}
                placeholder="Digite apenas números"
                maxLength={11}
                onBlur={() => formatCpfValue()}
                className="pw-mt-1 pw-text-base pw-text-[#969696] pw-leading-4 pw-w-full pw-shadow-[0_4px_15px_#00000012] !pw-rounded-lg pw-outline-none pw-bg-transparent autofill:pw-bg-transparent"
              />
            ) : (
              <input
                name={name}
                onChange={(e) => handleChange(e.target.value)}
                value={document}
                className="pw-mt-1 pw-text-base pw-text-[#969696] pw-leading-4 pw-w-full !pw-rounded-lg pw-bg-transparent autofill:pw-bg-transparent focus:pw-outline-none"
              />
            )}
          </FormItemContainer>
        </div>
      </div>
    </div>
  );
};

export default InputDocuments;
