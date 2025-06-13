import { ErrorBox } from "../../shared/components/ErrorBox";
import { InternalPagesLayoutBase } from "../../shared/components/InternalPagesLayoutBase";
import { MintedInfoCard } from "../../shared/components/MintedInfoCard";
import TranslatableComponent from "../../shared/components/TranslatableComponent";
import { PixwayAppRoutes } from "../../shared/enums/PixwayAppRoutes";
import { useRouterConnect } from "../../shared/hooks/useRouterConnect";
import { usePublicTokenData } from "../hooks/usePublicTokenData";
import { Dimensions2DValue, Dimensions3DValue } from "../interfaces/DimensionsValue";
import { TokenDetailsCard } from "./TokenDetailsCard";

const _TokenDetailsTemplate = () => {
  const router = useRouterConnect();
  const contractAddress = (router.query.contractAddress as string) ?? '';
  const chainId = (router.query.chainId as string) ?? '';
  const tokenId = (router.query.tokenId as string) ?? '';
  const { data: publicTokenResponse, error: errorPublicTokenResponse } =
    usePublicTokenData({
      contractAddress,
      chainId,
      tokenId,
    });

  return errorPublicTokenResponse ? (
    <ErrorBox customError={errorPublicTokenResponse} />
  ) : (
    <div className="pw-w-full sm:pw-max-w-[968px] pw-font-roboto">
      <div className="sm:pw-hidden pw-mb-4">
        <div className="pw-flex pw-items-center pw-gap-x-4 pw-mb-[16.5px]">
          <button
            onClick={() => router.pushConnect(PixwayAppRoutes.TOKENS)}
            className="pw-flex pw-items-center pw-justify-center pw-rounded-full pw-border pw-border-[#777E8F] pw-bg-[#F7F7F7] pw-w-4 pw-h-4 pw-ml-[22px]"
          ></button>
        </div>

        <div className="pw-w-full pw-h-[1px] pw-bg-[#EFEFEF]" />
      </div>
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
            className="pw-mb-6"
            tokenId={tokenId}
            collectionId={publicTokenResponse?.data?.group?.collectionId}
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
            className="pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-bg-[#FFFFFF] pw-rounded-[20px] pw-p-6 pw-px-[34.5px] sm:pw-px-6"
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
