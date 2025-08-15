import { useCallback, useEffect, useState } from 'react';

import { useController } from 'react-hook-form';

import { AssetTypeEnum } from '@w3block/sdk-id';
import classNames from 'classnames';
import useUploadAssetsCommerce from '../../shared/hooks/useUploadAssetsCommerce';
import { useUploadFileToCloudinary } from '../../shared/hooks/useUploadFileToCloudinary';
import { useDropzone } from 'react-dropzone';
import { FormItemContainer } from '../../shared/components/Form/FormItemContainer';
import InputStatus from '../../shared/components/SmartInputs/InputStatus';
import { Spinner } from '../../shared/components/Spinner';
import useTranslation from '../../shared/hooks/useTranslation';


interface InputWithdrawCommerceProps {
  name: string;
  onChangeUploadProgess: (value: boolean) => void;
  acceptTypes?: Array<string>;
  textTitle?: string;
}

const InputWithdrawCommerce = ({
  name,
  onChangeUploadProgess,
  acceptTypes,
  textTitle,
}: InputWithdrawCommerceProps) => {
  const [translate] = useTranslation();
  const [uploadedImage, setUploadedImage] = useState<string>();
  const { field, fieldState } = useController({ name });
  const [file, setFile] = useState<File | undefined>();

  const {
    mutate: mutateAssets,
    data: assets,
    isError: mutateError,
    isPending: isLoadingAsset,
  } = useUploadAssetsCommerce();

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
      const type = acceptedFiles[0]?.type?.includes('pdf')
        ? AssetTypeEnum.Document
        : AssetTypeEnum.Image;
      mutateAssets({
        type: type,
        target: 'withdraw',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    accept: acceptTypes as any,
  });

  useEffect(() => {
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

  const renderName = () => {
    return file && file.name
      ? file?.name
      : translate('auth>inputFile>selectFile');
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
      <div className="pw-mb-3 pw-max-w-[504px] pw-w-full pw-flex pw-flex-col pw-items-center pw-justify-center pw-p-[30px]">
        <p className="pw-text-6 pw-leading-[18px] pw-text-[#353945] pw-font-bold pw-mb-5">
          {textTitle}
        </p>
        {uploadedImage && !uploadedImage.includes('pdf') ? (
          <div className="pw-w-full pw-max-w-[436px] pw-h-[175px] pw-rounded-md pw-mb-5 pw-flex pw-items-center pw-justify-center">
            <img
              className="pw-max-w-[436px] pw-h-[175px] pw-rounded-md"
              src={uploadedImage}
              alt=""
            />
          </div>
        ) : null}
        <FormItemContainer
          invalid={isError || mutateError || !field.value || fieldState.invalid}
          className="pw-max-w-[436px] pw-w-full"
        >
          <div
            className={classNames(
              'pw-mt-1 pw-text-base pw-h-11 pw-max-w-[436px] pw-flex pw-gap-x-2 pw-items-center pw-text-[#969696] pw-leading-4 pw-w-full pw-shadow-[0_4px_15px_#00000012] !pw-rounded-lg pw-outline-none pw-bg-transparent pw-px-[10px] autofill:pw-bg-transparent disabled:pw-cursor-default'
            )}
            {...getRootProps()}
          >
            <input {...getInputProps()} className="pw-w-full" />
            {isLoadingUpload || isLoadingAsset ? (
              <div className="pw-w-full pw-flex pw-items-center pw-justify-center">
                <Spinner className="pw-w-4 pw-h-4 !pw-border-2" />
              </div>
            ) : (
              <p className="!pw-text-[13px] pw-text-[#777E8F] pw-ml-2 pw-w-[90%]  pw-text-base pw-leading-4 pw-font-normal pw-line-clamp-1">
                {renderName()}
              </p>
            )}
          </div>
        </FormItemContainer>

        <div className="pw-mt-1 pw-ml-1 pw-w-full">
          {isError ||
          mutateError ||
          field.value ||
          Boolean(fileRejections.length) ? (
            <InputStatus
              invalid={isError || mutateError || Boolean(fileRejections.length)}
              errorMessage={
                isError || mutateError || Boolean(fileRejections.length)
                  ? 'Erro ao subir o arquivo'
                  : ''
              }
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default InputWithdrawCommerce;
