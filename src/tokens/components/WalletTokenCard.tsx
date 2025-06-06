import { MouseEventHandler, lazy, useRef } from 'react';
import { useClickAway } from 'react-use';

import classNames from 'classnames';
import { Button } from '@headlessui/react';

import { useTranslation } from 'react-i18next';
import { ImageSDK } from '../../modules/shared/components/ImageSDK';
import { PixwayAppRoutes } from '../../modules/shared/enums/PixwayAppRoutes';
import { useModalController } from '../../modules/shared/hooks/useModalController';
import { useRouterConnect } from '../../modules/shared/hooks/useRouterConnect';
import { TokenActionsProvider } from '../providers/TokenActionsProvider';
import { Link } from '../../modules/shared/components/Link';
import { FallbackImage } from '../../modules/shared/components/FallbackImage';
import { WalletTokenCardActionsPanel } from './ActionsPanel';
import Skeleton from '../../modules/shared/components/Skeleton';


interface Props {
  name: string;
  category: string;
  image: string;
  id: string;
  className?: string;
  chainId: number;
  contractAddress: string;
  proccessing?: boolean;
  collectionData?: {
    id: string;
    name: string;
    pass: boolean;
  };
  editionId: string;
}

const cardClassName =
  'pw-bg-white pw-p-[18px] pw-rounded-[20px] pw-border pw-border-[#E6E8EC] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] hover:pw-border-[#295BA6] hover:pw-cursor-pointer';

const descriptionContainerClassName =
  'pw-w-full pw-flex pw-flex-col pw-gap-y-2.5 pw-mt-2.5';

export const WalletTokenCard = ({
  category,
  image,
  name,
  id,
  className = '',
  chainId,
  contractAddress,
  proccessing = false,
  collectionData,
  editionId,
}: Props) => {
  const { isOpen, closeModal, openModal } = useModalController();
  const router = useRouterConnect();
  const actionsContainerRef = useRef<HTMLDivElement>(null);
  useClickAway(actionsContainerRef, () => {
    if (isOpen) closeModal();
  });
  const [translate] = useTranslation();
  const isInternalToken = collectionData !== undefined;

  const hasPass = collectionData?.pass;

  const onClickOptionsButton: MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.stopPropagation();
    event.preventDefault();
    isOpen ? closeModal() : openModal();
  };

  return (
    <TokenActionsProvider
      collectionId={collectionData?.id ?? ''}
      collectionName={name}
      imageSrc={image}
      contractAddress={contractAddress}
      name={name}
      chainId={chainId}
      tokenId={id}
      isInternalToken={isInternalToken}
      editionId={editionId}
    >
      <div
        className={classNames(
          cardClassName,
          'pw-flex pw-flex-col pw-gap-[24px] pw-relative pw-overflow-hidden',
          !isInternalToken &&
            'hover:!pw-border-[#E6E8EC] hover:!pw-cursor-default'
        )}
      >
        <Link
          disabled={proccessing || !isInternalToken}
          className={className}
          href={router.routerToHref(
            PixwayAppRoutes.TOKEN_DETAILS.replace('{tokenId}', id)
              .replace('{contractAddress}', contractAddress)
              .replace('{chainId}', chainId.toString()) as PixwayAppRoutes
          )}
        >
          <div className="pw-flex pw-flex-col pw-justify-center pw-items-center pw-gap-[10px]">
            <div className="pw-relative pw-overflow-hidden pw-w-full">
              {hasPass ? (
                <div className="pw-bg-white pw-absolute pw-left-[13px] pw-top-[14px] pw-rounded-full">
                  <div className="pw-bg-brand-primary/30 pw-text-brand-primary pw-text-[12px] pw-leading-[18px] pw-font-bold pw-border pw-border-brand-primary pw-rounded-full pw-py-1 pw-px-2">
                    {translate('connectTokens>tokensList>tokenPass')}
                  </div>
                </div>
              ) : null}
              {image ? (
                <ImageSDK
                  src={image}
                  className="pw-w-full pw-h-[300px] pw-object-cover pw-rounded-[20px]"
                  width={500}
                  quality="eco"
                />
              ) : (
                <FallbackImage className="pw-h-full pw-max-h-[300px] pw-w-full pw-min-h-[300px] pw-rounded-[20px]" />
              )}
            </div>

            <div className={descriptionContainerClassName}>
              <p
                className={`${
                  name !== '' ? 'pw-text-black' : 'pw-text-gray-500'
                } pw-font-semibold pw-text-[15px] pw-leading-[22px] pw-truncate`}
              >
                {name !== '' ? name : 'Token sem nome'}
              </p>
              {category ? (
                <p className="pw-text-[#C63535] pw-text-sm pw-leading-[21px] pw-font-semibold pw-lowercase">
                  {category}
                </p>
              ) : null}
            </div>
          </div>
        </Link>
        {isInternalToken ? (
          <div
            className="pw-relative pw-flex pw-justify-between pw-items-center"
            ref={actionsContainerRef}
          >
            <WalletTokenCardActionsPanel isOpen={isOpen} onClose={closeModal} />
            <button
              disabled={proccessing}
              onClick={onClickOptionsButton}
              type="button"
              className="pw-border pw-border-[#C1C1C1] pw-rounded-[10px] pw-bg-white pw-p-2 pw-flex pw-gap-x-1"
            >
              {Array(3)
                .fill('')
                .map((_, index) => (
                  <Pointer key={index} />
                ))}
            </button>

            {hasPass && (
              <Button
                disabled={proccessing}
                onClick={() =>
                  router.pushConnect(
                    PixwayAppRoutes.TOKEN_DETAILS.replace('{tokenId}', id)
                      .replace('{contractAddress}', contractAddress)
                      .replace(
                        '{chainId}',
                        chainId.toString()
                      ) as PixwayAppRoutes
                  )
                }
              >
                {translate('connectTokens>tokensList>usePass')}
              </Button>
            )}
          </div>
        ) : (
          <div className="pw-h-[24px]"></div>
        )}
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
