import { useEffect, useState } from 'react';

import { Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Card } from '../../shared/components/Card';
import useTranslation from '../../shared/hooks/useTranslation';
import {
  CardLayoutDisposition,
  CardsOrderingEnum,
  ProductsData,
} from '../interfaces';
import { Product } from '../interfaces/Product';

import 'swiper/css';
import 'swiper/css/navigation';

export const Products = (props: { data: ProductsData }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, _] = useState('');
  const [translate] = useTranslation();

  const {
    styleData: {
      layoutDisposition,
      autoSlide,
      itensPerLine,
      ordering,
      totalRows,
      backgroundColor,
      backgroundUrl,
    },
    contentData: { moduleTitle },
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

  const responsiveClasses = [
    'pw-grid-cols-1',
    'sm:pw-grid-cols-2',
    'lg:pw-grid-cols-3',
    'xl:pw-grid-cols-' + itensPerLine,
  ];

  const GridProducts = () => {
    const slicedClasses = responsiveClasses.slice(0, itensPerLine).join(' ');

    return (
      <div
        className={`pw-grid pw-gap-4 pw-w-full pw-box-border ${slicedClasses}`}
      >
        {clampedProducts?.map((p) => (
          <Card key={p.id} product={p} config={props.data} />
        ))}
      </div>
    );
  };

  const SliderProducts = () => {
    return (
      <Swiper
        navigation
        modules={[Navigation, Autoplay]}
        autoplay={autoSlide ? { delay: 2500 } : false}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 16 },
          768: { slidesPerView: 2, spaceBetween: 16 },
          1024: { slidesPerView: 3, spaceBetween: 16 },
          1280: { slidesPerView: itensPerLine, spaceBetween: 16 },
        }}
        className="pw-max-w-[1500px] md:pw-px-6"
      >
        {clampedProducts?.map((p) => (
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
          <h2 className="pw-font-poppins pw-font-semibold pw-text-lg pw-pt-10">
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
