import { lazy } from 'react';

import classNames from 'classnames';

import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import useTranslation from '../../../shared/hooks/useTranslation';

const TokenCommerceHero = lazy(() =>
  import('./TokenCommerceHero/TokenCommerceHero').then((m) => ({
    default: m.TokenCommerceHero,
  }))
);

import { Source } from './TokenCommerceHero';

interface TokenCommerceTemplateProps {
  tokenSrc?: Source;
  tokenName?: string;
  tokenSubtitle?: string;
  tokenDescription?: string;
  tokenPrice?: string;
  tokenCategories?: Array<string>;
  className?: string;
  container?: boolean;
}

const _TokenCommerceTemplate = ({
  tokenCategories,
  tokenName,
  tokenPrice,
  tokenSrc,
  tokenSubtitle,
  tokenDescription,
  className,
  container = true,
}: TokenCommerceTemplateProps) => {
  const [translate] = useTranslation();
  return (
    <div className={className}>
      <TokenCommerceHero
        tokenCategories={tokenCategories}
        tokenName={tokenName}
        tokenPrice={tokenPrice}
        tokenSrc={tokenSrc}
        tokenSubtitle={tokenSubtitle}
        container={container}
      />
      <div
        className={classNames(
          'pw-px-[68px] pw-py-[75px]',
          container && 'pw-container pw-mx-auto'
        )}
      >
        <p className="pw-font-poppins pw-font-semibold pw-text-2xl">
          {translate('token>commerceTemplate>productDescription')}
        </p>
        <p className="pw-font-poppins pw-font-normal pw-text-sm">
          {tokenDescription}
        </p>
      </div>
    </div>
  );
};

export const TokenCommerceTemplate = (props: TokenCommerceTemplateProps) => {
  return (
    <TranslatableComponent>
      <_TokenCommerceTemplate {...props} />
    </TranslatableComponent>
  );
};
