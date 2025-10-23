import { FC, KeyboardEvent, useMemo, useState } from 'react';

import { Token } from '../interfaces/Token';
import { WalletTokenCard } from './WalletTokenCard';
import { ImageSDK } from '../../shared/components/ImageSDK';
import { BaseButton } from '../../shared/components/Buttons';
import classNames from 'classnames';

export interface GroupedTokensListItem {
  collectionId: string;
  collectionName?: string;
  tokens: Token[];
}

interface GroupedTokensListProps {
  items: GroupedTokensListItem[];
  singleTokens?: Token[];
}

const collectionDescriptionClassName =
  'pw-w-full pw-flex pw-flex-col pw-gap-y-2.5';

interface CollectionSummaryCardProps {
  coverImage: string | null;
  collectionLabel: string;
  tokenCountLabel: string;
  actionLabel: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const CollectionSummaryCard: FC<CollectionSummaryCardProps> = ({
  coverImage,
  collectionLabel,
  tokenCountLabel,
  actionLabel,
  isExpanded,
  onToggle,
}) => {
  const fallbackLetters = useMemo(
    () => collectionLabel.slice(0, 2).toUpperCase(),
    [collectionLabel]
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle();
    }
  };

  if (isExpanded) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        className="pw-bg-white pw-rounded-[20px] pw-border pw-border-[#E6E8EC] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-flex pw-items-center pw-justify-between pw-gap-4 pw-px-6 pw-py-4 pw-transition-all pw-duration-300 pw-shadow-lg pw-scale-[1.02]"
      >
        <div className="pw-flex pw-items-center pw-gap-4">
          <div className="pw-w-[80px] pw-h-[80px] pw-rounded-[20px] pw-overflow-hidden pw-bg-neutral-200">
            {coverImage ? (
              <ImageSDK
                src={coverImage}
                className="pw-w-full pw-h-full pw-object-cover"
                width={120}
                height={120}
                quality="eco"
              />
            ) : (
              <div className="pw-w-full pw-h-full pw-flex pw-items-center pw-justify-center pw-text-base pw-font-semibold pw-text-neutral-500">
                {fallbackLetters}
              </div>
            )}
          </div>
          <div>
            <p className="pw-text-black pw-font-semibold pw-text-[15px] pw-leading-[22px]">
              {collectionLabel}
            </p>
            <p className="pw-text-sm pw-text-neutral-600">{tokenCountLabel}</p>
          </div>
        </div>
        <BaseButton
          type="button"
          size="medium"
          className="!pw-w-min"
          onClick={(event) => {
            event.stopPropagation();
            onToggle();
          }}
        >
          {actionLabel}
        </BaseButton>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      className={classNames(
        'pw-bg-white pw-p-[18px] pw-rounded-[20px] pw-border pw-border-[#E6E8EC] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-flex pw-flex-col pw-gap-[16px] pw-overflow-hidden pw-transition-all pw-duration-300',
        isExpanded
          ? 'pw-shadow-lg pw-scale-[1.02]'
          : 'hover:pw-border-[#295BA6] pw-cursor-pointer'
      )}
    >
      <div className="pw-relative pw-overflow-hidden pw-rounded-[20px] pw-bg-neutral-200 pw-h-[220px]">
        <div className="pw-bg-white pw-absolute pw-left-[13px] pw-top-[14px] pw-rounded-full">
          <div className="pw-bg-brand-primary/30 pw-text-brand-primary pw-text-[12px] pw-leading-[18px] pw-font-bold pw-border pw-border-brand-primary pw-rounded-full pw-py-1 pw-px-2">
            {tokenCountLabel}
          </div>
        </div>
        {coverImage ? (
          <ImageSDK
            src={coverImage}
            className="!pw-w-full pw-h-[300px] pw-object-cover pw-rounded-[20px]"
            width={312}
            quality="eco"
          />
        ) : (
          <div className="pw-w-full pw-h-full pw-flex pw-items-center pw-justify-center pw-text-lg pw-font-semibold pw-text-neutral-500">
            {fallbackLetters}
          </div>
        )}
      </div>
      <div className={collectionDescriptionClassName}>
        <p className="pw-text-black pw-font-semibold pw-text-[15px] pw-leading-[22px] pw-truncate">
          {collectionLabel}
        </p>
        <div className="pw-mt-[22px] pw-flex pw-items-center pw-justify-end">
          <BaseButton
            type="button"
            size="medium"
            className="!pw-w-min"
            onClick={(event) => {
              event.stopPropagation();
              onToggle();
            }}
          >
            {actionLabel}
          </BaseButton>
        </div>
      </div>
    </div>
  );
};

const GroupedTokensList: FC<GroupedTokensListProps> = ({
  items,
  singleTokens = [],
}) => {
  const [expandedCollectionId, setExpandedCollectionId] = useState<string | null>(
    null
  );

  if (!items.length && !singleTokens.length) {
    return null;
  }

  const expandedCollection = expandedCollectionId
    ? items.find((item) => item.collectionId === expandedCollectionId) ?? null
    : null;

  const collapsedCollections = expandedCollection
    ? items.filter(
        (item) => item.collectionId !== expandedCollection.collectionId
      )
    : items;

  const handleToggle = (collectionId: string) => {
    setExpandedCollectionId((previous) =>
      previous === collectionId ? null : collectionId
    );
  };

  const renderCollection = (
    collection: GroupedTokensListItem,
    isExpanded: boolean
  ) => {
    const { collectionId, collectionName, tokens } = collection;
    const coverImage =
      tokens.find((token) => Boolean(token.image))?.image ?? null;
    const collectionLabel = collectionName ?? collectionId;
    const tokenCountLabel = `${tokens.length} ${tokens.length > 1 ? 'tokens' : 'token'
      }`;
    const actionLabel = isExpanded ? 'Recolher coleção' : 'Expandir coleção';

    return (
      <article
        key={collectionId}
        className={classNames(
          'pw-transition-all pw-duration-300 pw-rounded-[20px] pw-w-full',
          isExpanded && 'pw-order-first'
        )}
      >
        <CollectionSummaryCard
          coverImage={coverImage}
          collectionLabel={collectionLabel}
          tokenCountLabel={tokenCountLabel}
          actionLabel={actionLabel}
          isExpanded={isExpanded}
          onToggle={() => handleToggle(collectionId)}
        />
        {isExpanded ? (
          <div className="pw-mt-4 pw-border pw-border-[#E6E8EC] pw-rounded-[20px] pw-bg-white pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-p-5">
            <ul className="pw-grid pw-grid-cols-1 md:pw-grid-cols-2 xl:pw-grid-cols-3 pw-gap-6">
              {tokens.map((token) => (
                <li key={token.id}>
                  <WalletTokenCard
                    collectionData={token.collectionData}
                    category={token.category || ''}
                    image={token.image}
                    name={token.name}
                    id={token.id}
                    chainId={token.chainId}
                    contractAddress={token.contractAddress}
                    editionId={token.editionId}
                  />
                </li>
              ))}
            </ul>
            <div className="pw-w-full pw-flex pw-justify-end pw-mt-4">
              <BaseButton
                type="button"
                size="medium"
                className="!pw-w-min"
                onClick={() => handleToggle(collectionId)}
              >
                Recolher coleção
              </BaseButton>
            </div>
          </div>
        ) : null}
      </article>
    );
  };

  return (
    <div className="pw-flex pw-flex-col pw-gap-6 pw-max-w-full xl:pw-max-w-[1100px]">
      {expandedCollection ? renderCollection(expandedCollection, true) : null}
      {collapsedCollections.length ? (
        <div className="pw-grid pw-grid-cols-1 md:pw-grid-cols-2 xl:pw-grid-cols-3 pw-gap-6">
          {collapsedCollections.map((collection) =>
            renderCollection(collection, false)
          )}
          {singleTokens.map((token) => (
            <article
              key={token.id}
              className="pw-transition-all pw-duration-300 pw-rounded-[20px] pw-w-full"
            >
              <WalletTokenCard
                collectionData={token.collectionData}
                category={token.category || ''}
                image={token.image}
                name={token.name}
                id={token.id}
                chainId={token.chainId}
                contractAddress={token.contractAddress}
                editionId={token.editionId}
              />
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default GroupedTokensList;
