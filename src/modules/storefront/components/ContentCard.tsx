import { useRouterConnect } from '../../shared';
import { ProductsData, SpecificContentCard } from '../interfaces';

interface ContentCardProps {
  config: ProductsData;
  product: SpecificContentCard;
}

export const ContentCard = ({ config, product }: ContentCardProps) => {
  const {
    format,
    showCardImage,
    cardProductNameColor,
    showCardTitle,
    showCardDescription,
    showCardCategory,
    showCardValue,
    cardDescriptionColor,
    cardCategoryColor,
    cardValueColor,
    textOverImage,
  } = config.styleData;
  const txtOver = textOverImage != undefined ? textOverImage : true;
  const router = useRouterConnect();
  return (
    <>
      <div
        onClick={() => {
          if (product.hasLink && product.link && product.link != '') {
            router.pushConnect(product.link);
          }
        }}
        className="pw-w-full pw-cursor-pointer"
      >
        {' '}
        <div
          style={{
            backgroundImage:
              product.image?.assetUrl && showCardImage
                ? `url('${product.image.assetUrl}') `
                : 'white',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
          className={` pw-w-full pw-relative ${
            format === 'square' || format == 'rounded'
              ? 'pw-h-0 pw-pt-[100%] '
              : ''
          } ${
            format === 'rectHorizontal'
              ? 'pw-min-h-[200px] pw-max-h-[200px]'
              : ''
          } ${
            format === 'rectVertical' ? 'pw-min-h-[380px] pw-max-h-[380px]' : ''
          } ${format === 'rounded' ? 'pw-rounded-full' : 'pw-rounded-[20px]'} `}
        >
          <div
            style={{
              backgroundColor:
                product.overlay && product.cardOverlayColor
                  ? product.cardOverlayColor
                  : 'rgba(0,0,0,0)',
            }}
            className={`pw-absolute pw-top-0 pw-left-0 pw-h-full pw-w-full  ${
              format === 'rounded' ? 'pw-rounded-full' : 'pw-rounded-[20px]'
            }`}
          >
            {txtOver && format != 'rounded' ? (
              <div className="pw-flex pw-flex-col pw-justify-end pw-w-full pw-h-full pw-p-[24px]">
                {showCardTitle && (
                  <p
                    style={{ color: cardProductNameColor ?? 'black' }}
                    className="pw-line-clamp-2 pw-text-sm pw-font-poppins pw-font-[400] pw-mt-2 pw-leading-5"
                  >
                    {product.title}
                  </p>
                )}
                {showCardDescription && (
                  <p
                    style={{ color: cardDescriptionColor ?? '#7E7E7E' }}
                    className="pw-text-[#7E7E7E] pw-line-clamp-2 pw-mt-2 pw-text-sm pw-font-poppins pw-leading-5"
                  >
                    {product.description}
                  </p>
                )}
                {showCardCategory && (
                  <p
                    style={{ color: cardCategoryColor ?? '#C63535' }}
                    className="pw-text-[#C63535] pw-font-semibold pw-font-poppins pw-text-sm pw-mt-2 pw-leading-5"
                  >
                    {product.category?.map((cat: any) => cat.label).join('/')}
                  </p>
                )}
                {showCardValue && (
                  <p
                    style={{ color: cardValueColor ?? 'black' }}
                    className="pw-font-bold pw-font-poppins pw-text-lg pw-mt-2"
                  >
                    <span className="pw-text-sm pw-pr-2">R$</span>
                    {product.value}
                  </p>
                )}
              </div>
            ) : null}
          </div>
        </div>
        {!txtOver || format == 'rounded' ? (
          <div className=" pw-pt-4 pw-px-[24px]">
            {showCardTitle && (
              <p
                style={{
                  color: cardProductNameColor ?? 'black',
                  textAlign: format == 'rounded' ? 'center' : 'left',
                }}
                className="pw-line-clamp-2 pw-text-sm pw-font-poppins pw-font-[400] pw-mt-2 pw-leading-5"
              >
                {product.title}
              </p>
            )}
            {showCardDescription && (
              <p
                style={{
                  color: cardDescriptionColor ?? '#7E7E7E',
                  textAlign: format == 'rounded' ? 'center' : 'left',
                }}
                className="pw-text-[#7E7E7E] pw-line-clamp-2 pw-mt-2 pw-text-sm pw-font-poppins pw-leading-5"
              >
                {product.description}
              </p>
            )}
            {showCardCategory && (
              <p
                style={{
                  color: cardCategoryColor ?? '#C63535',
                  textAlign: format == 'rounded' ? 'center' : 'left',
                }}
                className="pw-text-[#C63535] pw-font-semibold pw-font-poppins pw-text-sm pw-mt-2 pw-leading-5"
              >
                {product.category?.map((cat: any) => cat.label).join('/')}
              </p>
            )}
            {showCardValue && (
              <p
                style={{
                  color: cardValueColor ?? 'black',
                  textAlign: format == 'rounded' ? 'center' : 'left',
                }}
                className="pw-font-bold pw-font-poppins pw-text-lg pw-mt-2"
              >
                <span className="pw-text-sm pw-pr-2">R$</span>
                {product.value}
              </p>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
};
