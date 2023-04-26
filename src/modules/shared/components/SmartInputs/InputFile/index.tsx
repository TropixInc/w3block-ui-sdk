import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useController } from 'react-hook-form';

import {
  AssetTargetEnum,
  AssetTypeEnum,
  UserDocumentStatus,
} from '@w3block/sdk-id';
import classNames from 'classnames';

import { ReactComponent as FileIcon } from '../../../assets/icons/fileOutlined.svg';
import { useCompanyConfig } from '../../../hooks/useCompanyConfig';
import useTranslation from '../../../hooks/useTranslation';
import useUploadAssets from '../../../hooks/useUploadAssets/useUploadAssets';
import { useUploadFileToCloudinary } from '../../../hooks/useUploadFileToCloudinary';
import { validateIfStatusKycIsReadonly } from '../../../utils/validReadOnlyKycStatus';
import { FormItemContainer } from '../../Form/FormItemContainer';
import InputStatus from '../InputStatus';

interface InputFileProps {
  label: string;
  name: string;
  docValue?: string;
  assetId?: string | null;
  docStatus?: UserDocumentStatus;
  subtitle?: string;
  acceptTypesDocs: Array<string>;
}

const InputFile = ({
  label,
  name,
  docValue,
  assetId,
  docStatus,
  subtitle,
  acceptTypesDocs,
}: InputFileProps) => {
  const [translate] = useTranslation();

  const { field, fieldState } = useController({ name });
  const [file, setFile] = useState<File | undefined>();
  const { companyId: tenantId } = useCompanyConfig();

  const {
    mutate: mutateAssets,
    data: assets,
    isError: mutateError,
  } = useUploadAssets();

  const { mutate, data, isSuccess, isError } = useUploadFileToCloudinary();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDrop = useCallback((acceptedFiles: string | any[]) => {
    if (acceptedFiles.length) {
      setFile(acceptedFiles[0]);
      const type = acceptedFiles[0]?.type?.includes('pdf')
        ? AssetTypeEnum.Document
        : AssetTypeEnum.Image;
      mutateAssets({
        tenantId: tenantId as string,
        body: {
          type: type,
          target: AssetTargetEnum.UserDocument,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    accept: acceptTypesDocs,
    disabled: Boolean(
      docValue && docStatus !== UserDocumentStatus.RequiredReview
    ),
  });

  useEffect(() => {
    if (file && assets?.data?.id) {
      mutate({ file: file, assets: assets.data, config: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets?.data, file]);

  useEffect(() => {
    if (isSuccess && data && assets?.data?.id) {
      field.onChange({ inputId: name, assetId: assets.data.id });
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
    <div className="pw-mb-3">
      <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
        {label}
      </p>
      <p className="pw-text-[13px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1 pw-opacity-75">
        {subtitle}
      </p>
      <FormItemContainer
        invalid={isError || mutateError || !field.value || fieldState.invalid}
      >
        <div
          className={classNames(
            'pw-mt-1 pw-text-base pw-h-[46px] pw-flex pw-gap-x-2 pw-items-center pw-text-[#969696] pw-leading-4 pw-w-full pw-shadow-[0_4px_15px_#00000012] !pw-rounded-lg pw-outline-none pw-bg-transparent pw-px-[10px] autofill:pw-bg-transparent disabled:pw-cursor-default'
          )}
          {...getRootProps()}
        >
          <input
            {...getInputProps()}
            readOnly={docStatus && validateIfStatusKycIsReadonly(docStatus)}
          />
          <FileIcon className="pw-w-4" />
          <p className="!pw-text-[13px] pw-text-[#777E8F] pw-ml-2 pw-w-[90%]  pw-text-base pw-leading-4 pw-font-normal pw-line-clamp-1">
            {renderName()}
          </p>
        </div>
      </FormItemContainer>
      <p className="mt-5">
        {field.value || Boolean(fileRejections.length) ? (
          <InputStatus
            invalid={isError || mutateError || Boolean(fileRejections.length)}
            errorMessage={
              fileRejections.length ? translate('auth>inputFile>aceptFile') : ''
            }
          />
        ) : null}
      </p>
    </div>
  );
};

export default InputFile;
