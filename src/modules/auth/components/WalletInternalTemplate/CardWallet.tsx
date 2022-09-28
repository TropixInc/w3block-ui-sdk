import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import { ReactComponent as CopyIcon } from '../../../shared/assets/icons/copyIconOutlined.svg';
import { ReactComponent as DollarIcon } from '../../../shared/assets/icons/dollarOutlined.svg';
import Skeleton from '../../../shared/components/Skeleton/Skeleton';
import useTranslation from '../../../shared/hooks/useTranslation';

export const CardWallet = ({
  showValue,
  value,
  title,
  walletAddress,
  textButton,
  onClick,
}: {
  showValue: boolean;
  value: string;
  title: string;
  walletAddress: string;
  textButton?: string;
  onClick?: () => void;
}) => {
  const [state, copyToClipboard] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);
  const [translate] = useTranslation();
  const handleCopy = () => {
    copyToClipboard(walletAddress);
    if (!state.error) setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };
  return (
    <div className="pw-border pw-border-[#E4E4E4] pw-p-4 pw-rounded-[14px] pw-gap-[10px] pw-w-full pw-flex pw-flex-col">
      <div className="pw-w-full pw-text-[24px] pw-leading-[29px] pw-font-bold">
        {title}
      </div>
      <div className="pw-w-full pw-flex pw-relative pw-items-center">
        <span className="pw-text-[#383857] pw-font-semibold pw-text-[14px] pw-leading-[17px]">
          {translate('components>menu>wallet')}
        </span>
        <p className="pw-text-[14px] pw-leading-[17px] pw-text-[#777E8F] pw-mx-1">
          {walletAddress.substring(0, 8)}
          {'...'}
          {walletAddress.substring(
            walletAddress.length - 6,
            walletAddress.length
          )}
        </p>
        <button onClick={handleCopy}>
          <CopyIcon width={17} height={17} className="pw-stroke-[#B09C60]" />
        </button>
        {isCopied && (
          <span className="pw-absolute pw-right-3 pw-top-5 pw-bg-[#E6E8EC] pw-py-1 pw-px-2 pw-rounded-md">
            {translate('components>menu>copied')}
          </span>
        )}
      </div>
      <div className="pw-w-full pw-border pw-border-[#E4E4E4] pw-rounded-[14px] pw-p-4">
        <div className="pw-flex pw-gap-2 pw-text-[#383857] pw-text-[14px] pw-leading-[17px] pw-font-semibold">
          <div className="pw-w-[18px] pw-h-[18px] pw-rounded-full pw-bg-[#383857] pw-flex pw-justify-center pw-items-center">
            <DollarIcon />
          </div>
          {translate('wallet>page>balance')}
        </div>
        <div className="pw-font-bold pw-text-[24px] pw-leading-[29px] pw-text-[#B09C60]">
          {showValue ? `R$ ${parseFloat(value).toFixed(2)}` : '*****'}
        </div>
      </div>
      {textButton ? (
        <button
          className="pw-w-full pw-border pw-border-[#DCDCDC] pw-bg-[#EFEFEF] pw-rounded-[48px] pw-py-[12.5px]"
          onClick={onClick}
        >
          {textButton}
        </button>
      ) : null}
    </div>
  );
};

const CardSkeleton = () => {
  return (
    <div className="pw-border pw-border-[#E4E4E4] pw-p-4 pw-rounded-[14px] pw-gap-[10px] pw-w-full pw-flex pw-flex-col">
      <Skeleton className="pw-w-[150px] pw-h-7" />
      <div className="pw-w-full pw-flex pw-relative pw-items-center pw-gap-1">
        <Skeleton className="pw-w-[60px] pw-h-4" />
        <Skeleton className="pw-w-[125px] pw-h-4" />
        <Skeleton className="pw-w-4 pw-h-4" />
      </div>
      <div className="pw-w-full pw-border pw-border-[#E4E4E4] pw-rounded-[14px] pw-p-4">
        <div className="pw-flex pw-flex-col pw-gap-2">
          <div className="pw-flex pw-gap-2">
            <Skeleton className="pw-w-[18px] pw-h-[18px] pw-rounded-full" />
            <Skeleton className="pw-w-[50px] pw-h-4" />
          </div>
          <Skeleton className="pw-w-[100px] pw-h-4" />
        </div>
      </div>
      <Skeleton className="pw-w-full pw-rounded-[48px] pw-h-[50px]" />
    </div>
  );
};

CardWallet.Skeleton = CardSkeleton;
