'use client';
import { useCopyToClipboard } from 'react-use';

import downloadApple from '../../shared/assets/images/downloadApple.png';
import downloadAndroid from '../../shared/assets/images/downloadAndroid.png';

import { useUtms } from '../hooks/useUtms';
import { ModalBase } from './ModalBase';
import { Spinner } from './Spinner';
import { useThemeConfig } from '../../storefront/hooks/useThemeConfig';
import { useGetMobileOS } from '../hooks/useGetMobileOs';
import { useGetUserByReferral } from '../hooks/useGetUserByReferral';
import useTranslation from '../hooks/useTranslation';

export const AppDownloadModal = ({
  isOpen,
  onClose,
  themeData,
}: {
  isOpen: boolean;
  onClose(): void;
  themeData?: any;
}) => {
  const utm = useUtms();
  const themeContext = useThemeConfig();
  const theme = themeData || themeContext?.defaultTheme;
  const [translate] = useTranslation();
  const os = useGetMobileOS();
  const [_, copy] = useCopyToClipboard();
  const { data: referralUser, isFetching } = useGetUserByReferral({
    referralCode: utm?.utm_source,
  });

  const onClickApple = () => {
    if ((document.getElementById('appCheckbox') as HTMLInputElement).checked) {
      copy(
        `${window?.location?.protocol}//${window?.location?.hostname}/?utm_campaign=${utm.utm_campaign}&utm_source=${utm.utm_source}`
      );
    }
  };

  const androidLink =
    theme?.configurations?.contentData?.appDownload?.androidLink +
    `&referrer=${utm?.utm_campaign}---${utm?.utm_source}`;
  const appleLink = theme?.configurations?.contentData?.appDownload?.appleLink;

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      clickAway={false}
      classes={{
        classComplement: '!pw-z-[9999]',
        backdrop: '!pw-z-[999]',
      }}
      backdropStyle={{ backgroundColor: 'rgba(0, 80, 87, 1)' }}
      hideCloseButton
    >
      <div className="pw-text-center pw-font-poppins pw-mt-5 pw-p-[15px]">
        <>
          <div className="pw-mb-5">
            {isFetching ||
            !utm.utm_source ||
            (utm.utm_source && !referralUser) ? (
              <div
                className="pw-w-[150px] pw-h-[32px] pw-mx-auto pw-animate-pulse pw-rounded-2xl"
                style={{ backgroundColor: '#005057' }}
              ></div>
            ) : (
              <p className="pw-font-bold pw-text-2xl">
                {referralUser?.firstName}
              </p>
            )}
            <p className="pw-font-bold pw-text-base">
              {theme?.configurations?.contentData?.appDownload?.referrelText}
            </p>
          </div>
          <img
            src={theme?.configurations?.contentData?.appDownload?.logo}
            height={75}
            alt="logo"
            className="pw-max-h-[75px] pw-mx-auto pw-mb-5"
          />
          <p className="pw-font-bold pw-text-base">
            {theme?.configurations?.contentData?.appDownload?.title}
          </p>
          <p className="pw-text-base">
            {theme?.configurations?.contentData?.appDownload?.subtitle}
          </p>
          <div className="pw-border pw-border-[#DFDFDF] pw-my-[15px]"></div>
          <p className="pw-text-sm pw-mb-5">
            {theme?.configurations?.contentData?.appDownload?.text}
          </p>
          {os === 'Android' || os === 'Other' ? (
            <>
              <a href={androidLink} target="_blank" rel="noreferrer">
                <img
                  src={downloadAndroid}
                  alt="downloadAndroid"
                  height={60}
                  className="pw-max-h-[60px] pw-mx-auto"
                />
              </a>
            </>
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
            </>
          ) : null}
        </>
      </div>
    </ModalBase>
  );
};
