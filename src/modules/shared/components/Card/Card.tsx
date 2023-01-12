import { CSSProperties } from 'react';

import { CardConfig } from '../../../storefront/interfaces/Card';
import { Product } from '../../../storefront/interfaces/Product';
import { ImageSDK } from '../ImageSDK';

import './Card.css';

export const Card = ({
  product,
  config,
}: {
  product: Product;
  config: CardConfig;
}) => {
  // const router = useRouter();

  return (
    <div
      style={
        {
          boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.08)',
          '--products-card-hover-color': config.cardHoverColor,
        } as CSSProperties
      }
      className="pw-border pw-border-solid pw-border-[#DCDCDC] pw-w-[296px] pw-p-[18px] pw-rounded-[20px] pw-bg-white product-card"
      onClick={() => {
        // router.push(card.url);
      }}
    >
      <div className="pw-flex pw-justify-center">
        <ImageSDK src={product.img} className="pw-w-[260px] pw-h-[260px]" />
      </div>
      {config.showCardName && (
        <p className="pw-line-clamp-2 pw-min-h-[36px]">{product.name}</p>
      )}
      {config.showCardDescription && (
        <p className="pw-text-[#7E7E7E] pw-line-clamp-2 pw-min-h-[36px]">
          {product.description}
        </p>
      )}
      {config.showCardCategory && (
        <p className="pw-text-[#C63535] pw-font-semibold">{product.category}</p>
      )}
      {config.showCardPrice && (
        <p className="pw-font-bold pw-text-lg">
          <span className="pw-text-sm pw-pr-2">R$</span>
          {product.price}
        </p>
      )}
      {config.showCardButton && (
        <button
          style={
            {
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.26)',
              color: config.buttonTextColor,
              '--products-button-hover-color': config.buttonHoverColor,
              '--products-button-bg-color': config.buttonBgColor,
            } as CSSProperties
          }
          className="pw-w-full pw-border pw-border-solid pw-border-b pw-border-white pw-py-2 pw-font-medium pw-rounded-[48px] product-card-button"
        >
          {config.buttonText}
        </button>
      )}
    </div>
  );
};
