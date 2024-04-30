import { useCopyToClipboard } from 'react-use';

import { UseThemeConfig } from '../../../storefront/hooks/useThemeConfig/useThemeConfig';
import downloadAndroid from '../../assets/images/downloadAndroid.png';
import downloadApple from '../../assets/images/downloadApple.png';
import { useGetUserByReferral } from '../../hooks/useGetUserByReferral/useGetUserByReferral';
import { useUtms } from '../../hooks/useUtms/useUtms';
import { getMobileOS } from '../../utils/getMobileOs';
import { ModalBase } from '../ModalBase';

export const AppDownloadModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose(): void;
}) => {
  const utm = useUtms();
  const theme = UseThemeConfig();
  const os = getMobileOS();
  const [_, copy] = useCopyToClipboard();
  const { data: referralUser } = useGetUserByReferral(utm?.utm_source);
  const onClickApple = () => {
    if ((document.getElementById('appCheckbox') as HTMLInputElement).checked) {
      copy(window?.location?.href);
    }
  };

  const androidLink =
    theme?.defaultTheme?.configurations?.contentData?.appDownload?.androidLink +
    `&referrer=${utm?.utm_campaign}---${utm?.utm_source}`;
  const appleLink =
    theme?.defaultTheme?.configurations?.contentData?.appDownload?.appleLink;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose}>
      <div className="pw-text-center pw-font-poppins pw-mt-5 pw-p-[15px]">
        {referralUser ? (
          <div className="pw-mb-5">
            <p className="pw-font-bold pw-text-2xl">
              {referralUser?.firstName}
            </p>
            <p className="pw-font-bold pw-text-base">
              {
                theme?.defaultTheme?.configurations?.contentData?.appDownload
                  ?.referrelText
              }
            </p>
          </div>
        ) : null}
        <img
          src={
            theme?.defaultTheme?.configurations?.contentData?.appDownload?.logo
          }
          height={75}
          alt="logo"
          className="pw-max-h-[75px] pw-mx-auto pw-mb-5"
        />
        <p className="pw-font-bold pw-text-base">
          {theme?.defaultTheme?.configurations?.contentData?.appDownload?.title}
        </p>
        <p className="pw-text-base">
          {
            theme?.defaultTheme?.configurations?.contentData?.appDownload
              ?.subtitle
          }
        </p>
        <div className="pw-border pw-border-[#DFDFDF] pw-my-[15px]"></div>
        <p className="pw-text-sm pw-mb-5">
          {theme?.defaultTheme?.configurations?.contentData?.appDownload?.text}
        </p>
        {os === 'Android' || os === 'Other' ? (
          <a href={androidLink} target="_blank" rel="noreferrer">
            <img
              src={downloadAndroid}
              alt="downloadAndroid"
              height={60}
              className="pw-max-h-[60px] pw-mx-auto"
            />
          </a>
        ) : null}
        {os === 'iOS' || os === 'Other' ? (
          <>
            <a
              href={appleLink}
              target="_blank"
              onClick={onClickApple}
              rel="noreferrer"
            >
              <img
                src={downloadApple}
                alt="downloadApple"
                height={60}
                className="pw-max-h-[60px] pw-mx-auto pw-mb-5"
              />
            </a>
            <div className="pw-border pw-border-[#DFDFDF] pw-my-6"></div>
            <div className="pw-flex pw-item-center pw-justify-center pw-gap-2">
              <input type="checkbox" defaultChecked={true} id="appCheckbox" />
              Copiar link de indicação
            </div>
          </>
        ) : null}
      </div>
    </ModalBase>
  );
};
