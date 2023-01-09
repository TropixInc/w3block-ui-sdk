import { useEffect } from 'react';

import { Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Card } from '../../shared/components/Card';

import 'swiper/css';
import 'swiper/css/navigation';

// type AAA =Required<ProductsData> & { button: Required<ProductsData["button"]> }

export const Products = (props: { data: ProductsProps }) => {
  // const [products, setProducts] = useState<Product[]>([]);
  const {
    layoutProducts,
    itemsPerLine,
    numberOfLines,
    listOrdering,
    filterTag,
    autoSlide,
    products,
    title,
    cardHoverColor,
    cardUrl,
    showCardButton,
    showCardName,
    showCardCategory,
    showCardDescription,
    showCardPrice,
    buttonTextColor,
    buttonText,
    buttonBgColor,
    buttonHoverColor,
  } = props.data;

  const cardConfig = {
    cardHoverColor,
    cardUrl,
    showCardButton,
    showCardName,
    showCardCategory,
    showCardDescription,
    showCardPrice,
    buttonTextColor,
    buttonText,
    buttonBgColor,
    buttonHoverColor,
  };

  const gridMaxItemsTotal = itemsPerLine * numberOfLines;
  const carouselMaxItems = 12;
  const clampedProducts = products?.slice(
    0,
    layoutProducts === 'grid' ? gridMaxItemsTotal : carouselMaxItems
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
          <Card key={p.id} product={p} config={cardConfig} />
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
            <Card key={p.id} product={p} config={cardConfig} />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  return (
    <div className="pw-font-poppins pw-p-10">
      <h2>{title}</h2>

      <div className="pw-flex pw-justify-center">
        {layoutProducts === 'grid' ? <GridProducts /> : <SliderProducts />}
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

export type ProductsData = {
  type: 'products';
  title?: string;
  products?: Product[];
} & Partial<ProductsDefault>;

export type ProductsDefault = {
  filterTag: string;
  layoutProducts: 'carousel' | 'grid';
  autoSlide: boolean;
  itemsPerLine: number;
  numberOfLines: number;
  listOrdering: keyof Omit<Product, 'img' | 'id'>;
} & CardConfig;

type ProductsProps = Omit<ProductsData & ProductsDefault, 'type'>;

export type CardConfig = {
  cardHoverColor: string;
  cardUrl: string;
  showCardButton: boolean;
  showCardName: boolean;
  showCardCategory: boolean;
  showCardDescription: boolean;
  showCardPrice: boolean;
  buttonText: string;
  buttonTextColor: string;
  buttonBgColor: string;
  buttonHoverColor: string;
};

export type Product = {
  id: string;
  img: string;
  name: string;
  category: string;
  description: string;
  price: string;
};
