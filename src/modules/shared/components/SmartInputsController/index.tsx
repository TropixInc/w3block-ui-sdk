import { DataTypesEnum, UserDocumentStatus } from '@w3block/sdk-id';

import InputCpf from '../SmartInputs/InputCpf';
import InputEmail from '../SmartInputs/InputEmail';
import InputFile from '../SmartInputs/InputFile';
import InputPhone from '../SmartInputs/InputPhone';
import InputText from '../SmartInputs/InputText';
import InputUrl from '../SmartInputs/InputUrl';

interface SmartProps {
  type: DataTypesEnum;
  label: string;
  name: string;
  value?: string;
  assetId?: string | null;

  docStatus?: UserDocumentStatus;
  openDocs?: boolean;

  docFileValue?: string;
  hidenValidations?: boolean;
}

export interface InputError {
  inputId: string;
  value: {
    message: string;
  };
}

const SmartInputsController = ({
  label,
  name,
  type,
  value,
  assetId,
  docStatus,
  docFileValue,
  hidenValidations = false,
  openDocs,
}: SmartProps) => {
  const renderInput = () => {
    switch (type) {
      case DataTypesEnum.Cpf:
        return (
          <InputCpf
            label={label}
            name={name}
            docValue={value}
            docStatus={docStatus}
            hidenValidations={hidenValidations}
          />
        );
      case DataTypesEnum.Text:
        return (
          <InputText
            label={label}
            name={name}
            docValue={value}
            docStatus={docStatus}
            hidenValidations={hidenValidations}
          />
        );
      case DataTypesEnum.Phone:
        return (
          <InputPhone
            label={label}
            name={name}
            docValue={value}
            docStatus={docStatus}
            hidenValidations={hidenValidations}
          />
        );
      case DataTypesEnum.Email:
        return (
          <InputEmail
            label={label}
            name={name}
            docValue={value}
            docStatus={docStatus}
            hidenValidations={hidenValidations}
          />
        );
      case DataTypesEnum.Url:
        return (
          <InputUrl
            label={label}
            name={name}
            docValue={value}
            docStatus={docStatus}
            hidenValidations={hidenValidations}
          />
        );
      case DataTypesEnum.File:
        return (
          <InputFile
            label={label}
            name={name}
            docValue={docFileValue}
            assetId={assetId}
            docStatus={docStatus}
            hidenValidations={hidenValidations}
            openDocs={openDocs}
          />
        );
    }
  };
  return <div>{renderInput()}</div>;
};

export default SmartInputsController;
