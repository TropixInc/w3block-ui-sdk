import { threathUrlCloudinary } from '../../shared/utils/threathUrlCloudinary';
import { ProductsDataStyleData, SpecificContentCard } from '../interfaces';

interface ContentCardProps {
  config: ProductsDataStyleData;
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
    titleFontFamily,
    titleFontSize,
    titleFontBold,
    titleFontItalic,
    titleFontSizeType,
    descriptionFontFamily,
    descriptionFontSize,
    descriptionFontBold,
    descriptionFontItalic,
    descriptionFontSizeType,
    categoryFontFamily,
    categoryFontSize,
    categoryFontBold,
    categoryFontItalic,
    categoryFontSizeType,
    valueFontFamily,
    valueFontSize,
    valueFontBold,
    valueFontItalic,
    valueFontSizeType,
  } = config;
  const txtOver = textOverImage != undefined ? textOverImage : true;
  return (
    <>
      <a
        href={
          product.hasLink && product.link && product.link != ''
            ? product.link
            : undefined
        }
        className={`pw-w-full ${!product.hasLink && 'pw-cursor-default'} `}
      >
        {' '}
        {showCardImage && (
          <div
            style={{
              backgroundImage:
                product.image?.assetUrl && showCardImage
                  ? `url('${threathUrlCloudinary({
                      src: product.image.assetUrl ?? '',
                      InternalProps: { width: 600, quality: 'best' },
                    })}') `
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
              format === 'rectVertical'
                ? 'pw-min-h-[380px] pw-max-h-[380px]'
                : ''
            } ${
              format === 'rounded' ? 'pw-rounded-full' : 'pw-rounded-[20px]'
            } `}
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
                      style={{
                        color: cardProductNameColor ?? 'black',
                        fontFamily: titleFontFamily ?? '',
                        fontSize:
                          (titleFontSize &&
                          titleFontSize != '' &&
                          titleFontSize != '0'
                            ? titleFontSize
                            : 14) + (titleFontSizeType == 'rem' ? 'rem' : 'px'),
                        fontWeight: titleFontBold ? 'bold' : 'normal',
                        fontStyle: titleFontItalic ? 'italic' : 'normal',
                        lineHeight:
                          titleFontSize &&
                          titleFontSize != '' &&
                          titleFontSize != '0' &&
                          titleFontSizeType != 'rem'
                            ? parseInt(titleFontSize) -
                              parseInt(titleFontSize) * 0.05 +
                              'px'
                            : 'auto',
                      }}
                      className="pw-line-clamp-2 pw-text-sm pw-font-[400] pw-mt-2 pw-leading-5"
                    >
                      {product.title}
                    </p>
                  )}
                  {showCardDescription && (
                    <p
                      style={{
                        color: cardDescriptionColor ?? '#7E7E7E',
                        fontFamily: descriptionFontFamily ?? '',
                        fontSize:
                          (descriptionFontSize &&
                          descriptionFontSize != '' &&
                          descriptionFontSize != '0'
                            ? descriptionFontSize
                            : 14) +
                          (descriptionFontSizeType == 'rem' ? 'rem' : 'px'),
                        fontWeight: descriptionFontBold ? 'bold' : 'normal',
                        fontStyle: descriptionFontItalic ? 'italic' : 'normal',
                        lineHeight:
                          descriptionFontSize &&
                          descriptionFontSize != '' &&
                          descriptionFontSize != '0' &&
                          descriptionFontSizeType != 'rem'
                            ? parseInt(descriptionFontSize) -
                              parseInt(descriptionFontSize) * 0.05 +
                              'px'
                            : 'auto',
                      }}
                      className="pw-text-[#7E7E7E] pw-line-clamp-2 pw-mt-2 pw-text-sm pw-leading-5"
                    >
                      {product.description}
                    </p>
                  )}
                  {showCardCategory && (
                    <p
                      style={{
                        color: cardCategoryColor ?? '#C63535',
                        fontFamily: categoryFontFamily ?? '',
                        fontSize:
                          (categoryFontSize &&
                          categoryFontSize != '' &&
                          categoryFontSize != '0'
                            ? categoryFontSize
                            : 14) +
                          (categoryFontSizeType == 'rem' ? 'rem' : 'px'),
                        fontWeight: categoryFontBold ? 'bold' : 'normal',
                        fontStyle: categoryFontItalic ? 'italic' : 'normal',
                        lineHeight:
                          categoryFontSize &&
                          categoryFontSize != '' &&
                          categoryFontSize != '0' &&
                          categoryFontSizeType != 'rem'
                            ? parseInt(categoryFontSize) -
                              parseInt(categoryFontSize) * 0.05 +
                              'px'
                            : 'auto',
                      }}
                      className="pw-text-[#C63535] pw-font-semibold pw-text-sm pw-mt-2 pw-leading-5"
                    >
                      {product.category?.map((cat: any) => cat.label).join('/')}
                    </p>
                  )}
                  {showCardValue && (
                    <p
                      style={{
                        color: cardValueColor ?? 'black',
                        fontFamily: valueFontFamily ?? '',
                        fontSize:
                          (valueFontSize &&
                          valueFontSize != '' &&
                          valueFontSize != '0'
                            ? valueFontSize
                            : 14) + (valueFontSizeType == 'rem' ? 'rem' : 'px'),
                        fontWeight: valueFontBold ? 'bold' : 'normal',
                        fontStyle: valueFontItalic ? 'italic' : 'normal',
                        lineHeight:
                          valueFontSize &&
                          valueFontSize != '' &&
                          valueFontSize != '0' &&
                          valueFontSizeType != 'rem'
                            ? parseInt(valueFontSize) -
                              parseInt(valueFontSize) * 0.05 +
                              'px'
                            : 'auto',
                      }}
                      className="pw-font-bold pw-text-lg pw-mt-2"
                    >
                      <span className="pw-text-sm pw-pr-2">R$</span>
                      {product.value}
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
        {!txtOver || format == 'rounded' ? (
          <div className=" pw-pt-4 pw-px-[24px]">
            {showCardTitle && (
              <p
                style={{
                  color: cardProductNameColor ?? 'black',
                  textAlign: format == 'rounded' ? 'center' : 'left',
                  fontFamily: titleFontFamily ?? '',
                  fontSize:
                    (titleFontSize &&
                    titleFontSize != '' &&
                    titleFontSize != '0'
                      ? titleFontSize
                      : 14) + (titleFontSizeType == 'rem' ? 'rem' : 'px'),
                  fontWeight: titleFontBold ? 'bold' : 'normal',
                  fontStyle: titleFontItalic ? 'italic' : 'normal',
                  lineHeight:
                    titleFontSize &&
                    titleFontSize != '' &&
                    titleFontSize != '0' &&
                    titleFontSizeType != 'rem'
                      ? parseInt(titleFontSize) -
                        parseInt(titleFontSize) * 0.05 +
                        'px'
                      : 'auto',
                }}
                className="pw-line-clamp-2 pw-font-[400] pw-mt-2 "
              >
                {product.title}
              </p>
            )}
            {showCardDescription && (
              <p
                style={{
                  color: cardDescriptionColor ?? '#7E7E7E',
                  textAlign: format == 'rounded' ? 'center' : 'left',
                  fontFamily: descriptionFontFamily ?? '',
                  fontSize:
                    (descriptionFontSize &&
                    descriptionFontSize != '' &&
                    descriptionFontSize != '0'
                      ? descriptionFontSize
                      : 14) + (descriptionFontSizeType == 'rem' ? 'rem' : 'px'),
                  fontWeight: descriptionFontBold ? 'bold' : 'normal',
                  fontStyle: descriptionFontItalic ? 'italic' : 'normal',
                  lineHeight:
                    descriptionFontSize &&
                    descriptionFontSize != '' &&
                    descriptionFontSize != '0' &&
                    descriptionFontSizeType != 'rem'
                      ? parseInt(descriptionFontSize) -
                        parseInt(descriptionFontSize) * 0.05 +
                        'px'
                      : 'auto',
                }}
                className="pw-text-[#7E7E7E] pw-line-clamp-2 pw-mt-2 pw-text-sm pw-leading-5"
              >
                {product.description}
              </p>
            )}
            {showCardCategory && (
              <p
                style={{
                  color: cardCategoryColor ?? '#C63535',
                  textAlign: format == 'rounded' ? 'center' : 'left',
                  fontFamily: categoryFontFamily ?? '',
                  fontSize:
                    (categoryFontSize &&
                    categoryFontSize != '' &&
                    categoryFontSize != '0'
                      ? categoryFontSize
                      : 14) + (categoryFontSizeType == 'rem' ? 'rem' : 'px'),
                  fontWeight: categoryFontBold ? 'bold' : 'normal',
                  fontStyle: categoryFontItalic ? 'italic' : 'normal',
                  lineHeight:
                    categoryFontSize &&
                    categoryFontSize != '' &&
                    categoryFontSize != '0' &&
                    categoryFontSizeType != 'rem'
                      ? parseInt(categoryFontSize) -
                        parseInt(categoryFontSize) * 0.05 +
                        'px'
                      : 'auto',
                }}
                className="pw-text-[#C63535] pw-font-semibold pw-text-sm pw-mt-2 pw-leading-5"
              >
                {product.category?.map((cat: any) => cat.label).join('/')}
              </p>
            )}
            {showCardValue && (
              <p
                style={{
                  color: cardValueColor ?? 'black',
                  textAlign: format == 'rounded' ? 'center' : 'left',
                  fontFamily: valueFontFamily ?? '',
                  fontSize:
                    (valueFontSize &&
                    valueFontSize != '' &&
                    valueFontSize != '0'
                      ? valueFontSize
                      : 14) + (valueFontSizeType == 'rem' ? 'rem' : 'px'),
                  fontWeight: valueFontBold ? 'bold' : 'normal',
                  fontStyle: valueFontItalic ? 'italic' : 'normal',
                  lineHeight:
                    valueFontSize &&
                    valueFontSize != '' &&
                    valueFontSize != '0' &&
                    valueFontSizeType != 'rem'
                      ? parseInt(valueFontSize) -
                        parseInt(valueFontSize) * 0.05 +
                        'px'
                      : 'auto',
                }}
                className="pw-font-bold pw-text-lg pw-mt-2"
              >
                <span className="pw-text-sm pw-pr-2">R$</span>
                {product.value}
              </p>
            )}
          </div>
        ) : null}
      </a>
    </>
  );
};
