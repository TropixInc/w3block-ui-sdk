import useTranslation from '../../../shared/hooks/useTranslation';
import useAdressBlockchainLink from '../../../shared/hooks/useAdressBlockchainLink';
import { useGetCollectionMetadata } from '../../../tokens/hooks/useGetCollectionMetadata';
import { getChainName } from '../../utils/productPageUtils';

interface ProductBlockchainInfoProps {
  chainId?: number;
  contractAddress?: string;
  keyCollectionId?: string;
  stockAmount?: number;
  tokensAmount?: number;
  showDescription: boolean;
}

export const ProductBlockchainInfo = ({
  chainId,
  contractAddress,
  keyCollectionId,
  stockAmount,
  tokensAmount,
  showDescription,
}: ProductBlockchainInfoProps) => {
  const [translate] = useTranslation();
  const addresBlockchainLink = useAdressBlockchainLink(chainId, contractAddress);
  const { data: tokenData } = useGetCollectionMetadata({
    id: keyCollectionId ?? '',
    query: { limit: 1 },
  });

  const tokensSold =
    tokensAmount != null && stockAmount != null
      ? tokensAmount - stockAmount
      : 0;
  const hasTotalTokens =
    tokenData?.items?.[0]?.tokenCollection?.quantity != null;

  return (
    <div
      className={`${
        showDescription
          ? 'pw-flex-[1.5] lg:pw-flex-[1.3]'
          : 'pw-w-full'
      } pw-max-h-[295px] pw-text-black pw-rounded-[14px] pw-bg-white pw-p-[25px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)]`}
    >
      <p className="pw-text-[15px] pw-font-[600] pw-mb-4">
        {translate('commerce>productPage>tokenDetails')}
      </p>
      <span className="pw-border-[#E6E8EC] pw-block pw-border pw-border-solid pw-w-full pw-mx-auto" />
      <div className="pw-mt-7 pw-text-[13px] pw-flex pw-justify-between">
        <div>
          <p>Contract Address</p>
          {hasTotalTokens && (
            <p className="pw-mt-[10px]">
              {translate('commerce>productPage>totalTokens')}
            </p>
          )}
          <p className="pw-mt-[10px]">
            {translate('commerce>productPage>totalAvailable')}
          </p>
          <p className="pw-mt-[10px]">
            {translate('commerce>productPage>soldTokens')}
          </p>
          <p className="pw-mt-[10px]">Token Standard</p>
          <p className="pw-mt-[10px]">Chain</p>
        </div>
        <div
          className={`pw-text-right ${
            showDescription
              ? 'sm:pw-max-w-[150px] pw-max-w-[100px]'
              : 'pw-max-w-[100px] sm:pw-max-w-[295px]'
          }`}
        >
          <p className="pw-truncate pw-underline pw-text-[#4194CD]">
            <a
              href={addresBlockchainLink}
              target="_blank"
              rel="noreferrer"
            >
              {contractAddress}
            </a>
          </p>
          {hasTotalTokens && (
            <p className="pw-mt-[10px]">
              {tokenData?.items?.[0]?.tokenCollection?.quantity}
            </p>
          )}
          <p className="pw-mt-[10px]">{stockAmount}</p>
          <p className="pw-mt-[10px]">{tokensSold}</p>
          <p className="pw-mt-[10px]">ERC-721</p>
          <p className="pw-mt-[10px]">{getChainName(chainId)}</p>
        </div>
      </div>
    </div>
  );
};
