import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCopyToClipboard, useLocation } from 'react-use';

import { AuthButton } from '../../../auth/components/AuthButton';
import CopyIcon from '../../../shared/assets/icons/copy.svg?react';
import useIsMobile from '../../../shared/hooks/useIsMobile/useIsMobile';
import { useProfileWithKYC } from '../../../shared/hooks/useProfileWithKYC/useProfileWithKYC';

interface ReferralProps {
  baseSharedPath?: string;
  shareMenssage?: string;
}

export const ReferralWidget = ({
  baseSharedPath,
  shareMenssage,
}: ReferralProps) => {
  const [translate] = useTranslation();
  const isMobile = useIsMobile();
  const { profile } = useProfileWithKYC();
  const { host } = useLocation();
  const [isCopied, setIsCopied] = useState(false);
  const [state, copyToClipboard] = useCopyToClipboard();

  const link = useMemo(() => {
    if (profile) {
      if ((profile as any).referralCode && baseSharedPath) {
        return `https://${host}/${baseSharedPath}/?utm_campaign=m2m&utm_source=${
          (profile as any)?.referralCode
        }`;
      } else if ((profile as any).referralCode) {
        return `https://${host}/?utm_campaign=m2m&utm_source=${
          (profile as any)?.referralCode
        }`;
      } else return '';
    } else return '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, host]);

  const handleCopy = () => {
    copyToClipboard(link);
    if (!state.error) setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleShared = () => {
    if (shareMenssage) {
      copyToClipboard(shareMenssage.replace('{shareLink}', link));
    } else {
      copyToClipboard(link);
    }

    if (!state.error) setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const whatsappLink = shareMenssage
    ? shareMenssage.replace('{shareLink}', link)
    : link;

  return (
    <div className="pw-max-w-[800px] pw-w-full pw-mb-6">
      <div className=" px-w-full pw-border pw-border-dashed pw-mt-2 pw-h-10 pw-border-[#B09C60] pw-rounded-md flex-nowrap pw-px-2 pw-flex pw-items-center pw-justify-between">
        <p className="pw-text-sm pw-w-full pw-overflow-hidden pw-text-ellipsis pw-text-black pw-whitespace-nowrap">
          {isCopied && (
            <span className="pw-text-sm">
              {translate('components>menu>copied')}
            </span>
          )}
          {!isCopied && profile && (profile as any)?.referralCode ? link : null}
        </p>
        <button onClick={() => handleCopy()}>
          <CopyIcon width={15} height={15} className="pw-stroke-slate-500" />
        </button>
      </div>
      <div className="pw-flex pw-gap-x-2 pw-flex-col  pw-mt-2 sm:pw-flex-row">
        <AuthButton
          variant="filled"
          className="pw-w-full pw-flex pw-items-center pw-justify-center sm:pw-w-[50%] !pw-py-0"
        >
          <a
            target="_blank"
            href={
              isMobile
                ? `whatsapp://send?text=${encodeURIComponent(whatsappLink)}`
                : `https://api.whatsapp.com/send?text=${encodeURIComponent(
                    whatsappLink
                  )}`
            }
            data-action="share/whatsapp/share"
            className="pw-p-0 pw-no-underline pw-w-[95%] pw-flex pw-items-center pw-justify-center pw-h-9"
            rel="noreferrer"
          >
            Whatsapp
          </a>
        </AuthButton>
        <AuthButton
          variant="filled"
          className="pw-w-full pw-mt-2 sm:pw-w-[50%] sm:pw-mt-0"
          onClick={() => handleShared()}
        >
          {translate('affiliates>referrakWidget>shared')}
        </AuthButton>
      </div>
    </div>
  );
};
