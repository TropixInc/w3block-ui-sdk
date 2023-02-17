import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import classNames from 'classnames';

import AuthFormController from '../../../../auth/components/AuthFormController/AuthFormController';
import { ReactComponent as FileIcon } from '../../../assets/icons/fileOutlined.svg';
import { useUploadFileToCloudinary } from '../../../hooks/useUploadFileToCloudinary';

interface InputFileProps {
  label: string;
  name: string;
}

const InputFile = ({ label, name }: InputFileProps) => {
  const [isInvalidFile, _] = useState(false);
  const [file, setFile] = useState<File | undefined>();

  const cloudFile = useUploadFileToCloudinary(file as File).then((res) => res);

  const onDrop = useCallback((acceptedFiles: string | any[]) => {
    if (acceptedFiles.length) setFile(acceptedFiles[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  useEffect(() => {
    if (file) {
      console.log(cloudFile);
    }
  }, [file]);

  return (
    <div className="pw-mb-3">
      <AuthFormController label={label} name={name}>
        <div
          className={classNames(
            '!pw-px-[10px] !pw-py-[14px]  pw-rounded-md pw-h-[45px] pw-flex pw-gap-x-[9px] pw-items-center pw-w-full pw-border-[#94B8ED] pw-border pw-outline-none pw-bg-transparent',
            !isInvalidFile ? 'pw-border-[#94B8ED]' : 'pw-border-[#C63535]'
          )}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <FileIcon />
          <p className="!pw-text-[13px] pw-text-[#777E8F]  pw-text-base pw-leading-4 pw-font-normal">
            Selecionar arquivo
          </p>
        </div>
      </AuthFormController>
      {file && <p className="pw-text-[13px] pw-text-[#353945]">{file.name}</p>}
    </div>
  );
};

export default InputFile;
