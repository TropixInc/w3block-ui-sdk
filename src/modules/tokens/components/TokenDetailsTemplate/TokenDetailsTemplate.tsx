import { InternalPagesLayoutBase } from '../../../shared';
import { MintedInfoCard } from '../../../shared/components/MintedInfoCard';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import useRouter from '../../../shared/hooks/useRouter';
import { usePublicTokenData } from '../../hooks/usePublicTokenData';
import {
  Dimensions2DValue,
  Dimensions3DValue,
} from '../../interfaces/DimensionsValue';
import { TokenDetailsCard } from '../TokenDetailsCard';

const _TokenDetailsTemplate = () => {
  const router = useRouter();
  const contractAddress = (router.query.contractAddress as string) ?? '';
  const chainId = (router.query.chainId as string) ?? '';
  const tokenId = (router.query.tokenId as string) ?? '';
  const { data: publicTokenResponse } = usePublicTokenData({
    contractAddress,
    chainId,
    tokenId,
  });

  return publicTokenResponse ? (
    <div className="pw-w-full sm:pw-max-w-[968px] pw-font-roboto">
      <TokenDetailsCard
        tokenData={
          (publicTokenResponse?.data?.dynamicInformation.tokenData as Record<
            string,
            string | Dimensions2DValue | Dimensions3DValue
          >) ?? {}
        }
        tokenTemplate={
          publicTokenResponse?.data?.dynamicInformation
            .publishedTokenTemplate ?? {}
        }
        contract={publicTokenResponse?.data?.information.contractName}
        description={publicTokenResponse?.data?.information.description}
        title={publicTokenResponse?.data?.information.title}
        mainImage={publicTokenResponse?.data?.information.mainImage ?? ''}
        className="pw-mb-6"
        isMultiplePass={true}
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
    </div>
  ) : null;
};

export const TokenDetailsTemplate = () => (
  <TranslatableComponent>
    <InternalPagesLayoutBase>
      <_TokenDetailsTemplate />
    </InternalPagesLayoutBase>
  </TranslatableComponent>
);
