import useTranslation from "../../shared/hooks/useTranslation";
import { useProcessingTokens } from "../../shared/hooks/useProcessingTokens";
import { useHasWallet } from "../../shared/hooks/useHasWallet";
import { useContext, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "../../storefront/contexts/ThemeContext";
import { useUserWallet } from "../../shared/hooks/useUserWallet/useUserWallet";
import { useGetBenefitsByEditionNumberBulk } from "../hooks/useGetBenefitsByEditionNumberBulk";
import { BaseSelect } from '../../shared/components/BaseSelect';
import { WalletTokenCard } from "./WalletTokenCard";
import { Pagination } from "../../shared/components/Pagination";
import { Token } from "../interfaces/Token";
import { TokenListTemplateSkeleton } from "./TokenListTemplateSkeleton";
import WalletImage from '../../shared/assets/icons/wallet.svg';

interface Props {
  tokens?: Array<Token>;
  isLoading?: boolean;
  withLayout?: boolean;
  selectedFilter?: 'active' | 'all';
  onChangeSelectedFilter?: (value: 'active' | 'all') => void;
}

export const DefaultTokensList = ({
  tokens,
  isLoading,
  selectedFilter: controlledFilter,
  onChangeSelectedFilter,
}: Props) => {
  const [translate] = useTranslation();
  useHasWallet({});

  const { data } = useProcessingTokens();
  const context = useContext(ThemeContext);
  const configContext = context?.defaultTheme?.configurations;
  const { mainWallet: wallet } = useUserWallet();
  const defaultFilterValue =
    configContext?.styleData?.defaultValueActiveBenefitFilter ?? 'all';
  const [internalSelectedFilter, setInternalSelectedFilter] = useState<
    'active' | 'all'
  >(controlledFilter ?? defaultFilterValue);

  useEffect(() => {
    if (controlledFilter !== undefined) {
      setInternalSelectedFilter(controlledFilter);
    }
  }, [controlledFilter]);

  useEffect(() => {
    if (controlledFilter === undefined) {
      setInternalSelectedFilter(defaultFilterValue);
    }
  }, [controlledFilter, defaultFilterValue]);

  const selectedFilter = controlledFilter ?? internalSelectedFilter;
  const slicedTokensToActiveView =
    tokens?.length && tokens?.length > 30 ? tokens?.slice(0, 30) : tokens;
  const [totalPages, setTotalPages] = useState(0);

  const [page, setPage] = useState(1);
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

  const handleFilterChange = (value: 'active' | 'all') => {
    if (controlledFilter === undefined) {
      setInternalSelectedFilter(value);
    }

    onChangeSelectedFilter?.(value);
    setPage(1);
  };

  const tokensWithPass = useMemo(
    () =>
      slicedTokensToActiveView?.filter(
        (token) => token.collectionData?.pass
      ) ?? [],
    [slicedTokensToActiveView]
  );

  const {
    data: activeTokensData,
    isLoading: isLoadingActiveTokens,
  } = useGetBenefitsByEditionNumberBulk(tokensWithPass);

  const activeKeys = useMemo(() => {
    if (!activeTokensData.length) {
      return new Set<string>();
    }

    return new Set(
      activeTokensData.map(
        ({ item }) => `${item.collectionData?.id ?? ''}:${item.id ?? ''}`
      )
    );
  }, [activeTokensData]);

  const preparedTokens = useMemo(() => {
    if (selectedFilter === 'active') {
      return tokensWithPass.filter((token) =>
        activeKeys.has(`${token.collectionData?.id ?? ''}:${token.id ?? ''}`)
      );
    }

    return tokens ?? [];
  }, [
    activeKeys,
    selectedFilter,
    tokens,
    tokensWithPass,
  ]);


  const tokensDisplaying = useMemo(() => {
    const startIndex = (page - 1) * 12;
    const lastIndex = page * 12;
    return preparedTokens.slice(startIndex, lastIndex);
  }, [page, preparedTokens]);

  const shouldShowSkeleton =
    isLoading || (selectedFilter === 'active' && isLoadingActiveTokens);

  useEffect(() => {
    if (!shouldShowSkeleton) {
      const pages = Math.ceil(((preparedTokens.length || 1) / 6));
      setTotalPages(pages);

      if (page > pages) {
        setPage(1);
      }
    }
  }, [preparedTokens, shouldShowSkeleton, page]);


  if (shouldShowSkeleton) return <TokenListTemplateSkeleton />;

  if (!tokensDisplaying.length && !data?.length) {
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

  return (
    <div className="pw-flex-1 pw-flex pw-flex-col pw-justify-between pw-px-4 sm:pw-px-0">
      {configContext?.styleData?.haveActiveBenefitFilter ? (
        <div className="pw-flex pw-justify-end pw-mb-4">
          <div className="">
            <BaseSelect
              options={filterOptions}
              value={selectedFilter}
              classes={{ root: '!pw-w-[340px]' }}
              onChangeValue={(e) => handleFilterChange(e.value)}
            />
          </div>
        </div>
      ) : null}

      <ul className="pw-grid pw-grid-cols-1 lg:pw-grid-cols-2 xl:pw-grid-cols-3 pw-gap-x-[41px] pw-gap-y-[30px]">
        {data?.map((token: any) => (
          <li className="w-full pw-opacity-60" key={token.id.tokenId}>
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
        {tokensDisplaying?.map((token) => (
          <li className="w-full" key={token.id}>
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
      <div className="pw-mt-[30px] pw-flex pw-justify-end">
        <Pagination
          onChangePage={setPage}
          pagesQuantity={totalPages}
          currentPage={page}
        />
      </div>
    </div>
  );
}
