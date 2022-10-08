import { MouseEventHandler, useRef } from 'react';
import { useClickAway } from 'react-use';

import classNames from 'classnames';

import { FallbackImage } from '../../../shared/components/FallbackImage';
import { Link } from '../../../shared/components/Link';
import { PrimaryButton } from '../../../shared/components/PrimaryButton';
import { SecondaryButton } from '../../../shared/components/SecondaryButton';
import Skeleton from '../../../shared/components/Skeleton/Skeleton';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useModalController } from '../../../shared/hooks/useModalController';
import { TokenActionsProvider } from '../../providers/TokenActionsProvider';
import { WalletTokenCardActionsPanel } from './ActionsPanel';

interface Props {
  name: string;
  category: string;
  image: string;
  id: string;
  className?: string;
  chainId: number;
  contractAddress: string;
  hasPass?: boolean;
  hasActived?: boolean;
}

const cardClassName =
  'pw-p-[18px] pw-rounded-[20px] pw-border pw-border-[#E6E8EC] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] hover:pw-border-[#295BA6] hover:pw-cursor-pointer';

const descriptionContainerClassName =
  'pw-w-full pw-flex pw-flex-col pw-gap-y-2.5 pw-mt-2.5';

export const WalletTokenCard = ({
  category,
  image,
  name,
  id,
  className = '',
  hasPass = false,
  chainId,
  contractAddress,
  hasActived,
}: Props) => {
  const { isOpen, closeModal, openModal } = useModalController();
  const actionsContainerRef = useRef<HTMLDivElement>(null);
  useClickAway(actionsContainerRef, () => {
    if (isOpen) closeModal();
  });

  const onClickOptionsButton: MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.stopPropagation();
    event.preventDefault();
    isOpen ? closeModal() : openModal();
  };

  return (
    <TokenActionsProvider
      collectionId={id}
      collectionName={name}
      imageSrc={image}
      contractAddress={contractAddress}
      name={name}
      chainId={chainId}
      tokenId={id}
    >
      <div
        className={classNames(
          cardClassName,
          'pw-flex pw-flex-col pw-gap-[24px] pw-relative pw-overflow-hidden'
        )}
      >
        <Link
          className={className}
          href={
            PixwayAppRoutes.TOKEN_DETAILS.replace('{tokenId}', id)
              .replace('{contractAddress}', contractAddress)
              .replace('{chainId}', chainId.toString()) as PixwayAppRoutes
          }
        >
          <div className="pw-flex pw-flex-col pw-justify-center pw-items-center pw-gap-[10px]">
            <div className="pw-relative pw-overflow-hidden pw-w-[260px] pw-h-[260px]">
              {hasPass ? (
                <div className="pw-text-[#295BA6] pw-text-[12px] pw-leading-[18px] pw-font-bold pw-bg-[#E5EDF9] pw-border pw-border-[#295ba67f] pw-rounded-full pw-absolute pw-left-[13px] pw-top-[14px] pw-py-1 pw-px-2">
                  Token Pass
                </div>
              ) : null}
              {image ? (
                <img
                  src={image}
                  className="pw-w-[260px] pw-h-[260px] pw-object-cover"
                  alt=""
                />
              ) : (
                <FallbackImage className="pw-h-full pw-max-h-[274px] pw-min-h-[220px]" />
              )}
            </div>

            <div className={descriptionContainerClassName}>
              <p className="pw-text-black pw-font-semibold pw-text-[15px] pw-leading-[22px]">
                {name}
              </p>
              {category ? (
                <p className="pw-text-[#C63535] pw-text-sm pw-leading-[21px] pw-font-semibold pw-lowercase">
                  {category}
                </p>
              ) : null}
            </div>
          </div>
        </Link>
        <div
          className="pw-relative pw-flex pw-justify-between pw-items-center"
          ref={actionsContainerRef}
        >
          <WalletTokenCardActionsPanel isOpen={isOpen} onClose={closeModal} />
          <button
            onClick={onClickOptionsButton}
            type="button"
            className="pw-border pw-border-[#C1C1C1] pw-rounded-[10px] pw-bg-white pw-p-2 pw-flex pw-gap-x-1"
          >
            <Pointer />
            <Pointer />
            <Pointer />
          </button>

          {hasPass ? (
            hasActived ? (
              <PrimaryButton width="small">Utilizar Pass</PrimaryButton>
            ) : (
              <SecondaryButton width="small">Visualizar Pass</SecondaryButton>
            )
          ) : null}
        </div>
      </div>
    </TokenActionsProvider>
  );
};

const Pointer = () => (
  <span className="pw-w-1.5 pw-h-1.5 pw-bg-[#777E8F] pw-rounded-full" />
);

const CardSkeleton = () => {
  return (
    <div className={cardClassName}>
      <Skeleton className="pw-w-[260px] pw-h-[260px]" />
      <div className={descriptionContainerClassName}>
        <Skeleton className="pw-w-full pw-max-w-[150px] pw-h-[20px]" />
        <Skeleton className="pw-w-full pw-max-w-[200px] pw-h-[23px]" />
        <div className="pw-flex pw-justify-between pw-items-center">
          <Skeleton className="pw-w-full pw-max-w-[39px] pw-h-[22px] pw-rounded-full" />
          <Skeleton className="pw-w-full pw-max-w-[130px] pw-h-[22px] pw-rounded-full" />
        </div>
      </div>
    </div>
  );
};

WalletTokenCard.Skeleton = CardSkeleton;
