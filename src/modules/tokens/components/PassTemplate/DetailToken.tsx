import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import { ReactComponent as LinkIcon } from '../../../shared/assets/icons/boxWithUpRightArrowFilled.svg';
import { ReactComponent as CopyIcon } from '../../../shared/assets/icons/copyIcon.svg';
import useTranslation from '../../../shared/hooks/useTranslation';

export const DetailToken = ({
  title,
  description,
  titleLink,
  copyDescription,
}: {
  title: string;
  titleLink?: string;
  description: string;
  copyDescription?: boolean;
}) => {
  const [state, copyToClipboard] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);
  const [translate] = useTranslation();

  const handleCopy = () => {
    copyToClipboard(description);
    if (!state.error) setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="pw-w-full pw-flex pw-flex-col pw-justify-center pw-items-center pw-rounded-[16px] pw-p-[24px] pw-gap-[9px] pw-shadow-[0px_4px_15px_rgba(0,0,0,0.07)] ">
      <div className="pw-text-[#353945] pw-font-semibold pw-text-[15px] pw-leading-[22.5px] pw-flex pw-gap-[8px] pw-justify-center pw-items-center">
        {title}{' '}
        {titleLink ? (
          <a href={titleLink} target="_blank" rel="noreferrer">
            <LinkIcon className="pw-fill-[#295BA6]" />
          </a>
        ) : null}
      </div>
      {description ? (
        <div
          className={
            'pw-relative pw-text-[#353945] pw-font-normal pw-text-[14px] pw-leading-[21px] pw-flex pw-items-center pw-text-center pw-gap-1'
          }
        >
          {description}
          {copyDescription ? <CopyIcon onClick={() => handleCopy()} /> : null}
          {isCopied && (
            <span className="pw-absolute pw-right-3 pw-top-5 pw-bg-[#E6E8EC] pw-py-1 pw-px-2 pw-rounded-md">
              {translate('components>menu>copied')}
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
};
