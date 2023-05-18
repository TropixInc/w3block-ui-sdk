import { useTranslation } from 'react-i18next';

import { DataTypesEnum, UserDocumentStatus } from '@w3block/sdk-id';

import InputBirthdate from '../SmartInputs/InputBirthdate';
import InputCpf from '../SmartInputs/InputCpf';
import InputEmail from '../SmartInputs/InputEmail';
import InputFile from '../SmartInputs/InputFile';
import { InputMultiFace } from '../SmartInputs/InputMultiFace/InputMultiFace';
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
  onChangeUploadProgess: (value: boolean) => void;
  docFileValue?: string;
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
  onChangeUploadProgess,
}: SmartProps) => {
  const [translate] = useTranslation();
  const renderInput = () => {
    switch (type) {
      case DataTypesEnum.Cpf:
        return (
          <InputCpf
            label={label}
            name={name}
            docValue={value}
            docStatus={docStatus}
          />
        );
      case DataTypesEnum.Text:
        return (
          <InputText
            label={label}
            name={name}
            docValue={value}
            docStatus={docStatus}
          />
        );
      case DataTypesEnum.Birthdate:
        return (
          <InputBirthdate
            label={label}
            name={name}
            docValue={value}
            docStatus={docStatus}
          />
        );
      case DataTypesEnum.Phone:
        return (
          <InputPhone
            label={label}
            name={name}
            docValue={value}
            docStatus={docStatus}
          />
        );
      case DataTypesEnum.Email:
        return (
          <InputEmail
            label={label}
            name={name}
            docValue={value}
            docStatus={docStatus}
          />
        );
      case DataTypesEnum.Url:
        return (
          <InputUrl
            label={label}
            name={name}
            docValue={value}
            docStatus={docStatus}
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
            acceptTypesDocs={['.png', '.jpeg', '.jpg', '.pdf']}
            onChangeUploadProgess={onChangeUploadProgess}
          />
        );

      case DataTypesEnum.MultifaceSelfie:
        return (
          <InputMultiFace
            label={label}
            name={name}
            docValue={docFileValue}
            assetId={assetId}
            docStatus={docStatus}
            subtitle={translate('auth>smartInputsController>subtitleInputFile')}
            acceptTypesDocs={['.png', '.jpeg', '.jpg']}
            onChangeUploadProgess={onChangeUploadProgess}
          />
        );
    }
  };
  return <div>{renderInput()}</div>;
};

export default SmartInputsController;
