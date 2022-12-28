import { CSSProperties, useEffect } from 'react';

import { Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Product, ProductsData, ProductsDefault } from '../interfaces';

import 'swiper/css';
import 'swiper/css/navigation';

import './Products.css';

const getCardInfo = (
  data: ProductsData['card'],
  defaultData: ProductsDefault['card']
): ProductsDefault['card'] => {
  return {
    name: data?.name !== undefined ? data.name : defaultData.name,
    description:
      data?.description !== undefined
        ? data.description
        : defaultData.description,
    category:
      data?.category !== undefined ? data.category : defaultData.category,
    price: data?.category !== undefined ? data.category : defaultData.category,
    hoverColor: data?.hoverColor || defaultData.hoverColor,
    button: data?.button !== undefined ? data.button : defaultData.button,
    url: data?.url || defaultData.url,
  };
};

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

  const card = getCardInfo(data?.card, defaultData.card);
  const button = {
    bgColor: data.button?.bgColor || defaultData.button.bgColor,
    textColor: data.button?.textColor || defaultData.button.textColor,
    text: data.button?.text || '',
    hoverColor: data.button?.hoverColor || defaultData.button.hoverColor,
  };

  const listOrdering = data?.listOrdering || defaultData.listOrdering;
  const filterTag = data?.filterTag || defaultData.filterTag;
  const autoSlide =
    data?.autoSlide !== undefined ? data.autoSlide : defaultData.autoSlide;

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

const Card = ({
  product,
  card,
  button,
}: {
  product: Product;
  card: ProductsDefault['card'];
  button: ProductsDefault['button'] & { text: string };
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
          {button?.text}
        </button>
      )}
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
