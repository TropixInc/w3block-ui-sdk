import { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';

import { ErrorBox } from '../../shared/components/ErrorBox';
import { BaseSelect } from '../../shared/components/BaseSelect';
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
import WalletImage from '../../shared/assets/icons/wallet.svg';
import GroupedTokensList, {
  GroupedTokensListItem,
} from './GroupedTokensList';
import { DefaultTokensList } from './DefaultTokensList';
import { ThemeContext } from '../../storefront/contexts/ThemeContext';
import { useGetBenefitsByEditionNumberBulk } from '../hooks/useGetBenefitsByEditionNumberBulk';

interface Props {
  tokens?: Array<Token>;
  isLoading?: boolean;
  withLayout?: boolean;
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

const _TokensListTemplate = ({ tokens, isLoading }: Props) => {
  const [translate] = useTranslation();
  useHasWallet({});
  const themeContext = useContext(ThemeContext);
  const configContext = themeContext?.defaultTheme?.configurations;
  const { mainWallet: wallet } = useUserWallet();
  const { data: processingTokens } = useProcessingTokens();
  const [showGroupedView, setShowGroupedView] = useState(true);

  const defaultFilterValue =
    configContext?.styleData?.defaultValueActiveBenefitFilter ?? 'all';
  const [selectedFilter, setSelectedFilter] =
    useState<'active' | 'all'>(defaultFilterValue);

  useEffect(() => {
    setSelectedFilter(defaultFilterValue);
  }, [defaultFilterValue]);

  const filterOptions = useMemo(
    () => [
      {
        label: translate('tokens>tokensListTemplate>showActiveBenefits'),
        value: 'active',
      },
      {
        label: translate('tokens>tokensListTemplate>showAllTokens'),
        value: 'all',
      },
    ],
    [translate]
  );

  const tokensWithPass = useMemo(
    () =>
      tokens?.filter(
        (token) => token.collectionData?.pass
      ) ?? [],
    [tokens]
  );

  const shouldFetchActiveBenefits =
    selectedFilter === 'active' && tokensWithPass.length > 0;

  const {
    data: activeTokensData,
    isLoading: isLoadingActiveTokens,
  } = useGetBenefitsByEditionNumberBulk(
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

  const handleGroupedViewChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShowGroupedView(event.target.checked);
  };

  const handleFilterChange = (value: 'active' | 'all') => {
    setSelectedFilter(value);
  };

  const groupedViewToggle = hasGroupedCollections ? (
    <label className="pw-flex pw-items-center pw-gap-2 pw-mb-4">
      <input
        type="checkbox"
        className="pw-w-5 pw-h-5 pw-form-checkbox"
        checked={showGroupedView}
        onChange={handleGroupedViewChange}
      />
      <span className="pw-text-sm pw-text-neutral-700">
        {translate(showGroupedView ? 'tokens>tokensListTemplate>ungroup' : 'tokens>tokensListTemplate>group')}
      </span>
    </label>
  ) : null;

  if (!tokens?.length) {
    return (
      <div className="pw-p-[20px] pw-mx-[16px] pw-max-width-full sm:pw-mx-0 sm:pw-p-[24px] pw-pb-[32px] sm:pw-pb-[24px] pw-bg-white pw-shadow-md pw-rounded-lg pw-overflow-hidden pw-flex pw-flex-1 pw-px-10 pw-flex-col pw-relative pw-font-poppins pw-items-center pw-justify-start sm:pw-justify-center pw-mb-13">
        <h1 className="pw-font-semibold pw-ctext-[15px] pw-leading-[22px]  pw-hidden pw-mb-[61px]">
          {translate('connectTokens>tokensList>pageTitle')}
        </h1>

        <div className="pw-mb-[29px] pw-block">
          <WalletImage className="pw-fill-brand-primary pw-max-w-[82px] sm:pw-max-w-[113px]  pw-max-h-[76px] sm:pw-max-h-[106px]" />
        </div>

        <h1 className="pw-font-bold sm:pw-font-semibold pw-text-lg sm:pw-text-4xl pw-leading-[23px] sm:pw-leading-[64px] pw-mb-[31px] sm:pw-mb-6 pw-text-black pw-text-center">
          {translate('connectTokens>tokensList>welcomeToWallet')}
        </h1>
        <h2 className="pw-font-normal sm:pw-font-medium pw-text-sm sm:pw-text-lg pw-leading-[21px] sm:pw-leading-[23px] pw-text-center pw-max-w-[595px] pw-mb-6">
          {translate('connectTokens>tokensList>welcomeToWallet2')}
        </h2>
        <p className="pw-font-normal sm:pw-font-medium pw-text-sm sm:pw-text-lg pw-leading-[21px] sm:pw-leading-[23px] pw-text-center pw-max-w-[595px] pw-mb-6">
          {translate('connectTokens>tokensList>tokensAlreadyProcessing')}
        </p>
      </div>
    );
  }

  if (!hasGroupedCollections) {
    return (
      <div className="pw-flex-1 pw-flex pw-flex-col">
        <div className='pw-flex pw-items-center pw-justify-between'>
        {groupedViewToggle}
        {!configContext?.styleData?.haveActiveBenefitFilter ? (
          <div className="pw-flex pw-justify-end pw-mb-4">
            <BaseSelect
              options={filterOptions}
              value={selectedFilter}
              classes={{ root: '!pw-w-[340px]' }}
              onChangeValue={(e) => handleFilterChange(e.value)}
            />
          </div>
        ) : null}

      </div>
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
      <div className="pw-flex-1 pw-flex pw-flex-col pw-justify-start pw-px-4 sm:pw-px-0">
        <div className='pw-flex pw-items-center pw-justify-between'>
          {groupedViewToggle}
          {!configContext?.styleData?.haveActiveBenefitFilter ? (
            <div className="pw-flex pw-justify-end pw-mb-4">
              <BaseSelect
                options={filterOptions}
                value={selectedFilter}
                classes={{ root: '!pw-w-[340px]' }}
                onChangeValue={(e) => handleFilterChange(e.value)}
              />
            </div>
          ) : null}

        </div>


        {processingTokens?.length ? (
          <ul className="pw-grid pw-grid-cols-1 lg:pw-grid-cols-2 xl:pw-grid-cols-3 pw-gap-x-[41px] pw-gap-y-[30px] pw-mb-6">
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
      <div className='pw-flex pw-items-center pw-justify-between'>
        {groupedViewToggle}
        {!configContext?.styleData?.haveActiveBenefitFilter ? (
          <div className="pw-flex pw-justify-end pw-mb-4">
            <BaseSelect
              options={filterOptions}
              value={selectedFilter}
              classes={{ root: '!pw-w-[340px]' }}
              onChangeValue={(e) => handleFilterChange(e.value)}
            />
          </div>
        ) : null}

      </div>
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
        />
      )}
    </TranslatableComponent>
  );
};
