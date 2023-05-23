/* eslint-disable no-useless-escape */
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useController } from 'react-hook-form';
import { useWindowSize } from 'react-use';
import WebCam from 'react-webcam';

import {
  AssetTargetEnum,
  AssetTypeEnum,
  UserDocumentStatus,
} from '@w3block/sdk-id';

import { ErrorMessage } from '../../../../checkout/components/ErrorMessage/ErrorMessage';
import { ReactComponent as UserIcon } from '../../../assets/icons/userOutlined.svg';
import { useCompanyConfig } from '../../../hooks/useCompanyConfig';
import useUploadAssets from '../../../hooks/useUploadAssets/useUploadAssets';
import { useUploadFileToCloudinary } from '../../../hooks/useUploadFileToCloudinary';
import { ModalBase } from '../../ModalBase';
import { Spinner } from '../../Spinner';
import { WeblockButton } from '../../WeblockButton/WeblockButton';

interface InputMultiFaceProps {
  label: string;
  name: string;
  docValue?: string;
  assetId?: string | null;
  docStatus?: UserDocumentStatus;
  subtitle?: string;
  acceptTypesDocs: Array<string>;
  onChangeUploadProgess: (value: boolean) => void;
}

export const InputMultiFace = ({
  name,
  label,
  subtitle,
}: InputMultiFaceProps) => {
  const { companyId: tenantId } = useCompanyConfig();
  const { height, width } = useWindowSize();
  const { field } = useController({ name });
  const [loading, setLoading] = useState(true);
  const [openWebcam, setOpenWebcam] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>();
  const [fileT, setFile] = useState<File>();
  const [userMediaError, setUserMediaError] = useState('');
  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    const imageUrl = (webcamRef as any).current?.getScreenshot();
    urltoFile(imageUrl, 'selfie_teste.png').then((fileRes) => {
      setFile(fileRes);
      setImgSrc(URL.createObjectURL(fileRes));
      getAssetInfoToUpload();
    });
  }, [webcamRef]);

  const retake = () => {
    setLoading(true);
    setImgSrc(undefined);
    setFile(undefined);
  };

  const retakeOrTake = () => {
    setOpenWebcam(true);
  };

  const {
    mutate: mutateAssets,
    data: assets,
    isError: mutateError,
  } = useUploadAssets();

  const { mutate, data, isSuccess, isError } = useUploadFileToCloudinary();

  useEffect(() => {
    if (assets?.data?.providerUploadParams && fileT) {
      mutate({
        file: fileT,
        config: {},
        assets: assets.data,
      });
    }
  }, [assets]);

  useEffect(() => {
    if (isSuccess && data && assets?.data?.id) {
      field.onChange({ inputId: name, assetId: assets?.data?.id });
    }
  }, [data, isSuccess]);

  const getAssetInfoToUpload = async () => {
    mutateAssets({
      tenantId,
      body: {
        type: AssetTypeEnum.Image,
        target: AssetTargetEnum.UserDocument,
      },
    });
  };

  const onUserMediaError = (error: string | DOMException) => {
    setLoading(false);
    setUserMediaError(error.toString());
  };

  const isLandscape = useMemo(() => {
    if (width > height) {
      return true;
    }
    return false;
  }, [height, width]);

  return (
    <>
      <div className="">
        <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
          {label}
        </p>

        <div className="pw-flex pw-gap-x-6 ">
          <div
            onClick={() => setOpenWebcam(true)}
            className="pw-min-w-[120px] pw-h-[180px] pw-rounded-2xl pw-overflow-hidden pw-cursor-pointer"
          >
            {imgSrc ? (
              <img className="" src={imgSrc} alt="Selfie photo" />
            ) : (
              <div className="pw-w-full pw-h-full pw-flex pw-justify-center pw-items-center pw-bg-slate-200">
                <UserIcon className="pw-w-[40px] pw-h-[40px] pw-stroke-white" />
              </div>
            )}
          </div>
          <div>
            <p className="pw-text-[13px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1 pw-opacity-75">
              {subtitle}
            </p>
            <WeblockButton
              className="pw-mt-4 pw-text-white"
              onClick={() => retakeOrTake()}
            >
              {imgSrc ? 'Modificar' + label : 'Tirar ' + label}
            </WeblockButton>
          </div>
        </div>
      </div>
      <ModalBase
        classes={{
          dialogCard:
            '!pw-max-w-[350px] !sm:pw-max-w-[600px] !pw-w-[350px] !sm:pw-w-[400px] !pw-p-[0px]',
        }}
        isOpen={openWebcam}
        onClose={() => {
          if (!imgSrc) {
            setLoading(true);
          }
          setOpenWebcam(false);
        }}
      >
        <div className="pw-flex pw-items-center pw-justify-end pw-flex-col pw-rounded-xl pw-overflow-hidden">
          {loading && (
            <div className="pw-flex pw-justify-center pw-items-center pw-py-7">
              <Spinner className="pw-my-12" />
            </div>
          )}
          {userMediaError != '' && (
            <ErrorMessage
              className="pw-px-4"
              title="Erro ao iniciar a camera"
              message={`Verifique se este site tem autorização para utilizar a camera. Após autorização recarregue a página! ${userMediaError}`}
            ></ErrorMessage>
          )}
          <div className=" pw-w-full">
            {imgSrc ? (
              <div className="pw-rounded-xl pw-overflow-hidden">
                <img src={imgSrc} alt="" />
                <div className="pw-relative">
                  <div className="pw-absolute pw-z-10 pw-flex pw-justify-center pw-gap-x-3 pw-bottom-[16px] pw-w-full">
                    <WeblockButton
                      className="!pw-bg-white !pw-text-brand-primary"
                      onClick={() => retake()}
                    >
                      Refazer
                    </WeblockButton>
                    <WeblockButton
                      className="!pw-text-white"
                      onClick={() => setOpenWebcam(false)}
                    >
                      Usar {label}
                    </WeblockButton>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pw-rounded-xl pw-overflow-hidden">
                {!isLandscape ? (
                  <WebCam
                    onUserMediaError={onUserMediaError}
                    screenshotFormat="image/jpeg"
                    onUserMedia={() => {
                      setUserMediaError('');
                      setLoading(false);
                    }}
                    ref={webcamRef}
                    audio={false}
                    screenshotQuality={0.9}
                    videoConstraints={{
                      width: {
                        min: 400,
                      },
                      height: {
                        min: 650,
                      },
                      aspectRatio: 1.625,
                      facingMode: 'user',
                    }}
                    width={userMediaError != '' ? 0 : 400}
                    height={userMediaError != '' ? 0 : 650}
                  />
                ) : (
                  <WebCam
                    onUserMediaError={onUserMediaError}
                    screenshotFormat="image/jpeg"
                    onUserMedia={() => {
                      setUserMediaError('');
                      setLoading(false);
                    }}
                    ref={webcamRef}
                    audio={false}
                    screenshotQuality={0.9}
                    videoConstraints={{
                      width: {
                        min: 400,
                      },
                      height: {
                        min: 650,
                      },
                      aspectRatio: 0.615,
                      facingMode: 'user',
                    }}
                    width={userMediaError != '' ? 0 : 400}
                    height={userMediaError != '' ? 0 : 650}
                  />
                )}

                {!loading && (
                  <div className="pw-relative">
                    <div className="pw-w-[220px] pw-h-[310px] pw-border-dashed pw-border-separate pw-border-spacing-4 pw-border-[3px] pw-border-white pw-opacity-[0.4] pw-absolute pw-left-[65px] pw-bottom-[150px] pw-rounded-[100000000px]"></div>
                    <div className="pw-absolute pw-z-10  pw-bottom-[16px] pw-w-full">
                      {(isError || mutateError) && (
                        <div className="pw-px-4 pw-mb-2">
                          <ErrorMessage
                            className="!pw-p-2"
                            title="Erro ao subir a imagem"
                            message="Caso o erro persista entre em contato com a equipe de suporte."
                          ></ErrorMessage>
                        </div>
                      )}
                      {!loading && userMediaError === '' && (
                        <div className="pw-flex pw-justify-center pw-gap-x-3 pw-w-full">
                          <WeblockButton
                            className="!pw-text-white"
                            onClick={() => {
                              capture();
                            }}
                          >
                            Tirar {label}
                          </WeblockButton>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </ModalBase>
    </>
  );
};

function urltoFile(
  url: string,
  filename: string,
  mimeType = 'image/png'
): Promise<File> {
  mimeType = mimeType || (url.match(/^data:([^;]+);/) || '')[1];
  return fetch(url.replace('image/webp', 'image/png'))
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], filename, { type: mimeType });
    });
}
