/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';
import _ from 'lodash';
import { Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import {
  breakpointsEnum,
  useBreakpoints,
} from '../../shared/hooks/useBreakpoints/useBreakpoints';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import useIsMobile from '../../shared/hooks/useIsMobile/useIsMobile';
import useTranslation from '../../shared/hooks/useTranslation';
import { composeUrlCloudinary } from '../../shared/utils/composeUrlCloudinary';
import { convertSpacingToCSS } from '../../shared/utils/convertSpacingToCSS';
import { Product } from '../hooks/useGetProductBySlug/useGetProductBySlug';
import { useMobilePreferenceDataWhenMobile } from '../hooks/useMergeMobileData/useMergeMobileData';
import {
  AlignmentEnum,
  CardLayoutDisposition,
  CardTypesEnum,
  ProductsData,
} from '../interfaces';
import './Products.css';
import 'swiper/css';
import 'swiper/css/navigation';
import { useDynamicApi } from '../provider/DynamicApiProvider';
import { changeDynamicJsonToInsertIndex } from '../utils/jsonTransformation';
import { useDynamicString } from '../hooks/useDynamicString';
import { BaseSelect } from '../../shared';
const Card = lazy(() =>
  import('../../shared/components/Card').then((module) => ({
    default: module.Card,
  }))
);
const ContentCard = lazy(() =>
  import('./ContentCard').then((module) => ({
    default: module.ContentCard,
  }))
);

export const Products = ({ data }: { data: ProductsData }) => {
  const { styleData, contentData, mobileStyleData, mobileContentData, id } =
    data;

  const mergedStyleData = useMobilePreferenceDataWhenMobile(
    styleData,
    mobileStyleData
  );
  const mergedContentData = useMobilePreferenceDataWhenMobile(
    contentData,
    mobileContentData
  );
  const [translate] = useTranslation();

  const optionsSorting = [
    {
      label: translate('storefront>products>relevance'),
      value: 'relevance',
    },
    {
      label: translate('storefront>products>alphabetical'),
      value: 'name',
    },
    {
      label: translate('storefront>products>highestPrice'),
      value: 'highestPrice',
    },
    {
      label: translate('storefront>products>lowestPrice'),
      value: 'lowestPrice',
    },
  ];

  const [products, setProducts] = useState<Product[]>([]);
  const [error, __] = useState('');

  console.log(contentData, 'contentData');

  const breakpoint = useBreakpoints();
  const {
    layoutDisposition,
    autoSlide,
    itensPerLine,
    totalRows,
    backgroundColor,
    backgroundUrl,
    format,
    sessionButton,
    sessionButtonColor,
    sessionButtonTextColor,
    sessionAlignment,
    sessionLink,
    sessionButtonText,
    margin,
    padding,
    cardProductOverlay,
    productOverlay,
    hasSpaceBetween,
    imageCompression,
  } = mergedStyleData;
  const {
    moduleTitle,
    cardType,
    contentCards,
    moduleTitleColor,
    cardSearch,
    titleAlignment,
    moduleFontSize,
    moduleFontBold,
    moduleFontItalic,
    moduleFontSizeType,
    moduleFontFamily,
    dynamicCards,
    dynamicCardsPath,
    dynamicMaxItens,
    allowSorting,
    defaultSorting,
  } = mergedContentData;

  const [sort, setSort] = useState(defaultSorting ?? '');

  const { datasource } = useDynamicApi();
  const { text: title } = useDynamicString(moduleTitle);
  const dynamicCardsData = useMemo(() => {
    if (dynamicCards == true && contentCards && contentCards.length > 0) {
      const itemsToRender = _.get(datasource, dynamicCardsPath ?? '', []).slice(
        0,
        dynamicMaxItens ?? 10
      ) as any[];
      const productToFollow = contentCards[0];
      return itemsToRender.map((_, index) =>
        changeDynamicJsonToInsertIndex(productToFollow, index)
      );
    } else {
      return contentCards;
    }
  }, [
    dynamicCards,
    dynamicCardsPath,
    dynamicMaxItens,
    datasource,
    contentCards,
  ]);
  const { companyId } = useCompanyConfig();
  const axios = useAxios(W3blockAPI.COMMERCE);

  const quantityOfItemsGrid = () => {
    if (breakpoint == breakpointsEnum.XS) {
      return 1;
    } else if (
      breakpoint == breakpointsEnum.SM &&
      itensPerLine &&
      itensPerLine > 2
    ) {
      return 2;
    } else if (
      breakpoint == breakpointsEnum.LG &&
      itensPerLine &&
      itensPerLine > 3
    ) {
      return 3;
    } else {
      return itensPerLine ?? 4;
    }
  };

  const gridMaxItemsTotal = quantityOfItemsGrid() * (totalRows ? totalRows : 2);
  const carouselMaxItems = (itensPerLine ? itensPerLine : 4) * (totalRows ?? 2);
  const carouselSize =
    layoutDisposition === CardLayoutDisposition.GRID
      ? gridMaxItemsTotal
      : carouselMaxItems;

  useEffect(() => {
    if (cardType == CardTypesEnum.DYNAMIC) {
      if (sort === 'name') {
        callApiForDynamicProducts(
          `/companies/${companyId}/products?limit={limit}&sortBy=name&orderBy=ASC&${
            cardSearch && cardSearch.length > 0
              ? `${cardSearch?.map((cs) => `tagIds=${cs.value}`).join('&')}`
              : ''
          }`
        );
      } else if (sort === 'relevance') {
        callApiForDynamicProducts(
          `/companies/${companyId}/products?limit={limit}&sortBy=relevance&orderBy=DESC&${
            cardSearch && cardSearch.length > 0
              ? `${cardSearch?.map((cs) => `tagIds=${cs.value}`).join('&')}`
              : ''
          }`
        );
      } else if (sort === 'lowestPrice') {
        callApiForDynamicProducts(
          `/companies/${companyId}/products?limit={limit}&sortBy=price&orderBy=ASC&sortByPriceCurrencyId=${
            mergedContentData.currencyId ?? ''
          }&${
            cardSearch && cardSearch.length > 0
              ? `${cardSearch?.map((cs) => `tagIds=${cs.value}`).join('&')}`
              : ''
          }`
        );
      } else if (sort === 'highestPrice') {
        callApiForDynamicProducts(
          `/companies/${companyId}/products?limit={limit}&sortBy=price&orderBy=DESC&&sortByPriceCurrencyId=${
            mergedContentData.currencyId ?? ''
          }&${
            cardSearch && cardSearch.length > 0
              ? `${cardSearch?.map((cs) => `tagIds=${cs.value}`).join('&')}`
              : ''
          }`
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cardSearch,
    cardType,
    breakpoint,
    totalRows,
    itensPerLine,
    companyId,
    sort,
  ]);

  const callApiForDynamicProducts = (url: string) => {
    const limit = carouselSize;
    if (companyId)
      axios.get(url.replace('{limit}', limit.toString())).then((response) => {
        if (response) {
          setProducts(response.data.items);
        }
      });
  };

  const clampedProducts = products?.slice(0, carouselSize);

  const GridProducts = () => {
    return (
      <div
        id={`sf-${id}`}
        style={{
          gridTemplateColumns: `repeat(${quantityOfItemsGrid()}, minmax(0, 1fr))`,
        }}
        className={`pw-grid pw-gap-4 pw-w-full pw-flex-1 pw-box-border`}
      >
        {cardType == 'content' && format && format != 'product'
          ? dynamicCardsData
              ?.slice(0, (itensPerLine ?? 4) * (totalRows ?? 2))
              .map((card) => (
                <ContentCard
                  key={card.id}
                  product={card}
                  config={mergedStyleData}
                  cardType={cardType}
                />
              ))
          : cardType == 'content' && (!format || format == 'product')
          ? dynamicCardsData
              ?.slice(0, (itensPerLine ?? 4) * (totalRows ?? 2))
              .map((p) => (
                <Card
                  key={p?.id}
                  product={{
                    tags:
                      p?.category?.map((cat: any) => ({
                        name: cat.label,
                        id: cat.value,
                      })) ?? [],
                    name: p?.title ?? '',
                    description: p?.description ?? '',
                    id: p?.id ?? '',
                    slug: p.link ?? '',
                    hasLink: p.hasLink,
                    images: [
                      {
                        assetId: p?.image?.assetId,
                        thumb: p?.image?.assetUrl,
                        original: p?.image?.assetUrl,
                      },
                    ],
                    prices: [
                      {
                        amount: p?.value ?? '',
                        currency: { symbol: 'R$' },
                      },
                    ],
                  }}
                  config={{
                    styleData: mergedStyleData,
                    contentData: mergedContentData,
                  }}
                />
              ))
          : format === 'product'
          ? clampedProducts?.map((p) => (
              <Card
                key={p.id}
                product={p}
                config={{
                  styleData: mergedStyleData,
                  contentData: mergedContentData,
                }}
              />
            ))
          : clampedProducts?.map((p) => (
              <ContentCard
                key={p.id}
                product={{
                  title: p?.name ?? '',
                  value: p?.prices?.[0]?.amount ?? '',
                  hasLink: p?.hasLink,
                  id: p?.id ?? '',
                  link: p?.slug ?? '',
                  image: {
                    assetId: p?.images?.[0]?.assetId ?? '',
                    assetUrl: p?.images?.[0]?.original ?? '',
                  },
                  description: p?.description,
                  category: p?.tags?.map((val) => ({
                    label: val?.name ?? '',
                    value: val?.id ?? '',
                  })),
                  cardOverlayColor: cardProductOverlay,
                  overlay: productOverlay,
                }}
                config={mergedStyleData}
                cardType={cardType}
              />
            ))}
      </div>
    );
  };

  const SliderProducts = () => {
    const isMobile = useIsMobile();
    const slicedBreakPoints = [
      { key: 640, value: { slidesPerView: 1, spaceBetween: 16 } },
      { key: 768, value: { slidesPerView: 2, spaceBetween: 16 } },
      { key: 1024, value: { slidesPerView: 3, spaceBetween: 16 } },
      {
        key: 1280,
        value: { slidesPerView: itensPerLine, spaceBetween: 16 },
      },
    ]
      .slice(0, 10)
      .reduce(
        (obj, item) => Object.assign(obj, { [item.key]: item.value }),
        {}
      );

    return (
      <Swiper
        navigation
        modules={[Navigation, Autoplay]}
        autoplay={
          autoSlide
            ? {
                delay: 3500,
                pauseOnMouseEnter: true,
                disableOnInteraction: isMobile,
              }
            : false
        }
        breakpoints={{ ...slicedBreakPoints }}
        className={`pw-w-full md:pw-px-6 ${
          hasSpaceBetween ? 'cardSpaceBetween' : ''
        }`}
      >
        {cardType == 'content' && format && format != 'product'
          ? dynamicCardsData?.map((card) => (
              <SwiperSlide
                key={card.id}
                className="pw-flex pw-w-full pw-justify-center"
              >
                {' '}
                <ContentCard
                  product={card}
                  config={mergedStyleData}
                  key={card.id}
                  cardType={cardType}
                />
              </SwiperSlide>
            ))
          : cardType == 'content' && (!format || format == 'product')
          ? dynamicCardsData?.map((p) => (
              <SwiperSlide key={p.id} className="pw-flex pw-justify-center">
                <Card
                  key={p?.id}
                  product={{
                    name: p?.title ?? '',
                    description: p?.description ?? '',
                    id: p?.id ?? '',
                    slug: p.link ?? '',
                    hasLink: p.hasLink,
                    tags:
                      p?.category?.map((cat: any) => ({
                        name: cat.label,
                        id: cat.value,
                      })) ?? [],
                    images: [
                      {
                        assetId: p?.image?.assetId,
                        thumb: p?.image?.assetUrl,
                        original: p?.image?.assetUrl,
                      },
                    ],
                    prices: [
                      {
                        amount: p?.value ?? '',
                        currency: { symbol: 'R$' },
                      },
                    ],
                  }}
                  config={{
                    styleData: mergedStyleData,
                    contentData: mergedContentData,
                  }}
                />
              </SwiperSlide>
            ))
          : format === 'product'
          ? clampedProducts?.map((p) => (
              <SwiperSlide key={p.id} className="pw-flex pw-justify-center">
                <Card
                  key={p.id}
                  product={p}
                  config={{
                    styleData: mergedStyleData,
                    contentData: mergedContentData,
                  }}
                />
              </SwiperSlide>
            ))
          : clampedProducts?.map((p) => (
              <SwiperSlide key={p.id} className="pw-flex pw-justify-center">
                <ContentCard
                  key={p.id}
                  product={{
                    title: p?.name ?? '',
                    value: p?.prices?.[0]?.amount ?? '',
                    hasLink: p?.hasLink,
                    id: p?.id ?? '',
                    link: p?.slug ?? '',
                    image: {
                      assetId: p?.images?.[0]?.assetId ?? '',
                      assetUrl: p?.images?.[0]?.original ?? '',
                    },
                    description: p?.description ?? '',
                    cardOverlayColor: cardProductOverlay,
                    overlay: productOverlay,
                    category: p?.tags?.map((val) => ({
                      label: val?.name ?? '',
                      value: val?.id ?? '',
                    })),
                  }}
                  config={mergedStyleData}
                  cardType={cardType}
                />
              </SwiperSlide>
            ))}
      </Swiper>
    );
  };

  if (error) return <h2>{translate('storefront>products>error')}</h2>;

  type AlignmentClassNameMap = Record<AlignmentEnum, string>;
  const alignmentsText: AlignmentClassNameMap = {
    left: 'pw-text-left',
    right: 'pw-text-right',
    center: 'pw-text-center',
  };
  const alignmentTextClass =
    alignmentsText[titleAlignment ?? AlignmentEnum.LEFT];

  return (
    <div
      style={{
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundImage: backgroundUrl?.assetUrl
          ? `url('${composeUrlCloudinary({
              src: backgroundUrl?.assetUrl ?? '',
              InternalProps: {
                width: imageCompression === 'no-compression' ? undefined : 600,
                quality: imageCompression ? imageCompression : 'best',
              },
            })}')`
          : backgroundColor
          ? backgroundColor
          : 'transparent',
        backgroundColor: backgroundColor ?? 'transparent',
        margin: convertSpacingToCSS(margin),
        padding: padding ? convertSpacingToCSS(padding) : '16px',
      }}
    >
      <div className="pw-container pw-mx-auto pw-pb-10 sm:!pw-px-0">
        <div className="pw-flex pw-pt-10 pw-justify-between">
          {moduleTitle && moduleTitle != '' ? (
            <h2
              style={{
                color: moduleTitleColor ?? 'black',
                fontFamily: moduleFontFamily ?? '',
                fontSize:
                  (moduleFontSize &&
                  moduleFontSize != '' &&
                  moduleFontSize != '0'
                    ? moduleFontSize
                    : 36) + (moduleFontSizeType == 'rem' ? 'rem' : 'px'),
                fontWeight: moduleFontBold ? 'bold' : 'normal',
                fontStyle: moduleFontItalic ? 'italic' : 'normal',
                lineHeight:
                  moduleFontSize &&
                  moduleFontSize != '' &&
                  moduleFontSize != '0' &&
                  moduleFontSizeType != 'rem'
                    ? (
                        parseInt(moduleFontSize) -
                        parseInt(moduleFontSize) * 0.05
                      ).toFixed(0) + 'px'
                    : 'auto',
              }}
              className={classNames(
                'pw-font-semibold pw-text-lg pw-w-full',
                alignmentTextClass
              )}
            >
              {title}
            </h2>
          ) : (
            <></>
          )}
          <div className="">
            {allowSorting ? (
              <BaseSelect
                options={optionsSorting}
                value={sort}
                onChangeValue={(e) => setSort(e)}
                placeholder={translate('storefront>products>sorting')}
              />
            ) : null}
          </div>
        </div>

        <div className="pw-flex pw-justify-center pw-pt-10">
          {layoutDisposition === CardLayoutDisposition.GRID ? (
            <GridProducts />
          ) : (
            <SliderProducts />
          )}
        </div>
        {sessionButton ? (
          <div
            className={`pw-mt-8 pw-flex ${
              sessionAlignment == AlignmentEnum.CENTER
                ? 'pw-justify-center'
                : sessionAlignment == AlignmentEnum.RIGHT
                ? 'pw-justify-end'
                : 'pw-justify-start'
            }`}
          >
            <a
              style={{
                backgroundColor: sessionButtonColor ?? '#F5F9FF',
                color: sessionButtonTextColor ?? '#353945',
              }}
              className="pw-px-[60px] pw-py-3 pw-text-center pw-rounded-lg pw-font-[600] pw-text-sm pw-cursor-pointer"
              href={sessionLink}
            >
              {sessionButtonText ?? 'Saiba mais'}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
};
