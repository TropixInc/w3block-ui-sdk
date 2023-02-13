import { useEffect, useState } from 'react';

import { Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Card } from '../../shared/components/Card';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import {
  breakpointsEnum,
  useBreakpoints,
} from '../../shared/hooks/useBreakpoints/useBreakpoints';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import useTranslation from '../../shared/hooks/useTranslation';
import { Product } from '../hooks/useGetProductBySlug/useGetProductBySlug';
import {
  AlignmentEnum,
  CardLayoutDisposition,
  CardTypesEnum,
  ProductsData,
} from '../interfaces';
import { ContentCard } from './ContentCard';

import 'swiper/css';
import 'swiper/css/navigation';

export const Products = (props: { data: ProductsData }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, _] = useState('');
  const [translate] = useTranslation();
  const breakpoint = useBreakpoints();
  const {
    styleData: {
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
    },
    contentData: {
      moduleTitle,
      cardType,
      contentCards,
      moduleTitleColor,
      cardSearch,
    },
  } = props.data;

  const { companyId } = useCompanyConfig();
  const axios = useAxios(W3blockAPI.COMMERCE);
  useEffect(() => {
    if (cardType == CardTypesEnum.DYNAMIC) {
      callApiForDynamicProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardSearch, cardType, breakpoint, totalRows, itensPerLine]);

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
  const carouselMaxItems = (itensPerLine ? itensPerLine : 4) * 4;
  const carouselSize =
    layoutDisposition === CardLayoutDisposition.GRID
      ? gridMaxItemsTotal
      : carouselMaxItems;

  const callApiForDynamicProducts = () => {
    const limit = carouselSize;
    axios
      .get(
        `/companies/${companyId}/products?limit=${limit}&${
          cardSearch && cardSearch.length > 0
            ? `${cardSearch?.map((cs) => `tagIds=${cs.value}`).join('&')}`
            : ''
        }`
      )
      .then((data) => {
        if (data) {
          setProducts(data.data.items);
        }
      });
  };

  const clampedProducts = products?.slice(0, carouselSize);

  const GridProducts = () => {
    return (
      <div
        style={{
          gridTemplateColumns: `repeat(${quantityOfItemsGrid()}, minmax(0, 1fr))`,
        }}
        className={`pw-grid pw-gap-4 pw-w-full pw-flex-1 pw-box-border`}
      >
        {cardType == 'content' && format && format != 'product'
          ? contentCards
              ?.slice(0, quantityOfItemsGrid() * (totalRows ?? 2))
              .map((card) => (
                <ContentCard product={card} config={props.data} key={card.id} />
              ))
          : cardType == 'content' && (!format || format == 'product')
          ? contentCards
              ?.slice(0, quantityOfItemsGrid() * (totalRows ?? 2))
              .map((p) => (
                <Card
                  key={p.id}
                  product={{
                    name: p.title ?? '',
                    description: p.description ?? '',
                    id: p.id ?? '',
                    slug: '',
                    images: [
                      {
                        assetId: p.image?.assetId,
                        thumb: p.image?.assetUrl,
                        original: p.image?.assetUrl,
                      },
                    ],
                    prices: [
                      {
                        amount: p.value ?? '',
                        currency: { symbol: 'R$' ?? '' },
                      },
                    ],
                  }}
                  config={props.data}
                />
              ))
          : clampedProducts?.map((p) => (
              <Card key={p.id} product={p} config={props.data} />
            ))}
      </div>
    );
  };

  const SliderProducts = () => {
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
        autoplay={autoSlide ? { delay: 2500 } : false}
        breakpoints={{ ...slicedBreakPoints }}
        className="pw-w-full md:pw-px-6"
      >
        {cardType == 'content' && format && format != 'product'
          ? contentCards?.map((card) => (
              <SwiperSlide
                key={card.id}
                className="pw-flex pw-w-full pw-justify-center"
              >
                {' '}
                <ContentCard product={card} config={props.data} key={card.id} />
              </SwiperSlide>
            ))
          : cardType == 'content' && (!format || format == 'product')
          ? contentCards?.map((p) => (
              <SwiperSlide key={p.id} className="pw-flex pw-justify-center">
                <Card
                  key={p.id}
                  product={{
                    name: p.title ?? '',
                    description: p.description ?? '',
                    id: p.id ?? '',
                    slug: '',
                    images: [
                      {
                        assetId: p.image?.assetId,
                        thumb: p.image?.assetUrl,
                        original: p.image?.assetUrl,
                      },
                    ],
                    prices: [
                      {
                        amount: p.value ?? '',
                        currency: { symbol: 'R$' ?? '' },
                      },
                    ],
                  }}
                  config={props.data}
                />
              </SwiperSlide>
            ))
          : clampedProducts?.map((p) => (
              <SwiperSlide key={p.id} className="pw-flex pw-justify-center">
                <Card key={p.id} product={p} config={props.data} />
              </SwiperSlide>
            ))}
      </Swiper>
    );
  };

  if (error) return <h2>{translate('storefront>products>error')}</h2>;

  return (
    <div
      style={{
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundImage: backgroundUrl?.assetUrl
          ? `url('${backgroundUrl.assetUrl}')`
          : backgroundColor
          ? backgroundColor
          : 'transparent',
        backgroundColor: backgroundColor ?? 'transparent',
      }}
      className="pw-font-poppins pw-px-4 sm:pw-px-0"
    >
      <div className="pw-container pw-mx-auto pw-pb-10">
        <div className="pw-flex pw-justify-between">
          {moduleTitle && moduleTitle != '' && (
            <h2
              style={{ color: moduleTitleColor ?? 'black' }}
              className="pw-font-poppins pw-font-semibold pw-text-lg pw-pt-10"
            >
              {moduleTitle}
            </h2>
          )}
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
