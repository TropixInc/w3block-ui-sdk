import { CSSProperties } from 'react';

import { Product, ProductsDefault } from '../../../storefront/interfaces';

import './Card.css';

export const Card = ({
  product,
  card,
  button,
}: {
  product: Product;
  card: ProductsDefault['card'];
  button: ProductsDefault['button'] & { text?: string };
}) => {
  const imgSize = 260;
  // const router = useRouter();

  return (
    <div
      style={
        {
          border: '1px solid #DCDCDC',
          boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.08)',
          '--products-card-hover-color': card.hoverColor,
        } as CSSProperties
      }
      className={`pw-w-[296px] pw-p-[18px] pw-rounded-[20px] pw-bg-white product-card`}
      onClick={() => {
        // router.push(card.url);
      }}
    >
      <div className="pw-flex pw-justify-center">
        <img src={product.img} width={imgSize} height={imgSize} />
      </div>
      {card.name && <p>{product.name}</p>}
      {card.description && (
        <p className="pw-text-[#7E7E7E]">{product.description}</p>
      )}
      {card.category && (
        <p className="pw-text-[#C63535] pw-font-semibold">{product.category}</p>
      )}
      {card.price && (
        <p className="pw-font-bold pw-text-lg">
          <span className="pw-text-sm pw-pr-2">R$</span>
          {product.price}
        </p>
      )}
      {card.button && (
        <button
          style={
            {
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.26)',
              color: button.textColor,
              '--products-button-hover-color': button.hoverColor,
              '--products-button-bg-color': button.bgColor,
            } as CSSProperties
          }
          className={`pw-w-full pw-border-b pw-border-white pw-py-2 pw-font-medium pw-rounded-[48px] product-card-button`}
        >
          {button?.text || ''}
        </button>
      )}
    </div>
  );
};
