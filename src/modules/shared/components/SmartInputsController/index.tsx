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
  selectData?: any;
  inputImageTitle?: string;
  inputImageSubtitle?: string;
  inputImagePlaceholder?: string;
  inputImageInstructions?: string;
  acceptImageTypes?: Array<string>;
}

export interface InputError {
  inputId: string;
  value: {
    message: string;
  };
}

export interface InputDataDTO {
  labelPath: string;
  responsePath: string;
  url: string;
  valuePath: string;
  isPublicApi?: boolean;
  paginationType?: 'external' | 'internal';
  isMultiple?: boolean;
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
  selectData,
  inputImageInstructions,
  inputImagePlaceholder,
  inputImageSubtitle,
  inputImageTitle,
  acceptImageTypes,
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
          <InputSelector
            type={DataTypesEnum.SimpleSelect}
            options={options ?? []}
            name={name}
            label={label}
            docValue={value}
          />
        );
      case DataTypesEnum.DynamicSelect:
        return (
          <InputSelector
            type={DataTypesEnum.DynamicSelect}
            options={options ?? []}
            name={name}
            label={label}
            configData={selectData as InputDataDTO}
            docValue={value}
          />
        );
    }
  };
  return <div>{renderInput()}</div>;
};

export default SmartInputsController;
