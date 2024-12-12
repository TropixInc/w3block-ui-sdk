/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, useState } from 'react';

import {
  DataTypesEnum,
  UserContextStatus,
  UserDocumentStatus,
} from '@w3block/sdk-id';
import _ from 'lodash';

import useTranslation from '../../hooks/useTranslation';
import ComplexPhone from '../SmartInputs/ComplexPhone';
import InputCheckbox from '../SmartInputs/InputCheckbox/InputCheckbox';
import InputDocuments from '../SmartInputs/InputDocuments';
import InputImage from '../SmartInputs/InputImage/InputImage';
import InputLocale from '../SmartInputs/InputLocale/InputLocale';
import InputPlaces from '../SmartInputs/InputPlaces/InputPlaces';
import InputProducts from '../SmartInputs/InputProducts';
import { Options } from '../SmartInputs/InputSelector/InputSelector';
import { Separator } from '../SmartInputs/Separator/Separator';
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
interface SmartProps {
  type: DataTypesEnum;
  label: string;
  name: string;
  simpleValue?: string;
  complexValue?: object;
  assetId?: string | null;
  docStatus?: UserDocumentStatus;
  openDocs?: boolean;
  onChangeUploadProgess: (value: boolean) => void;
  docFileValue?: string;
  profilePage?: boolean;
  options?: Options[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectData?: any;
  autofill?: boolean;
  inputSubtype?: string;
  inputRequestable?: boolean;
  inputsIdRequestReview?: Array<string>;
  onChangeInputsIdRequestReview?: (value: Array<string>) => void;
  isKeyPage?: boolean;
  required?: boolean;
  statusContext?: UserContextStatus;
  hideComplexPhone?: boolean;
  readonly?: boolean;
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
  disableParams?: boolean;
  search?: boolean;
  searchType?: string;
  approverPath?: string;
  subtitlePath?: string;
  imagePath?: string;
  imageBase?: string;
}

const SmartInputsController = ({
  label,
  name,
  type,
  simpleValue,
  complexValue,
  assetId,
  docStatus,
  docFileValue,
  openDocs,
  onChangeUploadProgess,
  profilePage,
  options,
  selectData,
  autofill = false,
  inputRequestable,
  inputsIdRequestReview,
  onChangeInputsIdRequestReview,
  isKeyPage,
  required,
  statusContext,
  hideComplexPhone = false,
  readonly,
}: SmartProps) => {
  const [translate] = useTranslation();
  const [checked, setChecked] = useState(false);
  const onChangeChecked = () => {
    if (checked) {
      if ((inputsIdRequestReview ?? []).includes(name)) {
        const removedInputId = (inputsIdRequestReview ?? []).filter(
          (item) => item !== name
        );
        onChangeInputsIdRequestReview &&
          onChangeInputsIdRequestReview(removedInputId);
        setChecked(false);
      }
    } else {
      onChangeInputsIdRequestReview &&
        onChangeInputsIdRequestReview([...(inputsIdRequestReview ?? []), name]);
      setChecked(true);
    }
  };

  const renderInput = () => {
    switch (type) {
      case DataTypesEnum.Cpf:
        return (
          <InputCpf
            label={label}
            name={name}
            docValue={simpleValue}
            docStatus={docStatus}
            profilePage={profilePage}
            required={required}
            readonly={readonly}
            hidenValidations={readonly}
          />
        );
      case DataTypesEnum.Text:
        return (
          <InputText
            label={label}
            name={name}
            docValue={simpleValue}
            docStatus={docStatus}
            required={required}
            readonly={readonly}
            hidenValidations={readonly}
          />
        );

      case DataTypesEnum.Birthdate:
        return (
          <InputBirthdate
            label={label}
            name={name}
            docValue={simpleValue}
            docStatus={docStatus}
            profilePage={profilePage}
            required={required}
            readonly={readonly}
            hidenValidations={readonly}
          />
        );
      case DataTypesEnum.Phone:
        return isKeyPage ? (
          <ComplexPhone
            label={label}
            name={name}
            complexValue={complexValue}
            docValue={simpleValue}
            docStatus={docStatus}
            hideAddButton={hideComplexPhone}
            statusContext={statusContext}
            readonly={readonly}
            hidenValidations={readonly}
          />
        ) : (
          <InputPhone
            label={label}
            name={name}
            docValue={simpleValue}
            docStatus={docStatus}
            required={required}
            readonly={readonly}
            hidenValidations={readonly}
          />
        );
      case DataTypesEnum.Email:
        return (
          <InputEmail
            label={label}
            name={name}
            docValue={simpleValue}
            docStatus={docStatus}
            autofill={autofill}
            hidenValidations={autofill || readonly}
            required={required}
            readonly={readonly}
          />
        );
      case DataTypesEnum.Url:
        return (
          <InputUrl
            label={label}
            name={name}
            docValue={simpleValue}
            docStatus={docStatus}
            required={required}
            readonly={readonly}
            hidenValidations={readonly}
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
            required={required}
            readonly={readonly}
            hidenValidations={readonly}
          />
        );

      case DataTypesEnum.Image:
        return (
          <InputImage
            title={selectData.title || ''}
            subtitle={selectData.subtitle}
            name={name}
            imagePlaceholder={selectData.placeholderImage}
            instructions={selectData.instructions}
            docValue={docFileValue}
            openDocs={openDocs}
            acceptTypes={selectData.acceptTypes || ['.png', '.jpeg', '.jpg']}
            onChangeUploadProgess={onChangeUploadProgess}
            required={required}
            readonly={readonly}
            hidenValidations={readonly}
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
            required={required}
          />
        );
      case DataTypesEnum.UserName:
        return (
          <InputText
            label={label}
            name={name}
            docValue={simpleValue}
            docStatus={docStatus}
            required={required}
            readonly={readonly}
            hidenValidations={readonly}
          />
        );
      case DataTypesEnum.SimpleSelect:
        return (
          <InputSelector
            type={DataTypesEnum.SimpleSelect}
            options={options ?? []}
            name={name}
            label={label}
            docValue={complexValue ?? simpleValue}
            configData={selectData}
            profilePage={profilePage}
            required={required}
            readonly={readonly}
            hidenValidations={readonly}
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
            docValue={complexValue ?? simpleValue}
            profilePage={profilePage}
            required={required}
            readonly={readonly}
            hidenValidations={readonly}
          />
        );
      case DataTypesEnum.IdentificationDocument:
        return (
          <InputDocuments
            name={name}
            label={label}
            docValue={complexValue}
            required={required}
            readonly={readonly}
            hidenValidations={readonly}
          />
        );
      case DataTypesEnum.Checkbox:
        return (
          <InputCheckbox
            label={label}
            name={name}
            docValue={!!complexValue}
            docStatus={docStatus}
            configData={selectData}
            hidenValidations
            required={required}
            readonly={readonly}
          />
        );
      case DataTypesEnum.SimpleLocation: {
        if (_.has(selectData, 'placeType')) {
          return (
            <InputPlaces
              name={name}
              label={label}
              docValue={complexValue}
              placeType={_.get(selectData, 'placeType', '')}
              placeCountry={_.get(selectData, 'placeCountry', '')}
              placeholder={_.get(selectData, 'placeholder', '')}
              required={required}
              readonly={readonly}
            />
          );
        } else {
          return (
            <InputLocale
              name={name}
              label={label}
              docValue={complexValue}
              hideRegion={(selectData as any)?.hideRegion}
              required={required}
              readonly={readonly}
            />
          );
        }
      }
      case DataTypesEnum.CommerceProduct: {
        return (
          <InputProducts
            label={label}
            name={name}
            docValue={complexValue}
            docStatus={docStatus}
            required={required}
          />
        );
      }
      case DataTypesEnum.Date: {
        return (
          <InputBirthdate
            label={label}
            name={name}
            docValue={simpleValue}
            docStatus={docStatus}
            profilePage={profilePage}
            required={required}
            readonly={readonly}
            hidenValidations={readonly}
          />
        );
      }
      case DataTypesEnum.Separator: {
        return (
          <Separator
            widgetType={(selectData as any)?.widgetType}
            separatorConfig={{
              marginBottom: (selectData as any)?.marginBottom,
              marginTop: (selectData as any)?.marginTop,
              showLine: (selectData as any)?.showLine,
              text: (selectData as any)?.text,
              textAbove: (selectData as any)?.textAbove,
            }}
            redirectConfig={{
              bgColor: (selectData as any)?.bgColor,
              link: (selectData as any)?.link,
              target: (selectData as any)?.target,
              text: (selectData as any)?.text,
              textColor: (selectData as any)?.textColor,
            }}
          />
        );
      }
    }
  };
  return (
    <div className="pw-flex pw-gap-x-2 pw-items-start">
      {inputRequestable ? (
        <input
          type="checkbox"
          className="pw-w-[18px] pw-h-[18px] pw-mt-1"
          name={name}
          value={name}
          checked={checked}
          onChange={() => onChangeChecked()}
        />
      ) : null}
      <div className="pw-flex-1">{renderInput()}</div>
    </div>
  );
};

export default SmartInputsController;
