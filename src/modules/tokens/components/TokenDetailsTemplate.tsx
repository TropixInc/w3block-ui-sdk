import { ErrorBox } from '../../shared/components/ErrorBox';
import { InternalPagesLayoutBase } from '../../shared/components/InternalPagesLayoutBase';
import { MintedInfoCard } from '../../shared/components/MintedInfoCard';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { usePublicTokenData } from '../hooks/usePublicTokenData';
import {
  Dimensions2DValue,
  Dimensions3DValue,
} from '../interfaces/DimensionsValue';
import { TokenDetailsCard } from './TokenDetailsCard';

const _TokenDetailsTemplate = () => {
  const router = useRouterConnect();
  const contractAddress = (router?.query?.contractAddress as string) ?? '';
  const chainId = (router?.query?.chainId as string) ?? '';
  const tokenId = (router?.query?.tokenId as string) ?? '';

  const { data: publicTokenResponse, error: errorPublicTokenResponse } =
    usePublicTokenData({
      contractAddress,
      chainId,
      tokenId,
    });

  return errorPublicTokenResponse ? (
    <ErrorBox customError={errorPublicTokenResponse} />
  ) : (
    <div className="pw-w-full sm:pw-max-w-[968px] pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0 pw-font-roboto">
      {publicTokenResponse ? (
        <>
          <TokenDetailsCard
            tokenData={
              (publicTokenResponse?.data?.dynamicInformation
                .tokenData as Record<
                string,
                string | Dimensions2DValue | Dimensions3DValue
              >) ?? {}
            }
            tokenTemplate={
              publicTokenResponse?.data?.dynamicInformation
                .publishedTokenTemplate ?? {}
            }
            contract={publicTokenResponse?.data?.information?.contractName}
            description={publicTokenResponse?.data?.information?.description}
            title={publicTokenResponse?.data?.information?.title}
            mainImage={publicTokenResponse?.data?.information?.mainImage ?? ''}
            tokenId={tokenId}
            collectionId={publicTokenResponse?.data?.group?.collectionId}
            isPass={publicTokenResponse?.data?.group?.collectionPass}
            editionNumber={publicTokenResponse.data?.edition?.currentNumber}
          />

          <MintedInfoCard
            collectionName={publicTokenResponse?.data?.information.title}
            chainId={publicTokenResponse?.data?.token?.chainId ?? 137}
            mintedAt={publicTokenResponse?.data?.edition.mintedAt ?? ''}
            tokenId={publicTokenResponse?.data?.token?.tokenId ?? ''}
            contractAddress={contractAddress}
            rfid={publicTokenResponse?.data?.edition.rfid}
            editionNumber={
              Number(publicTokenResponse?.data?.edition.currentNumber) ?? 0
            }
            mintedHash={publicTokenResponse?.data?.edition.mintedHash ?? ''}
            totalEditions={publicTokenResponse?.data?.edition.total}
            editionId=""
            className="!pw-mx-0 pw-shadow-[0_2px_8px_rgba(0,0,0,0.06)] pw-bg-[#FFFFFF] pw-rounded-[10px] pw-p-4 sm:pw-p-5 [&_a]:!pw-w-auto [&_a]:pw-max-w-full [&_a]:pw-whitespace-normal [&_a]:pw-text-center sm:[&_a]:pw-text-left"
          />
        </>
      ) : null}
    </div>
  );
};

export const TokenDetailsTemplate = () => (
  <TranslatableComponent>
    <InternalPagesLayoutBase>
      <_TokenDetailsTemplate />
    </InternalPagesLayoutBase>
  </TranslatableComponent>
);
