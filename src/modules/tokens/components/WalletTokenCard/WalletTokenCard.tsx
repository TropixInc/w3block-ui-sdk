import { MouseEventHandler, useRef } from 'react';
import { useClickAway } from 'react-use';

import classNames from 'classnames';

import { FallbackImage } from '../../../shared/components/FallbackImage';
import { Link } from '../../../shared/components/Link';
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
}

const cardClassName =
  'pw-p-[18px] pw-rounded-[20px] pw-border pw-border-[#DCDCDC] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] hover:pw-border-[#295BA6] hover:pw-cursor-pointer pw-w-full';

const descriptionContainerClassName =
  'pw-flex pw-flex-col pw-gap-y-2.5 pw-mt-2.5';

export const WalletTokenCard = ({
  category,
  image,
  name,
  id,
  className = '',
  chainId,
  contractAddress,
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
      contractAddress={contractAddress}
      name={name}
      image={image}
      chainId={chainId}
      tokenId={id}
    >
      <Link
        className={classNames('pw-w-full', className)}
        href={
          PixwayAppRoutes.TOKEN_DETAILS.replace('{tokenId}', id)
            .replace('{contractAddress}', contractAddress)
            .replace('{chainId}', chainId.toString()) as PixwayAppRoutes
        }
      >
        <div className={cardClassName}>
          {image ? (
            <img
              src={image}
              className="pw-w-full pw-min-h-[220px] pw-max-h-[274px] pw-object-cover"
              alt=""
            />
          ) : (
            <FallbackImage className="pw-h-full pw-max-h-[274px] pw-min-h-[220px]" />
          )}

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

          <div className="pw-relative pw-inline" ref={actionsContainerRef}>
            <WalletTokenCardActionsPanel isOpen={isOpen} onClose={closeModal} />
            <button
              onClick={onClickOptionsButton}
              type="button"
              className="pw-border pw-border-[#C1C1C1] pw-rounded-[10px] pw-bg-white pw-p-2 pw-mt-2.5 pw-flex pw-gap-x-1"
            >
              <span className="pw-w-1.5 pw-h-1.5 pw-bg-[#777E8F] pw-rounded-full" />
              <span className="pw-w-1.5 pw-h-1.5 pw-bg-[#777E8F] pw-rounded-full" />
              <span className="pw-w-1.5 pw-h-1.5 pw-bg-[#777E8F] pw-rounded-full" />
            </button>
          </div>
        </div>
      </Link>
    </TokenActionsProvider>
  );
};

const CardSkeleton = () => {
  return (
    <div className={cardClassName}>
      <Skeleton className="pw-w-full pw-min-h-[220px] pw-max-h-[274px]" />
      <div className={descriptionContainerClassName}>
        <Skeleton className="pw-w-full pw-max-w-[200px] pw-h-[23px]" />
        <Skeleton className="pw-w-full pw-max-w-[116px] pw-h-[21px]" />
      </div>
    </div>
  );
};

WalletTokenCard.Skeleton = CardSkeleton;
