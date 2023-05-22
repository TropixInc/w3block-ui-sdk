/* eslint-disable no-useless-escape */
import { useState, useRef, useCallback, useEffect } from 'react';
import { useController } from 'react-hook-form';
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
              {imgSrc ? 'Tirar outra ' + label : 'Tirar ' + label}
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
                      min: 800,
                    },
                    height: {
                      min: 600,
                    },
                    aspectRatio: !mobileAndTabletCheck() ? 0.615 : 1.625,
                    facingMode: 'user',
                  }}
                  width={userMediaError != '' ? 0 : 400}
                  height={userMediaError != '' ? 0 : 650}
                />
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

function mobileAndTabletCheck() {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || (window as any)?.opera);
  return check;
}
