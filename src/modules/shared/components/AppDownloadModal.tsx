import { useCopyToClipboard } from 'react-use';

import downloadAndroid from '../assets/images/downloadAndroid.png';
import downloadApple from '../assets/images/downloadApple.png';

import { useUtms } from '../hooks/useUtms';
import { ModalBase } from './ModalBase';
import { Spinner } from './Spinner';
import { useThemeConfig } from '../../storefront/hooks/useThemeConfig';
import { getMobileOS } from '../utils/getMobileOs';
import { useGetUserByReferral } from '../hooks/useGetUserByReferral';
import useTranslation from '../hooks/useTranslation';

export const AppDownloadModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose(): void;
}) => {
  const utm = useUtms();
  const theme = useThemeConfig();
  const [translate] = useTranslation();
  const os = getMobileOS();
  const [_, copy] = useCopyToClipboard();
  const { data: referralUser, isLoading } = useGetUserByReferral({
    referralCode: utm?.utm_source,
  });
  const onClickApple = () => {
    if (
      (document.getElementById('appCheckbox') as HTMLInputElement).checked &&
      referralUser
    ) {
      copy(
        `${window?.location?.protocol}//${window?.location?.hostname}/?utm_campaign=${utm.utm_campaign}&utm_source=${utm.utm_source}`
      );
    }
  };

  const androidLink =
    theme?.defaultTheme?.configurations?.contentData?.appDownload?.androidLink +
    `&referrer=${utm?.utm_campaign}---${utm?.utm_source}`;
  const appleLink =
    theme?.defaultTheme?.configurations?.contentData?.appDownload?.appleLink;

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      classes={{ classComplement: '!pw-z-[9999]', backdrop: '!pw-z-[999]' }}
      hideCloseButton
    >
      <div className="pw-text-center pw-font-poppins pw-mt-5 pw-p-[15px]">
        {isLoading || (utm.utm_source && !referralUser) ? (
          <div className="pw-h-[350px] pw-flex pw-justify-center pw-items-center">
            <Spinner className="pw-h-10 pw-w-10" />
          </div>
        ) : (
          <>
            {referralUser ? (
              <div className="pw-mb-5">
                <p className="pw-font-bold pw-text-2xl">
                  {referralUser?.firstName}
                </p>
                <p className="pw-font-bold pw-text-base">
                  {
                    theme?.defaultTheme?.configurations?.contentData
                      ?.appDownload?.referrelText
                  }
                </p>
              </div>
            ) : null}
            <img
              src={
                theme?.defaultTheme?.configurations?.contentData?.appDownload
                  ?.logo
              }
              height={75}
              alt="logo"
              className="pw-max-h-[75px] pw-mx-auto pw-mb-5"
            />
            <p className="pw-font-bold pw-text-base">
              {
                theme?.defaultTheme?.configurations?.contentData?.appDownload
                  ?.title
              }
            </p>
            <p className="pw-text-base">
              {
                theme?.defaultTheme?.configurations?.contentData?.appDownload
                  ?.subtitle
              }
            </p>
            <div className="pw-border pw-border-[#DFDFDF] pw-my-[15px]"></div>
            <p className="pw-text-sm pw-mb-5">
              {
                theme?.defaultTheme?.configurations?.contentData?.appDownload
                  ?.text
              }
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
                {referralUser ? (
                  <>
                    <div className="pw-border pw-border-[#DFDFDF] pw-my-6"></div>
                    <div className="pw-flex pw-item-center pw-justify-center pw-gap-2">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        id="appCheckbox"
                      />
                      {translate('shared>appDownloadModal>copyIndicateLink')}
                    </div>
                  </>
                ) : null}
              </>
            ) : null}
          </>
        )}
      </div>
    </ModalBase>
  );
};
