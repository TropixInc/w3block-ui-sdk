import { CSSProperties } from 'react';

import { Product } from '../../../storefront/hooks/useGetProductBySlug/useGetProductBySlug';
import { CardTypesEnum, ProductsData } from '../../../storefront/interfaces';
import { ImageSDK } from '../ImageSDK';
import './Card.css';

export const Card = ({
  product,
  config,
}: {
  product: Product;
  config: {
    styleData: ProductsData['styleData'];
    contentData: ProductsData['contentData'];
  };
}) => {
  const { styleData, contentData } = config;
  const linkToSend = () => {
    if (contentData.cardType == CardTypesEnum.CONTENT) {
      if (product.hasLink) {
        return product.slug ?? '';
      }
    } else {
      return `/product/slug/${product.slug}`;
    }
  };
  return (
    <a
      href={linkToSend()}
      style={
        {
          backgroundColor: styleData.cardBackgroundColor ?? 'white',
          boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.08)',
          '--products-card-hover-color': styleData.cardHoverColor,
        } as CSSProperties
      }
      className="pw-box-border pw-border pw-border-solid pw-border-[#DCDCDC] pw-w-full pw-p-[18px] pw-rounded-[20px] pw-bg-white product-card pw-cursor-pointer"
    >
      <div className="pw-flex pw-justify-center pw-w-full">
        <ImageSDK
          src={product.images.length ? product.images[0]?.thumb : undefined}
          className="pw-w-full pw-min-h-[230px] pw-h-full pw-object-cover pw-rounded-md"
        />
      </div>
      {styleData.showCardTitle && (
        <p
          style={{ color: styleData.cardProductNameColor ?? 'black' }}
          className="pw-line-clamp-2 pw-min-h-[36px] pw-text-sm pw-font-[400] pw-mt-2 pw-leading-5"
        >
          {product.name}
        </p>
      )}
      {styleData.showCardDescription && (
        <p
          style={{ color: styleData.cardDescriptionColor ?? '#7E7E7E' }}
          className="pw-text-[#7E7E7E] pw-line-clamp-2 pw-min-h-[36px] pw-mt-2 pw-text-sm pw-leading-5"
        >
          {product.description}
        </p>
      )}
      {styleData.showCardCategory && (
        <p
          style={{ color: styleData.cardCategoryColor ?? '#C63535' }}
          className="pw-text-[#C63535] pw-font-semibold pw-text-sm pw-mt-2 pw-leading-5"
        >
          {product.tags?.map((tag: any) => tag.name).join('/')}
        </p>
      )}
      {styleData.showCardValue && (
        <p
          style={{ color: styleData.cardValueColor ?? 'black' }}
          className="pw-font-bold pw-text-lg pw-mt-2"
        >
          {product.stockAmount == 0 ? (
            'Esgotado'
          ) : (
            <>
              <span className="pw-text-sm pw-pr-2">
                {product.prices[0].currency.symbol}
              </span>
              {product.prices[0].amount}
            </>
          )}
        </p>
      )}
      {styleData.cardActionButton && (
        <button
          disabled={product.stockAmount == 0}
          style={
            {
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.26)',
              color: styleData.cardButtonTextColor ?? 'white',
              '--products-button-hover-color': styleData.cardButtonHoverColor,
              '--products-button-bg-color':
                styleData.cardButtonColor ?? '#295BA6',
            } as CSSProperties
          }
          className="pw-w-full pw-border pw-mt-2 pw-border-solid pw-border-b pw-border-white pw-py-2 pw-font-medium pw-rounded-[48px] product-card-button pw-text-xs"
        >
          {styleData.cardButtonText ?? 'Comprar agora'}
        </button>
      )}
    </a>
  );
};
