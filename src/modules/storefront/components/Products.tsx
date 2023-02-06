import { useEffect, useState } from 'react';

import { Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Card } from '../../shared/components/Card';
import {
  breakpointsEnum,
  useBreakpoints,
} from '../../shared/hooks/useBreakpoints/useBreakpoints';
import useTranslation from '../../shared/hooks/useTranslation';
import {
  CardLayoutDisposition,
  CardsOrderingEnum,
  ProductsData,
} from '../interfaces';
import { Product } from '../interfaces/Product';
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
      ordering,
      totalRows,
      backgroundColor,
      backgroundUrl,
      format,
    },
    contentData: { moduleTitle, cardType, contentCards, moduleTitleColor },
  } = props.data;

  const gridMaxItemsTotal =
    (itensPerLine ? itensPerLine : 4) * (totalRows ? totalRows : 2)!;
  const carouselMaxItems = (itensPerLine ? itensPerLine : 4) * 4;
  const carouselSize =
    layoutDisposition === CardLayoutDisposition.GRID
      ? gridMaxItemsTotal
      : carouselMaxItems;
  const clampedProducts = products?.slice(0, carouselSize);

  useEffect(() => {
    const _products = fetchProductsByTagAndOrder(ordering);

    setProducts(_products);
  }, []);

  const quantityOfItemsGrid = () => {
    if (breakpoint == breakpointsEnum.SM && itensPerLine && itensPerLine > 2) {
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
                    id: p.id ?? '',
                    category: p.category ?? '',
                    img: p.image ?? '',
                    name: p.title ?? '',
                    description: p.description ?? '',
                    price: p.value ?? '',
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
      { key: 1280, value: { slidesPerView: itensPerLine, spaceBetween: 16 } },
    ]
      .slice(0, itensPerLine)
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
        className="pw-max-w-[1500px] md:pw-px-6"
      >
        {cardType == 'content' && format && format != 'product'
          ? contentCards
              ?.slice(0, quantityOfItemsGrid() * (totalRows ?? 2))
              .map((card) => (
                <SwiperSlide
                  key={card.id}
                  className="pw-flex pw-justify-center"
                >
                  {' '}
                  <ContentCard
                    product={card}
                    config={props.data}
                    key={card.id}
                  />
                </SwiperSlide>
              ))
          : cardType == 'content' && (!format || format == 'product')
          ? contentCards
              ?.slice(0, quantityOfItemsGrid() * (totalRows ?? 2))
              .map((p) => (
                <SwiperSlide key={p.id} className="pw-flex pw-justify-center">
                  <Card
                    key={p.id}
                    product={{
                      id: p.id ?? '',
                      category: p.category ?? '',
                      img: p.image ?? '',
                      name: p.title ?? '',
                      description: p.description ?? '',
                      price: p.value ?? '',
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
        background: backgroundUrl
          ? `url('${backgroundUrl}')`
          : backgroundColor
          ? backgroundColor
          : 'transparent',
      }}
      className="pw-font-poppins"
    >
      <div className="pw-container pw-mx-auto pw-pb-10">
        {moduleTitle && moduleTitle != '' && (
          <h2
            style={{ color: moduleTitleColor ?? 'black' }}
            className="pw-font-poppins pw-font-semibold pw-text-lg pw-pt-10"
          >
            {moduleTitle}
          </h2>
        )}

        <div className="pw-flex pw-justify-center pw-pt-10">
          {layoutDisposition === CardLayoutDisposition.GRID ? (
            <GridProducts />
          ) : (
            <SliderProducts />
          )}
        </div>
      </div>
    </div>
  );
};

const fetchProductsByTagAndOrder = (_order?: CardsOrderingEnum): Product[] => {
  return new Array(45).fill(0).map((_, i) => {
    return {
      id: String(i + 1),
      img: 'https://i.ibb.co/gr1Qkkc/product.png',
      category: 'calçados',
      description: 'Lorem ipsum dolor sit amet',
      // name: 'Tênis Easy Style Feminino Evoltenn Solado Trançado: ' + String(i + 1),
      name: String(i + 1),
      hoverColor: 'white',
      price: '237,65',
    };
  });
};
