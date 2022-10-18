import { useEffect, useMemo, useState } from 'react';

import { InternalPagesLayoutBase, useProfile } from '../../../shared';
import { Alert } from '../../../shared/components/Alert';
import { Link } from '../../../shared/components/Link';
import { Pagination } from '../../../shared/components/Pagination/Pagination';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useIsProduction } from '../../../shared/hooks/useIsProduction';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { usePrivateRoute } from '../../../shared/hooks/usePrivateRoute';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useUserWallet } from '../../../shared/hooks/useUserWallet';
import { ReactComponent as WalletImage } from '../../assets/wallet.svg';
import { useGetNFTSByWallet } from '../../hooks/useGetNFTsByWallet/useGetNFTSByWallet';
import { Token } from '../../interfaces/Token';
import { mapNFTToToken } from '../../utils/mapNFTToToken';
import { WalletTokenCard } from '../WalletTokenCard';
import { TokenListTemplateSkeleton } from './Skeleton';

interface Props {
  tokens: Array<Token>;
  isLoading: boolean;
}

const UnsignedUserAlert = () => {
  const [translate] = useTranslation();
  return (
    <Alert variant="error" className="pw-flex pw-flex-col pw-gap-y-2">
      <div className="pw-flex pw-gap-x-2">
        <Alert.Icon /> {translate('tokens>noWalletConnectected>alert')}
      </div>
      <Link
        href={PixwayAppRoutes.CONNECT_EXTERNAL_WALLET}
        className="pw-text-brand-primary pw-text-sm hover:pw-underline"
      >
        {translate('tokens>unsignedUserAlert>signIn')}
      </Link>
    </Alert>
  );
};

const NoWalletAlert = () => {
  const [translate] = useTranslation();
  return (
    <Alert variant="error" className="pw-flex pw-flex-col pw-gap-y-2">
      <div className="pw-flex pw-gap-x-2">
        <Alert.Icon /> {translate('tokens>noWalletConnectected>alert')}
      </div>
      <div className="pw-text-sm">
        <Link
          href={PixwayAppRoutes.CONNECT_EXTERNAL_WALLET}
          className="pw-text-brand-primary hover:pw-underline"
        >
          {translate('tokens>noWalletConnected>connectWallet')}
        </Link>
      </div>
    </Alert>
  );
};

const _TokensListTemplate = ({ tokens, isLoading }: Props) => {
  const [translate] = useTranslation();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const isProduction = useIsProduction();

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

  if (isLoading) return <TokenListTemplateSkeleton />;

  return tokensDisplaying.length ? (
    <div className="pw-flex-1 pw-flex pw-flex-col pw-justify-between">
      <ul className="pw-grid pw-grid-cols-1 lg:pw-grid-cols-2 xl:pw-grid-cols-3 pw-gap-x-[41px] pw-gap-y-[30px]">
        {tokensDisplaying.map((token, index) => (
          <li className="pw-flex pw-items-stretch" key={token.id}>
            <WalletTokenCard
              category={token.category}
              image={token.image}
              name={token.name}
              id={token.id}
              chainId={token.chainId}
              contractAddress={token.contractAddress}
              hasPass={!isProduction}
              hasActivated={index % 2 === 0}
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
    <div className="pw-flex pw-flex-1 pw-px-10 pw-flex-col pw-relative pw-font-poppins pw-items-center pw-justify-start sm:pw-justify-center pw-mb-13">
      <h1 className="pw-font-semibold pw-ctext-[15px] pw-leading-[22px] pw-block sm:pw-hidden pw-mb-[61px]">
        {translate('connectTokens>tokensList>pageTitle')}
      </h1>

      <div className="pw-mb-[29px] pw-block">
        <WalletImage className="pw-fill-brand-primary pw-max-w-[82px] sm:pw-max-w-[113px]  pw-max-h-[76px] sm:pw-max-h-[106px]" />
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
  const { status } = usePixwaySession();
  const { isLoading, isAuthorized } = usePrivateRoute();

  const { data: profileResponse, isLoading: isLoadingProfile } = useProfile();

  const { wallet } = useUserWallet();

  const [{ data: ethNFTsResponse, isLoading: isLoadingETH }] =
    useGetNFTSByWallet(wallet?.chainId || 80001);

  const tokens =
    ethNFTsResponse?.data.items.map((nft) =>
      mapNFTToToken(nft, wallet?.chainId || 80001)
    ) || [];

  if (!profileResponse || !profileResponse.data.mainWalletId)
    return <NoWalletAlert />;

  const renderTemplate = () => {
    if (status === 'unauthenticated') return <UnsignedUserAlert />;
    return (
      <_TokensListTemplate
        tokens={tokens}
        isLoading={isLoadingETH || isLoadingProfile}
      />
    );
  };

  return isLoading || !isAuthorized ? null : (
    <TranslatableComponent>
      <InternalPagesLayoutBase>{renderTemplate()}</InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
