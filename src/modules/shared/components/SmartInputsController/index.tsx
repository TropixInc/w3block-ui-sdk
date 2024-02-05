import { useTranslation } from 'react-i18next';

import { DataTypesEnum, UserDocumentStatus } from '@w3block/sdk-id';

const InputBirthdate = lazy(() =>
  import('../SmartInputs/InputBirthdate').then((module) => ({
    default: module.default,
  }))
);
const InputCpf = lazy(() =>
  import('../SmartInputs/InputCpf').then((module) => ({
    default: module.default,
  }))
);
const InputEmail = lazy(() =>
  import('../SmartInputs/InputEmail').then((module) => ({
    default: module.default,
  }))
);
const InputFile = lazy(() =>
  import('../SmartInputs/InputFile').then((module) => ({
    default: module.default,
  }))
);
const InputMultiFace = lazy(() =>
  import('../SmartInputs/InputMultiFace/InputMultiFace').then((module) => ({
    default: module.InputMultiFace,
  }))
);
const InputPhone = lazy(() =>
  import('../SmartInputs/InputPhone').then((module) => ({
    default: module.default,
  }))
);
const InputSelector = lazy(() =>
  import('../SmartInputs/InputSelector/InputSelector').then((module) => ({
    default: module.InputSelector,
  }))
);
const InputText = lazy(() =>
  import('../SmartInputs/InputText').then((module) => ({
    default: module.default,
  }))
);
const InputUrl = lazy(() =>
  import('../SmartInputs/InputUrl').then((module) => ({
    default: module.default,
  }))
);

import InputImage from '../SmartInputs/InputImage/InputImage';
import InputLocale from '../SmartInputs/InputLocale/InputLocale';
import { Options } from '../SmartInputs/InputSelector/InputSelector';

import { lazy } from 'react';

interface SmartProps {
  type: DataTypesEnum;
  label: string;
  name: string;
  value?: string;
  assetId?: string | null;
  docStatus?: UserDocumentStatus;
  openDocs?: boolean;
  onChangeUploadProgess: (value: boolean) => void;
  docFileValue?: string;
  profilePage?: boolean;
  options?: Options[];
  inputImageTitle?: string;
  inputImageSubtitle?: string;
  inputImagePlaceholder?: string;
  inputImageInstructions?: string;
  acceptImageTypes?: Array<string>;
  inputSubtype?: string;
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
  openDocs,
  onChangeUploadProgess,
  profilePage,
  options,
  inputImageInstructions,
  inputImagePlaceholder,
  inputImageSubtitle,
  inputImageTitle,
  acceptImageTypes,
  inputSubtype,
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
            profilePage={profilePage}
          />
        );
      case DataTypesEnum.Text:
        if (inputSubtype && inputSubtype === 'locale') {
          return <InputLocale name={name} label={label} docValue={value} />;
        } else {
          return (
            <InputText
              label={label}
              name={name}
              docValue={value}
              docStatus={docStatus}
            />
          );
        }

      case DataTypesEnum.Birthdate:
        return (
          <InputBirthdate
            label={label}
            name={name}
            docValue={value}
            docStatus={docStatus}
            profilePage={profilePage}
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
            openDocs={openDocs}
            acceptTypesDocs={['.png', '.jpeg', '.jpg', '.pdf']}
            onChangeUploadProgess={onChangeUploadProgess}
          />
        );

      case DataTypesEnum.Image:
        return (
          <InputImage
            title={inputImageTitle || ''}
            subtitle={inputImageSubtitle}
            name={name}
            imagePlaceholder={inputImagePlaceholder}
            instructions={inputImageInstructions}
            docValue={docFileValue}
            openDocs={openDocs}
            acceptTypes={acceptImageTypes || ['.png', '.jpeg', '.jpg']}
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
      case DataTypesEnum.UserName:
        return (
          <InputText
            label={label}
            name={name}
            docValue={value}
            docStatus={docStatus}
          />
        );
      case DataTypesEnum.SimpleSelect:
        return (
          <InputSelector options={options ?? []} name={name} label={label} />
        );
    }
  };
  return <div>{renderInput()}</div>;
};

export default SmartInputsController;
