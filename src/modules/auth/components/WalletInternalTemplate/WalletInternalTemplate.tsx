/* eslint-disable react-hooks/exhaustive-deps */
import { lazy } from 'react';
const InternalPagesLayoutBase = lazy(() =>
  import(
    '../../../shared/components/InternalPagesLayoutBase/InternalPagesLayoutBase'
  ).then((m) => ({
    default: m.InternalPagesLayoutBase,
  }))
);

import TranslatableComponent from '../../../shared/components/TranslatableComponent';
const WalletHeaderSDK = lazy(() =>
  import('../../../shared/components/WalletHeaderSDK').then((m) => ({
    default: m.WalletHeaderSDK,
  }))
);

import { useHasWallet } from '../../../shared/hooks/useHasWallet';
// import { WalletExtract } from '../WalletExtract';
const TokensListTemplate = lazy(() =>
  import(
    '../../../tokens/components/TokensListTemplate/TokensListTemplate'
  ).then((m) => ({
    default: m.TokensListTemplate,
  }))
);

const _WalletInternalTemplate = () => {
  useHasWallet({});

  return (
    <div className="pw-flex pw-flex-col pw-px-4 sm:pw-px-0">
      <WalletHeaderSDK />
      <div className="pw-mt-6">
        <TokensListTemplate withLayout={false} />
      </div>
    </div>
  );
};

export const WalletInternalTemplate = () => {
  return (
    <TranslatableComponent>
      <InternalPagesLayoutBase
        classes={{ middleSectionContainer: 'pw-mb-[85px]' }}
      >
        <_WalletInternalTemplate />
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
