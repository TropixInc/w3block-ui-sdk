/* eslint-disable @typescript-eslint/no-explicit-any */
import { CSSProperties, lazy } from 'react';

import classNames from 'classnames';
import _ from 'lodash';
import { Product } from '../interfaces/Product';
import { CardTypesEnum, ProductsData } from '../interfaces/Theme';
import { useDynamicApi } from '../provider/DynamicApiProvider';
import { useDynamicString } from '../hooks/useDynamicString';
import { ImageSDK } from '../../shared/components/ImageSDK';
import { composeUrlCloudinary } from '../../shared/utils/composeUrlCloudinary';




export const Card = ({
  product,
  config,
  dynamic = false,
}: {
  product: Product;
  config: {
    styleData: ProductsData['styleData'];
    contentData: ProductsData['contentData'];
  };
  dynamic?: boolean;
}) => {
  const { styleData, contentData } = config;
  const { datasource } = useDynamicApi();
  const { text: title } = useDynamicString(product.name);
  const { text: description } = useDynamicString(product.description);
  const { text: buttonText } = useDynamicString(styleData.cardButtonText);
  const linkToSend = () => {
    if (contentData.cardType == CardTypesEnum.CONTENT) {
      if (product.hasLink) {
        return _.get(datasource, product.slug, product.slug);
      }
    } else {
      return `/item/${product.slug}`;
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
          src={
            product.images.length
              ? dynamic
                ? composeUrlCloudinary({
                    src:
                      _.get(
                        datasource,
                        product.images[0]?.thumb ?? '',
                        product.images[0]?.thumb
                      ) ?? '',
                    InternalProps: {
                      width:
                        styleData.imageCardCompression === 'no-compression'
                          ? undefined
                          : 800,
                      quality: styleData.imageCardCompression
                        ? styleData.imageCardCompression
                        : 'best',
                    },
                  })
                : product.images[0]?.thumb ?? ''
              : undefined
          }
          className={classNames(
            'pw-w-full pw-min-h-[230px] pw-h-full pw-rounded-md',
            styleData.objectFit
              ? `pw-object-${styleData.objectFit}`
              : 'pw-object-cover'
          )}
          quality="best"
          width={600}
        />
      </div>
      {styleData.showCardTitle && (
        <p
          style={{
            color: styleData.cardProductNameColor ?? 'black',
            fontFamily: styleData.titleFontFamily ?? '',
            fontSize:
              styleData.titleFontSize &&
              styleData.titleFontSize != '' &&
              styleData.titleFontSize != '0'
                ? styleData.titleFontSize +
                  (styleData.titleFontSizeType == 'rem' ? 'rem' : 'px')
                : '',
            fontWeight:
              styleData.titleFontBold != undefined
                ? styleData.titleFontBold
                  ? 'bold'
                  : 'normal'
                : 'bold',
            fontStyle: styleData.titleFontItalic ? 'italic' : 'normal',
            lineHeight:
              styleData.titleFontSize &&
              styleData.titleFontSize != '' &&
              styleData.titleFontSize != '0' &&
              styleData.titleFontSizeType != 'rem'
                ? (
                    parseInt(styleData.titleFontSize) -
                    parseInt(styleData.titleFontSize) * 0.05
                  ).toFixed(0) + 'px'
                : 'auto',
          }}
          className="pw-line-clamp-2 pw-min-h-[36px] pw-text-sm pw-font-[400] pw-mt-2 pw-leading-5"
        >
          {title}
        </p>
      )}
      {styleData.showCardDescription && (
        <p
          style={{
            color: styleData.cardDescriptionColor ?? '#7E7E7E',
            fontFamily: styleData.descriptionFontFamily ?? '',
            fontSize:
              styleData.descriptionFontSize &&
              styleData.descriptionFontSize != '' &&
              styleData.descriptionFontSize != '0'
                ? styleData.descriptionFontSize +
                  (styleData.descriptionFontSizeType == 'rem' ? 'rem' : 'px')
                : '',
            fontWeight: styleData.descriptionFontBold ? 'bold' : 'normal',
            fontStyle: styleData.descriptionFontItalic ? 'italic' : 'normal',
            lineHeight:
              styleData.descriptionFontSize &&
              styleData.descriptionFontSize != '' &&
              styleData.descriptionFontSize != '0' &&
              styleData.descriptionFontSizeType != 'rem'
                ? (
                    parseInt(styleData.descriptionFontSize) -
                    parseInt(styleData.descriptionFontSize) * 0.05
                  ).toFixed(0) + 'px'
                : 'auto',
          }}
          dangerouslySetInnerHTML={{
            __html: description ?? '',
          }}
          className={`pw-text-[#7E7E7E] ${
            /<[a-z][\s\S]*?>|<\/[a-z][\s\S]*?>/i.test(description)
              ? ''
              : 'pw-line-clamp-2'
          } pw-min-h-[36px] pw-mt-2 pw-text-sm pw-leading-5`}
        ></p>
      )}
      {styleData.showCardCategory && (
        <p
          style={{
            color: styleData.cardCategoryColor ?? '#C63535',
            fontFamily: styleData.categoryFontFamily ?? '',
            fontSize:
              styleData.categoryFontSize &&
              styleData.categoryFontSize != '' &&
              styleData.categoryFontSize != '0'
                ? styleData.categoryFontSize +
                  (styleData.categoryFontSizeType == 'rem' ? 'rem' : 'px')
                : '',
            fontWeight: styleData.categoryFontBold ? 'bold' : 'normal',
            fontStyle: styleData.categoryFontItalic ? 'italic' : 'normal',
            lineHeight:
              styleData.categoryFontSize &&
              styleData.categoryFontSize != '' &&
              styleData.categoryFontSize != '0' &&
              styleData.categoryFontSizeType != 'rem'
                ? (
                    parseInt(styleData.categoryFontSize) -
                    parseInt(styleData.categoryFontSize) * 0.05
                  ).toFixed(0) + 'px'
                : 'auto',
          }}
          className="pw-text-[#C63535] pw-font-semibold pw-text-sm pw-mt-2 pw-leading-5"
        >
          {product.tags?.map((tag: any) => tag.name).join('/')}
        </p>
      )}
      {styleData.showCardValue && (
        <p
          style={{
            color: styleData.cardValueColor ?? 'black',
            fontFamily: styleData.valueFontFamily ?? '',
            fontSize:
              styleData.valueFontSize &&
              styleData.valueFontSize != '' &&
              styleData.valueFontSize != '0'
                ? styleData.valueFontSize +
                  (styleData.valueFontSizeType == 'rem' ? 'rem' : 'px')
                : '',
            fontWeight: styleData.valueFontBold ? 'bold' : 'normal',
            fontStyle: styleData.valueFontItalic ? 'italic' : 'normal',
            lineHeight:
              styleData.valueFontSize &&
              styleData.valueFontSize != '' &&
              styleData.valueFontSize != '0' &&
              styleData.valueFontSizeType != 'rem'
                ? (
                    parseInt(styleData.valueFontSize) -
                    parseInt(styleData.valueFontSize) * 0.05
                  ).toFixed(0) + 'px'
                : 'auto',
          }}
          className="pw-font-bold pw-text-lg pw-mt-2"
        >
          {product.stockAmount == 0 ? (
            'Esgotado'
          ) : (
            <>
              <span className="pw-text-sm pw-pr-2">
                {product.prices[0].currency.symbol}
              </span>
              {_.get(
                datasource,
                product.prices[0].amount,
                product.prices[0].amount
              )}
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
              '--products-button-hover-color':
                styleData.cardButtonHoverColor ?? styleData.cardButtonColor,
              '--products-button-bg-color':
                styleData.cardButtonColor ?? '#295BA6',
            } as CSSProperties
          }
          className="pw-w-full pw-border pw-mt-2 pw-border-solid pw-border-b pw-border-white pw-py-2 pw-font-medium pw-rounded-[48px] product-card-button pw-text-xs"
        >
          {buttonText ?? 'Comprar agora'}
        </button>
      )}
    </a>
  );
};
