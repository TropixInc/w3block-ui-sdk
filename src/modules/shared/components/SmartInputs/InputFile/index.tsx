import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useController } from 'react-hook-form';

import { AssetTargetEnum, AssetTypeEnum } from '@w3block/sdk-id';
import classNames from 'classnames';

import AuthFormController from '../../../../auth/components/AuthFormController/AuthFormController';
import { ReactComponent as FileIcon } from '../../../assets/icons/fileOutlined.svg';
import { useCompanyConfig } from '../../../hooks/useCompanyConfig';
import useTranslation from '../../../hooks/useTranslation';
import useUploadAssets from '../../../hooks/useUploadAssets/useUploadAssets';
import { useUploadFileToCloudinary } from '../../../hooks/useUploadFileToCloudinary';

interface InputFileProps {
  label: string;
  name: string;
  docValue?: string;
  assetId?: string | null;
}

const InputFile = ({ label, name, docValue, assetId }: InputFileProps) => {
  const [translate] = useTranslation();
  const [isInvalidFile, _] = useState(false);
  const { field } = useController({ name });
  const [file, setFile] = useState<File | undefined>();
  const { companyId: tenantId } = useCompanyConfig();

  const { mutate: mutateAssets, data: assets } = useUploadAssets();

  const { mutate, data, isSuccess } = useUploadFileToCloudinary();

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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ['.png', '.jpeg', '.jpg', '.pdf'],
    disabled: Boolean(docValue),
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
    if (docValue && assetId) {
      field.onChange({ inputId: name, assetId: assetId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docValue]);

  const renderName = () => {
    if (docValue) {
      return docValue;
    } else {
      return file && file.name
        ? file?.name
        : translate('auth>inputFile>selectFile');
    }
  };

  return (
    <div className="pw-mb-3">
      <AuthFormController label={label} name={name}>
        <div
          className={classNames(
            'pw-mt-1 pw-text-base pw-h-[46px] pw-flex pw-gap-x-2 pw-items-center pw-text-[#969696] pw-leading-4 pw-w-full pw-shadow-[0_4px_15px_#00000012] pw-outline-1 pw-rounded-lg pw-outline-none pw-bg-transparent pw-px-[10px] autofill:pw-bg-transparent disabled:pw-cursor-default',
            !isInvalidFile ? 'pw-outline-brand-primary' : 'pw-outline-[#FF0505]'
          )}
          {...getRootProps()}
        >
          <input {...getInputProps()} readOnly={Boolean(docValue)} />
          <FileIcon className="pw-w-4" />
          <p className="!pw-text-[13px] pw-text-[#777E8F] pw-ml-2 pw-w-[90%]  pw-text-base pw-leading-4 pw-font-normal pw-line-clamp-1">
            {renderName()}
          </p>
        </div>
      </AuthFormController>
    </div>
  );
};

export default InputFile;
