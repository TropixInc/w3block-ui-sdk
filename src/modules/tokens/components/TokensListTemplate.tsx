import { useContext, useEffect, useMemo, useState } from 'react';

import { ErrorBox } from '../../shared/components/ErrorBox';
import { SegmentedControl } from '../../shared/components/ui/SegmentedControl';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { InternalPagesLayoutBase } from '../../shared/components/InternalPagesLayoutBase';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { useHasWallet } from '../../shared/hooks/useHasWallet';
import { usePrivateRoute } from '../../shared/hooks/usePrivateRoute';
import { useProcessingTokens } from '../../shared/hooks/useProcessingTokens';
import { useProfile } from '../../shared/hooks/useProfile';
import { useUserWallet } from '../../shared/hooks/useUserWallet/useUserWallet';
import { useGetNFTSByWallet } from '../hooks/useGetNFTSByWallet';

import { Token } from '../interfaces/Token';
import { mapNFTToToken } from '../utils/mapNFTToToken';
import { TokenListTemplateSkeleton } from './TokenListTemplateSkeleton';
import { WalletTokenCard } from './WalletTokenCard';
import useTranslation from '../../shared/hooks/useTranslation';
import GroupedTokensList, { GroupedTokensListItem } from './GroupedTokensList';
import { DefaultTokensList } from './DefaultTokensList';
import { ThemeContext } from '../../storefront/contexts/ThemeContext';
import { useGetBenefitsByEditionNumberBulk } from '../hooks/useGetBenefitsByEditionNumberBulk';

interface Props {
  tokens?: Array<Token>;
  isLoading?: boolean;
  withLayout?: boolean;
  /** Rendered inside another card (wallet page): no own gutter or card chrome. */
  embedded?: boolean;
}

type GroupedTokensResult = {
  hasDuplicatedCollections: boolean;
  groupedByCollection: GroupedTokensListItem[];
  singleTokens: Token[];
};

export const groupTokensByCollection = (
  tokensList: Token[] = []
): GroupedTokensResult => {
  const groupedCollectionsMap = tokensList.reduce<
    Record<string, GroupedTokensListItem>
  >((acc, currentToken) => {
    const collectionId = currentToken.collectionData?.id;

    if (!collectionId) {
      return acc;
    }

    if (!acc[collectionId]) {
      acc[collectionId] = {
        collectionId,
        collectionName: currentToken.collectionData?.name,
        tokens: [],
      };
    }

    acc[collectionId].tokens.push(currentToken);

    return acc;
  }, {});

  const groupedByCollection: GroupedTokensListItem[] = [];
  const singleTokens: Token[] = [];

  Object.values(groupedCollectionsMap).forEach((group) => {
    if (group.tokens.length > 1) {
      groupedByCollection.push(group);
      return;
    }

    if (group.tokens.length === 1) {
      singleTokens.push(group.tokens[0]);
    }
  });

  return {
    hasDuplicatedCollections: groupedByCollection.length > 0,
    groupedByCollection,
    singleTokens,
  };
};

const _TokensListTemplate = ({ tokens, isLoading, embedded }: Props) => {
  const [translate] = useTranslation();
  useHasWallet({});
  const themeContext = useContext(ThemeContext);
  const configContext = themeContext?.defaultTheme?.configurations;
  const { mainWallet: wallet } = useUserWallet();
  const { data: processingTokens } = useProcessingTokens();
  const [showGroupedView, setShowGroupedView] = useState(true);

  const defaultFilterValue =
    configContext?.styleData?.defaultValueActiveBenefitFilter ?? 'all';
  const [selectedFilter, setSelectedFilter] = useState<'active' | 'all'>(
    defaultFilterValue
  );

  useEffect(() => {
    setSelectedFilter(defaultFilterValue);
  }, [defaultFilterValue]);

  const tokensWithPass = useMemo(
    () => tokens?.filter((token) => token.collectionData?.pass) ?? [],
    [tokens]
  );

  const shouldFetchActiveBenefits =
    selectedFilter === 'active' && tokensWithPass.length > 0;

  const { data: activeTokensData, isLoading: isLoadingActiveTokens } =
    useGetBenefitsByEditionNumberBulk(
      shouldFetchActiveBenefits ? tokensWithPass : []
    );

  const activeKeys = useMemo(() => {
    if (!activeTokensData.length) {
      return new Set<string>();
    }

    return new Set(
      activeTokensData.map(
        ({ item }: any) => `${item.collectionData?.id ?? ''}:${item.id ?? ''}`
      )
    );
  }, [activeTokensData]);

  const filteredTokens = useMemo(() => {
    if (selectedFilter === 'active') {
      if (!shouldFetchActiveBenefits) {
        return [];
      }

      return tokensWithPass.filter((token) =>
        activeKeys.has(`${token.collectionData?.id ?? ''}:${token.id ?? ''}`)
      );
    }

    return tokens ?? [];
  }, [
    activeKeys,
    selectedFilter,
    shouldFetchActiveBenefits,
    tokens,
    tokensWithPass,
  ]);

  const { groupedByCollection, singleTokens } = useMemo(
    () => groupTokensByCollection(filteredTokens),
    [filteredTokens]
  );

  const hasGroupedCollections = groupedByCollection.length > 0;
  const shouldShowGroupedView = hasGroupedCollections && showGroupedView;
  const shouldShowSkeleton =
    isLoading || (shouldFetchActiveBenefits && isLoadingActiveTokens);

  const handleFilterChange = (value: 'active' | 'all') => {
    setSelectedFilter(value);
  };

  const groupedViewToggle = hasGroupedCollections ? (
    <SegmentedControl<'grouped' | 'list'>
      ariaLabel={translate('tokens>tokensListTemplate>group')}
      value={showGroupedView ? 'grouped' : 'list'}
      onChange={(value) => setShowGroupedView(value === 'grouped')}
      options={[
        {
          value: 'grouped',
          label: translate('tokens>tokensListTemplate>byCollection'),
        },
        {
          value: 'list',
          label: translate('tokens>tokensListTemplate>allList'),
        },
      ]}
    />
  ) : null;

  const benefitFilter = !configContext?.styleData?.haveActiveBenefitFilter ? (
    <SegmentedControl<'active' | 'all'>
      ariaLabel={translate('tokens>tokensListTemplate>showActiveBenefits')}
      value={selectedFilter}
      onChange={handleFilterChange}
      options={[
        {
          value: 'active',
          label: translate('tokens>tokensListTemplate>activeBenefits'),
        },
        {
          value: 'all',
          label: translate('tokens>tokensListTemplate>allTokens'),
        },
      ]}
    />
  ) : null;

  const controls =
    groupedViewToggle || benefitFilter ? (
      <div className="pw-flex pw-flex-wrap pw-items-center pw-justify-between pw-gap-2 pw-mb-4">
        {groupedViewToggle ?? <span />}
        {benefitFilter}
      </div>
    ) : null;

  if (shouldShowSkeleton) {
    return <TokenListTemplateSkeleton />;
  }

  if (!tokens?.length) {
    return (
      <EmptyState
        bare={embedded}
        title={translate('connectTokens>tokensList>welcomeToWallet2')}
        description={translate('connectTokens>tokensList>emptyDescription')}
        className={embedded ? 'pw-py-6' : 'pw-mx-4 sm:pw-mx-0'}
      />
    );
  }

  if (!hasGroupedCollections) {
    return (
      <div className="pw-flex-1 pw-flex pw-flex-col">
        {controls}
        <DefaultTokensList
          tokens={tokens}
          isLoading={isLoading}
          selectedFilter={selectedFilter}
          onChangeSelectedFilter={handleFilterChange}
        />
      </div>
    );
  }

  if (shouldShowGroupedView) {
    if (shouldShowSkeleton) {
      return <TokenListTemplateSkeleton />;
    }

    return (
      <div
        className={
          embedded
            ? 'pw-flex-1 pw-flex pw-flex-col pw-justify-start'
            : 'pw-flex-1 pw-flex pw-flex-col pw-justify-start pw-px-4 sm:pw-px-0'
        }
      >
        {controls}

        {processingTokens?.length ? (
          <ul className="pw-grid pw-grid-cols-2 md:pw-grid-cols-2 xl:pw-grid-cols-3 pw-gap-3 sm:pw-gap-6 pw-mb-3 sm:pw-mb-6 pw-max-w-full xl:pw-max-w-[1100px]">
            {processingTokens.map((token: any) => (
              <li className="pw-w-full pw-opacity-60" key={token.id.tokenId}>
                <WalletTokenCard
                  category={''}
                  image={token?.metadata.image}
                  name={token?.title}
                  id={token.id.tokenId}
                  chainId={wallet?.chainId ?? 137}
                  contractAddress={''}
                  proccessing={true}
                  editionId={''}
                />
              </li>
            ))}
          </ul>
        ) : null}

        <GroupedTokensList
          items={groupedByCollection}
          singleTokens={singleTokens}
        />
      </div>
    );
  }

  return (
    <div className="pw-flex-1 pw-flex pw-flex-col">
      {controls}
      <DefaultTokensList
        tokens={tokens}
        isLoading={isLoading}
        selectedFilter={selectedFilter}
        onChangeSelectedFilter={handleFilterChange}
      />
    </div>
  );
};

export const TokensListTemplate = ({ withLayout = true }: Props) => {
  const { isLoading, isAuthorized } = usePrivateRoute();

  const { isFetching: isLoadingProfile } = useProfile();

  const { mainWallet: wallet } = useUserWallet();

  const [{ data: ethNFTsResponse, isFetching: isLoadingETH, error: errorEth }] =
    useGetNFTSByWallet(wallet?.chainId);

  const tokens = ethNFTsResponse?.data?.items
    ? ethNFTsResponse?.data.items.map((nft: any) =>
        mapNFTToToken(nft, wallet?.chainId || 137)
      )
    : [];

  return isLoading || !isAuthorized ? null : errorEth ? (
    <ErrorBox customError={errorEth} />
  ) : (
    <TranslatableComponent>
      {withLayout ? (
        <InternalPagesLayoutBase>
          <_TokensListTemplate
            tokens={tokens}
            isLoading={isLoadingETH || isLoadingProfile}
          />
        </InternalPagesLayoutBase>
      ) : (
        <_TokensListTemplate
          tokens={tokens}
          isLoading={isLoadingETH || isLoadingProfile}
          embedded
        />
      )}
    </TranslatableComponent>
  );
};
