import { useEffect, useMemo, useState } from 'react';

import { Pagination } from '../../../shared/components/Pagination/Pagination';
import { useIsProduction } from '../../../shared/hooks/useIsProduction';
import useTranslation from '../../../shared/hooks/useTranslation';
import walletImage from '../../assets/wallet.png';
import {
  useGetNFTSByWallet,
  NFTByWalletDTO,
} from '../../hooks/useGetNFTsByWallet/useGetNFTSByWallet';
import { WalletTokenCard } from '../WalletTokenCard';

interface Token {
  category: string;
  image: string;
  name: string;
  id: string;
  contractAddress: string;
  chainId: number;
}

interface Props {
  tokens: Array<Token>;
  isLoading: boolean;
}

const mapNFTToToken = (nft: NFTByWalletDTO, chainId: number): Token => ({
  category: nft.metadata.atributes?.length
    ? nft.metadata.atributes[0].trait_tyoe
    : '',
  id: nft.id?.tokenId ?? '',
  image: nft.media.length ? nft.media[0].thumbnail || nft.media[0].gateway : '',
  name: nft.title,
  contractAddress: nft.contract?.address ?? '',
  chainId,
});

const HOCStaging = () => {
  const [{ data: ethNFTsResponse, isLoading: isLoadingETH }] =
    useGetNFTSByWallet(80001);
  const [{ data: polygonNFTsResponse, isLoading: isLoadingPolygon }] =
    useGetNFTSByWallet(4);
  const [{ data: polygonNFTsReponse2, isLoading: isLoadingLast }] =
    useGetNFTSByWallet(137);

  const tokens = useMemo(() => {
    let tokens: Array<Token> = [];
    if (ethNFTsResponse) {
      tokens = tokens.concat(
        ethNFTsResponse.data.items.map((nft) => mapNFTToToken(nft, 80001))
      );
    }
    if (polygonNFTsResponse) {
      tokens = tokens.concat(
        polygonNFTsResponse.data.items.map((nft) => mapNFTToToken(nft, 4))
      );
    }
    if (polygonNFTsReponse2) {
      tokens = tokens.concat(
        polygonNFTsReponse2.data.items.map((nft) => mapNFTToToken(nft, 137))
      );
    }
    return tokens;
  }, [ethNFTsResponse, polygonNFTsResponse, polygonNFTsReponse2]);

  console.log(tokens);

  return (
    <_TokensListTemplate
      tokens={tokens}
      isLoading={isLoadingLast || isLoadingPolygon || isLoadingETH}
    />
  );
};

const HOCProduction = () => {
  const [{ data: ethNFTsResponse, isLoading: isLoadingETH }] =
    useGetNFTSByWallet(1);
  const [{ data: polygonNFTsResponse, isLoading: isLoadingPolygon }] =
    useGetNFTSByWallet(137);

  const tokens = useMemo(() => {
    let tokens: Array<Token> = [];
    if (ethNFTsResponse) {
      tokens = tokens.concat(
        ethNFTsResponse.data.items.map((nft) => mapNFTToToken(nft, 1))
      );
    }
    if (polygonNFTsResponse) {
      tokens = tokens.concat(
        polygonNFTsResponse.data.items.map((nft) => mapNFTToToken(nft, 137))
      );
    }
    return tokens;
  }, [ethNFTsResponse, polygonNFTsResponse]);

  return (
    <_TokensListTemplate
      isLoading={isLoadingETH || isLoadingPolygon}
      tokens={tokens}
    />
  );
};

const _TokensListTemplate = ({ tokens, isLoading }: Props) => {
  const [translate] = useTranslation();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const tokensDisplaying = useMemo(() => {
    const startIndex = (page - 1) * 6;
    const lastIndex = page * 6;
    return tokens.slice(startIndex, lastIndex);
  }, [page, tokens]);

  useEffect(() => {
    if (!isLoading) {
      setTotalPages(Math.ceil(tokens.length / 6));
    }
  }, [tokens, isLoading]);

  if (isLoading)
    return (
      <div className="pw-flex-1">
        <ul className="pw-grid pw-grid-cols-1 sm:pw-grid-cols-3 pw-gap-x-[41px] pw-gap-y-[30px]">
          {new Array(6).fill(undefined).map((_, index) => (
            <li className="pw-flex pw-items-stretch pw-w-full" key={index}>
              <WalletTokenCard.Skeleton />
            </li>
          ))}
        </ul>
      </div>
    );

  return tokensDisplaying.length ? (
    <div className="pw-flex-1 pw-flex pw-flex-col pw-justify-between">
      <ul className="pw-grid pw-grid-cols-1 sm:pw-grid-cols-3 pw-gap-x-[41px] pw-gap-y-[30px]">
        {tokensDisplaying.map((token) => (
          <li
            className="pw-flex pw-items-stretch pw-w-full pw-max-w-[296px] pw-mx-auto sm:pw-max-w-none sm:pw-mx-0"
            key={token.id}
          >
            <WalletTokenCard
              category={token.category}
              image={token.image}
              name={token.name}
              id={token.id}
              chainId={token.chainId}
              contractAddress={token.contractAddress}
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
    <div className="pw-flex pw-flex-1 pw-px-10 pw-flex-col pw-relative pw-font-poppins pw-items-center pw-justify-start sm:pw-justify-center">
      <h1 className="pw-font-semibold pw-ctext-[15px] pw-leading-[22px] pw-block sm:pw-hidden pw-mb-[61px]">
        {translate('connectTokens>tokensList>pageTitle')}
      </h1>

      <div className="pw-mb-[29px] pw-block sm:pw-hidden">
        <img
          src={walletImage}
          alt=""
          className="pw-max-w-[82px] sm:pw-max-w-[113px]  pw-max-h-[76px] sm:pw-max-h-[106px]"
        />
      </div>

      <h1 className="pw-font-bold sm:pw-font-semibold pw-text-lg sm:pw-text-4xl pw-leading-[23px] sm:pw-leading-[64px] pw-text-black pw-mb-[31px] sm:pw-mb-7 pw-text-center">
        {translate('connectTokens>tokensList>welcomeToWallet')}
      </h1>
      <p className="pw-font-normal sm:pw-font-medium pw-text-sm sm:pw-text-lg pw-leading-[21px] sm:pw-leading-[23px] pw-text-center pw-max-w-[595px] pw-mb-6">
        {translate('connectTokens>tokensList>tokensAlreadyProcessing')}
      </p>
      <p className="pw-font-normal sm:pw-font-medium pw-text-sm sm:pw-text-lg pw-leading-[21px] sm:pw-leading-[23px] pw-text-center pw-max-w-[595px]">
        {translate('connectTokens>tokensList>tokensAlreadyProcessing2')}
      </p>
    </div>
  );
};

export const TokensListTemplate = () => {
  const isProduction = useIsProduction();
  return !isProduction ? <HOCProduction /> : <HOCStaging />;
};
