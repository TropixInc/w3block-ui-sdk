import { CSSProperties } from 'react';

import { ProductsData } from '../../../storefront/interfaces';
import { Product } from '../../../storefront/interfaces/Product';
import { ImageSDK } from '../ImageSDK';

import './Card.css';

export const Card = ({
  product,
  config,
}: {
  product: Product;
  config: ProductsData;
}) => {
  // const router = useRouter();
  const { styleData } = config;
  return (
    <div
      style={
        {
          backgroundColor: styleData.cardBackgroundColor ?? 'white',
          boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.08)',
          '--products-card-hover-color': styleData.cardHoverColor,
        } as CSSProperties
      }
      className="pw-box-border pw-border pw-border-solid pw-border-[#DCDCDC] pw-w-full pw-p-[18px] pw-rounded-[20px] pw-bg-white product-card"
      onClick={() => {
        // router.push(card.url);
      }}
    >
      <div className="pw-flex pw-justify-center pw-w-full">
        <ImageSDK
          src={product.img.assetUrl}
          className="pw-w-full pw-min-h-[180px] pw-h-[180px] pw-object-cover pw-rounded-md"
        />
      </div>
      {styleData.showCardTitle && (
        <p
          style={{ color: styleData.cardProductNameColor ?? 'black' }}
          className="pw-line-clamp-2 pw-min-h-[36px] pw-text-sm pw-font-poppins pw-font-[400] pw-mt-2 pw-leading-5"
        >
          {product.name}
        </p>
      )}
      {styleData.showCardDescription && (
        <p
          style={{ color: styleData.cardDescriptionColor ?? '#7E7E7E' }}
          className="pw-text-[#7E7E7E] pw-line-clamp-2 pw-min-h-[36px] pw-mt-2 pw-text-sm pw-font-poppins pw-leading-5"
        >
          {product.description}
        </p>
      )}
      {styleData.showCardCategory && (
        <p
          style={{ color: styleData.cardCategoryColor ?? '#C63535' }}
          className="pw-text-[#C63535] pw-font-semibold pw-font-poppins pw-text-sm pw-mt-2 pw-leading-5"
        >
          {product.category}
        </p>
      )}
      {styleData.showCardValue && (
        <p
          style={{ color: styleData.cardValueColor ?? 'black' }}
          className="pw-font-bold pw-font-poppins pw-text-lg pw-mt-2"
        >
          <span className="pw-text-sm pw-pr-2">R$</span>
          {product.price}
        </p>
      )}
      {styleData.cardActionButton && (
        <button
          style={
            {
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.26)',
              color: styleData.cardButtonTextColor ?? 'white',
              '--products-button-hover-color': styleData.cardButtonHoverColor,
              '--products-button-bg-color':
                styleData.cardButtonColor ?? '#295BA6',
            } as CSSProperties
          }
          className="pw-w-full pw-border pw-mt-2 pw-border-solid pw-border-b pw-border-white pw-py-2 pw-font-medium pw-rounded-[48px] product-card-button pw-font-poppins pw-text-xs"
        >
          {styleData.cardButtonText ?? 'Comprar agora'}
        </button>
      )}
    </div>
  );
};
