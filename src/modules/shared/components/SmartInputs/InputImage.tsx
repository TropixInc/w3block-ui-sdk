import { useCallback, useEffect, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { useController } from 'react-hook-form';

import {
  AssetTargetEnum,
  AssetTypeEnum,
  UserDocumentStatus,
} from '@w3block/sdk-id';
import classNames from 'classnames';

import { useCompanyConfig } from '../../hooks/useCompanyConfig';
import useUploadAssets from '../../hooks/useUploadAssets';
import { useUploadFileToCloudinary } from '../../hooks/useUploadFileToCloudinary';
import { validateIfStatusKycIsReadonly } from '../../utils/validReadOnlyKycStatus';
import { FormItemContainer } from '../Form/FormItemContainer';
import LabelWithRequired from '../LabelWithRequired';
import { Spinner } from '../Spinner';
import InputStatus from './InputStatus';
import useTranslation from '../../hooks/useTranslation';
interface InputImageProps {
  title: string;
  name: string;
  docValue?: string;
  assetId?: string | null;
  docStatus?: UserDocumentStatus;
  hidenValidations?: boolean;
  openDocs?: boolean;
  subtitle?: string;
  onChangeUploadProgess?: (value: boolean) => void;
  imagePlaceholder?: string;
  instructions?: string;
  acceptTypes?: Array<string>;
  textTitle?: string;
  required?: boolean;
  readonly?: boolean;
}

const InputImage = ({
  title,
  name,
  docValue,
  assetId,
  docStatus,
  hidenValidations = false,
  openDocs,
  subtitle,
  imagePlaceholder,
  instructions,
  onChangeUploadProgess,
  acceptTypes,
  textTitle,
  required,
  readonly,
}: InputImageProps) => {
  const [translate] = useTranslation();
  const [uploadedImage, setUploadedImage] = useState<string>();
  const { field, fieldState } = useController({ name });
  const [file, setFile] = useState<File | undefined>();
  const { companyId: tenantId } = useCompanyConfig();

  const {
    mutate: mutateAssets,
    data: assets,
    isError: mutateError,
    isPending: isLoadingAsset,
  } = useUploadAssets();

  const {
    mutate,
    data,
    isSuccess,
    isError,
    isPending: isLoadingUpload,
  } = useUploadFileToCloudinary();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDrop = useCallback((acceptedFiles: string | any[]) => {
    if (acceptedFiles.length) {
      setFile(acceptedFiles[0]);
      mutateAssets({
        tenantId: tenantId as string,
        body: {
          type: AssetTypeEnum.Image,
          target: AssetTargetEnum.UserDocument,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    accept: acceptTypes as unknown as Accept,
    disabled: validateIfStatusKycIsReadonly(docStatus as UserDocumentStatus),
  });

  useEffect(() => {
    onChangeUploadProgess &&
      onChangeUploadProgess(isLoadingUpload || isLoadingAsset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingUpload, isLoadingAsset]);

  useEffect(() => {
    if (file && assets?.data?.id) {
      mutate({ file: file, assets: assets.data, config: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets?.data, file]);

  useEffect(() => {
    if (isSuccess && data && assets?.data?.id) {
      field.onChange({ inputId: name, assetId: assets.data.id });
      setUploadedImage(data?.data?.url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, data, assets]);

  useEffect(() => {
    if (
      docValue &&
      assetId &&
      docStatus !== UserDocumentStatus.RequiredReview
    ) {
      field.onChange({ inputId: name, assetId: assetId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId, docStatus, docValue, name]);

  const renderName = () => {
    if (docValue && docStatus !== UserDocumentStatus.RequiredReview) {
      return docValue;
    } else {
      return file && file.name
        ? file?.name
        : translate('auth>inputFile>selectFile');
    }
  };

  useEffect(() => {
    if (fileRejections.length) {
      field.onChange({ inputId: undefined, assetId: undefined });
      setFile(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileRejections.length]);

  return (
    <div className="pw-w-full pw-flex pw-items-center pw-justify-center">
      <div className="pw-max-w-[504px] pw-w-full pw-flex pw-flex-col pw-items-center pw-justify-center pw-p-[30px]">
        <LabelWithRequired name={name} required={required}>
          {textTitle ? textTitle : 'Enviar foto'}
        </LabelWithRequired>

        <p className="pw-text-base pw-leading-[18px] pw-text-[#353945] pw-font-medium pw-mb-5 pw-opacity-75">
          {title}
        </p>
        <div className="pw-w-full pw-max-w-[436px] pw-h-[175px] pw-rounded-md pw-mb-5 pw-flex pw-items-center pw-justify-center">
          <img
            className="pw-max-w-[436px] pw-h-[175px] pw-rounded-md"
            src={docValue || uploadedImage || imagePlaceholder || ''}
            alt=""
          />
        </div>
        <p className="pw-text-base pw-font-medium pw-mb-2 pw-text-[#353945]">
          {subtitle}
        </p>
        <div
          className="pw-mt-5 pw-text-[#353945] pw-mb-2"
          dangerouslySetInnerHTML={{ __html: instructions || '' }}
        ></div>
        <FormItemContainer
          disableClasses={readonly}
          invalid={isError || mutateError || fieldState.invalid}
          className="pw-max-w-[436px] pw-w-full"
        >
          <div
            className={classNames(
              'pw-mt-1 pw-text-base pw-h-11 pw-max-w-[436px] pw-flex pw-gap-x-2 pw-items-center pw-text-[#969696] pw-leading-4 pw-w-full !pw-rounded-lg pw-outline-none pw-bg-transparent autofill:pw-bg-transparent disabled:pw-cursor-default',
              `${readonly ? '' : 'pw-px-[10px]'}`
            )}
            {...getRootProps()}
          >
            <input
              {...getInputProps()}
              className="pw-w-full"
              readOnly={
                (docStatus && validateIfStatusKycIsReadonly(docStatus)) ||
                readonly
              }
            />
            {isLoadingUpload || isLoadingAsset ? (
              <div className="pw-w-full pw-flex pw-items-center pw-justify-center">
                <Spinner className="pw-w-4 pw-h-4 !pw-border-2" />
              </div>
            ) : (
              <p className="!pw-text-[13px] pw-text-[#777E8F] pw-ml-2 pw-w-[90%]  pw-text-base pw-leading-4 pw-font-normal pw-line-clamp-1">
                {openDocs ? (
                  <a href={docValue} target="_blank" rel="noreferrer">
                    {docValue}
                  </a>
                ) : (
                  renderName()
                )}
              </p>
            )}
          </div>
        </FormItemContainer>

        {!hidenValidations && (
          <div className="pw-mt-[5px] pw-h-[16px]">
            {field.value || Boolean(fileRejections.length) ? (
              <InputStatus
                invalid={
                  isError || mutateError || Boolean(fileRejections.length)
                }
                errorMessage={
                  fileRejections.length
                    ? translate('auth>inputFile>aceptFile')
                    : ''
                }
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputImage;
