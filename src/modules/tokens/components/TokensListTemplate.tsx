import { useEffect, useMemo, useState } from 'react';

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
import { Pagination } from '../../shared/components/Pagination';
import WalletImage from '../../shared/assets/icons/wallet.svg';
import useTranslation from '../../shared/hooks/useTranslation';

interface Props {
  tokens?: Array<Token>;
  isLoading?: boolean;
  withLayout?: boolean;
}

const _TokensListTemplate = ({ tokens, isLoading }: Props) => {
  const [translate] = useTranslation();
  useHasWallet({});
  const { mainWallet: wallet } = useUserWallet();
  const [selectedFilter, setSelectedFilter] = useState<'active' | 'all'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { data } = useProcessingTokens();
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
    []
  );
  const filteredTokens = useMemo(() => {
    if (selectedFilter === 'active') {
      return tokens?.filter((token) => token.collectionData?.pass) ?? [];
    }

    return tokens ?? [];
  }, [tokens, selectedFilter]);
  const tokensDisplaying = useMemo(() => {
    const startIndex = (page - 1) * 6;
    const lastIndex = page * 6;
    return filteredTokens.slice(startIndex, lastIndex);
  }, [page, filteredTokens]);

  useEffect(() => {
    if (!isLoading) {
      const pages = Math.ceil(((filteredTokens.length || 1) / 6));
      setTotalPages(pages);

      if (page > pages) {
        setPage(1);
      }
    }
  }, [filteredTokens, isLoading, page]);

  if (isLoading) return <TokenListTemplateSkeleton />;
  return tokensDisplaying?.length || data?.length ? (
    <div className="pw-flex-1 pw-flex pw-flex-col pw-justify-between pw-px-4 sm:pw-px-0">
      <div className="pw-flex pw-justify-end pw-mb-4">
        <div className="pw-w-[320px]">
          <p></p>
          <BaseSelect
            options={filterOptions}
            value={selectedFilter}
            className='pw-w-full !pw-max-w-[440px]'
            onChangeValue={(value: 'active' | 'all') => {
              setSelectedFilter(value);
              setPage(1);
            }}
          />
        </div>
      </div>
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
  ) : (
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

    console.log(tokens, "tokens")

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
