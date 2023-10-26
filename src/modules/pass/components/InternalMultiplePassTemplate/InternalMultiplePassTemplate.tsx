const InternalPagesLayoutBase = lazy(() =>
  import('../../../shared/components/InternalPagesLayoutBase').then((mod) => ({
    default: mod.InternalPagesLayoutBase,
  }))
);

const TokenDetailsCard = lazy(() =>
  import('../../../tokens/components/TokenDetailsCard').then((mod) => ({
    default: mod.TokenDetailsCard,
  }))
);

import { lazy } from 'react';

import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import useRouter from '../../../shared/hooks/useRouter';
import { usePublicTokenData } from '../../../tokens/hooks/usePublicTokenData';
import {
  Dimensions2DValue,
  Dimensions3DValue,
} from '../../../tokens/interfaces/DimensionsValue';

const _InternalMultiplePassTemplate = () => {
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
    <TokenDetailsCard
      tokenData={
        (publicTokenResponse?.data?.dynamicInformation.tokenData as Record<
          string,
          string | Dimensions2DValue | Dimensions3DValue
        >) ?? {}
      }
      tokenTemplate={
        publicTokenResponse?.data?.dynamicInformation.publishedTokenTemplate ??
        {}
      }
      contract={publicTokenResponse?.data?.information?.contractName}
      description={publicTokenResponse?.data?.information?.description}
      title={publicTokenResponse?.data?.information?.title}
      mainImage={publicTokenResponse?.data?.information?.mainImage ?? ''}
      editionNumber={publicTokenResponse.data?.edition?.currentNumber}
      className="pw-mb-6"
      isMultiplePass={true}
    />
  ) : null;
};

export const InternalMultiplePassTemplate = () => (
  <TranslatableComponent>
    <InternalPagesLayoutBase>
      <_InternalMultiplePassTemplate />
    </InternalPagesLayoutBase>
  </TranslatableComponent>
);
