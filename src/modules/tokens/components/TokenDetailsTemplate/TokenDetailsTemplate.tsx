import { ReactComponent as ChevronLeft } from '../../../shared/assets/icons/chevronLeftFilled.svg';
import { MintedInfoCard } from '../../../shared/components/MintedInfoCard';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import useRouter from '../../../shared/hooks/useRouter';
import usePublicTokenData from '../../../tokenization/hooks/usePublicTokenData';
import {
  Dimensions2DValue,
  Dimensions3DValue,
} from '../../../tokenization/interfaces/DimensionsValue';
import TokenDetailsCard from '../TokenDetailsCard';

const _TokenDetailsTemplate = () => {
  const router = useRouter();
  const { data } = usePublicTokenData();

  const contractAddress = (router.query.contractAddress as string) ?? '';
  return data ? (
    <div className="pw-w-full sm:pw-max-w-[968px] pw-font-roboto">
      <div className="sm:pw-hidden pw-mb-4">
        <div className="pw-flex pw-items-center pw-gap-x-4 pw-mb-[16.5px]">
          <button
            onClick={() => router.push(PixwayAPIRoutes.TOKENS)}
            className="pw-flex pw-items-center pw-justify-center pw-rounded-full pw-border pw-border-[#777E8F] pw-bg-[#F7F7F7] pw-w-4 pw-h-4 pw-ml-[22px]"
          >
            <ChevronLeft className="pw-w-[4.25px] pw-h-[8.5px] pw-fill-[#777E8F]" />
          </button>
        </div>

        <div className="pw-w-full pw-h-[1px] pw-bg-[#EFEFEF]" />
      </div>
      <TokenDetailsCard
        tokenData={
          (data?.dynamicInformation.tokenData as Record<
            string,
            string | Dimensions2DValue | Dimensions3DValue
          >) ?? {}
        }
        tokenTemplate={data?.dynamicInformation.publishedTokenTemplate ?? {}}
        contract={data?.information.contractName}
        description={data?.information.description}
        title={data?.information.title}
        mainImage={data?.information.mainImage ?? ''}
        className="pw-mb-6"
      />

      <MintedInfoCard
        collectionName={data.information.title}
        chainId={data.token?.chainId ?? 137}
        mintedAt={data.edition.mintedAt ?? ''}
        tokenId={data.token?.tokenId ?? ''}
        contractAddress={contractAddress}
        rfid={data.edition.rfid}
        editionNumber={Number(data.edition.currentNumber) ?? 0}
        mintedHash={data.edition.mintedHash ?? ''}
        totalEditions={data.edition.total}
        editionId=""
        className="pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-bg-[#FFFFFF] pw-rounded-[20px] pw-p-6 pw-px-[34.5px] sm:pw-px-6"
      />
    </div>
  ) : null;
};

export const TokenDetailsTemplate = () => (
  <TranslatableComponent>
    <_TokenDetailsTemplate />
  </TranslatableComponent>
);
