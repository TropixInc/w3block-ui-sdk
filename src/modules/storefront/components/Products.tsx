import { useEffect } from 'react';

import { Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Card } from '../../shared/components/Card';
import { Product, ProductsData, ProductsDefault } from '../interfaces';

import 'swiper/css';
import 'swiper/css/navigation';

export const Products = ({
  data,
  defaultData,
}: {
  data: ProductsData;
  defaultData: ProductsDefault;
}) => {
  // const [products, setProducts] = useState<Product[]>([]);

  const layout = data?.layoutProducts || defaultData.layout;
  const itemsPerLine = data?.itemsPerLine || defaultData.itemsPerLine;
  const numberOfLines = data?.numberOfLines || defaultData.numberOfLines;
  const listOrdering = data?.listOrdering || defaultData.listOrdering;
  const filterTag = data?.filterTag || defaultData.filterTag;
  const autoSlide = data?.autoSlide ?? defaultData.autoSlide;

  const card = { ...defaultData.card, ...data?.card };
  const button = { ...defaultData.button, ...data?.button };

  const gridMaxItemsTotal = itemsPerLine * numberOfLines;
  const carouselMaxItems = 12;
  const clampedProducts = data.products?.slice(
    0,
    layout === 'grid' ? gridMaxItemsTotal : carouselMaxItems
  );

  useEffect(() => {
    fetchProductsByTagAndOrder(listOrdering, filterTag).then((_products) => {
      //  setProducts(products)
    });
  }, [listOrdering, filterTag]);

  const GridProducts = () => {
    return (
      <div
        className={`pw-grid pw-gap-4 pw-grid-cols-[repeat(1,minmax(350px,1fr))] sm:pw-grid-cols-[repeat(${Math.min(
          itemsPerLine,
          2
        )},minmax(350px,1fr))] lg:pw-grid-cols-[repeat(${Math.min(
          itemsPerLine,
          3
        )},minmax(350px,1fr))] xl:pw-grid-cols-[repeat(${Math.min(
          itemsPerLine,
          4
        )},minmax(350px,1fr))]`}
      >
        {clampedProducts?.map((p) => (
          <Card key={p.id} product={p} card={card} button={button} />
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
          640: { slidesPerView: 1, spaceBetween: 10 },
          768: { slidesPerView: 2, spaceBetween: 10 },
          1024: { slidesPerView: 3, spaceBetween: 10 },
          1280: { slidesPerView: 4, spaceBetween: 10 },
        }}
        className="pw-max-w-[1500px] md:pw-px-6"
      >
        {clampedProducts?.map((p) => (
          <SwiperSlide key={p.id} className="pw-flex pw-justify-center">
            <Card key={p.id} product={p} card={card} button={button} />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  return (
    <div className="pw-font-poppins pw-p-10">
      <h2>{data.title}</h2>

      <div className="pw-flex pw-justify-center">
        {layout === 'grid' ? <GridProducts /> : <SliderProducts />}
      </div>
    </div>
  );
};

const fetchProductsByTagAndOrder = async (
  _order: string,
  _tag: string
): Promise<Product[]> => {
  return new Array(45).fill(0).map((_, i) => {
    return {
      id: String(i + 1),
      img: 'https://i.ibb.co/gr1Qkkc/product.png',
      category: 'calçados',
      description: 'Lorem ipsum dolor sit amet',
      name: 'Tênis Easy Style Feminino Evoltenn Solado Trançado',
      hoverColor: 'white',
      price: '237,65',
    };
  });
};
