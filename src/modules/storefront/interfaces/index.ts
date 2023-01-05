import {
  CookiesData,
  CookiesDefault,
  CookiesProps,
} from '../components/Cookies';

export interface TemplateData {
  title: string;
  items: {
    type: keyof Template;
    props: HeaderData | CategoryData | BannerData | CookiesData | ProductsData;
  }[];
}

export type DefaultDataProps =
  | HeaderProps
  | CategoryProps
  | BannerProps
  | ProductsProps
  | CookiesProps;

type HeaderProps = { data: HeaderData; defaultData: HeaderDefault };
type CategoryProps = { data: CategoryData; defaultData: CategoryDefault };
type BannerProps = { data: BannerData; defaultData: BannerDefault };
type ProductsProps = { data: ProductsData; defaultData: ProductsDefault };

export interface Template {
  header: HeaderDefault;
  categories: CategoryDefault;
  banner: BannerDefault;
  products: ProductsDefault;
  cookies: CookiesDefault;
}

export type HeaderData = {
  brandText?: string;
  bgColor?: string;
  textColor?: string;
  links?: HeaderLink[];
};

export type HeaderDefault = {
  bgColor: string;
  textColor: string;
};

export type CategoryData = {
  bgColor?: string;
  textColor?: string;
  categories?: CategoryItem[];
};

export type CategoryDefault = {
  bgColor: string;
  textColor: string;
};

export type BannerData = {
  layout?: Layout;
  ratio?: Ratio;
  autoSlide?: boolean;
  slides?: SlideContentData[];
};

export type BannerDefault = {
  layout: Layout;
  ratio: Ratio;
  autoSlide: boolean;
  slides: SlideContentDefault;
};

export type ProductsData = {
  title?: string;
  filterTag?: string;
  layoutProducts?: 'carousel' | 'grid';
  autoSlide?: boolean;
  itemsPerLine?: number;
  numberOfLines?: number;
  listOrdering?: keyof ProductOmitImgAndID;
  products?: Product[];
  card?: {
    hoverColor: string;
    url: string;
    button: boolean;
  } & ProductBoolean<ProductOmitImgAndID>;
  button?: {
    text?: string;
    textColor?: string;
    bgColor?: string;
    hoverColor?: string;
  };
};

type ProductBoolean<T extends object> = Record<keyof T, boolean>;
type ProductOmitImgAndID = Omit<Product, 'img' | 'id'>;

export type ProductsDefault = {
  filterTag: string;
  layout: 'carousel' | 'grid';
  autoSlide: boolean;
  itemsPerLine: number;
  numberOfLines: number;
  listOrdering: keyof ProductOmitImgAndID;
  card: {
    hoverColor: string;
    url: string;
    button: boolean;
  } & ProductBoolean<ProductOmitImgAndID>;
  button: {
    textColor: string;
    bgColor: string;
    hoverColor: string;
  };
};

export type Product = {
  id: string;
  img: string;
  name: string;
  category: string;
  description: string;
  price: string;
};

export type SlideContentDefault = {
  bgColor: string;
  overlayColor: string;
  alignment: Alignment;
  titleColor: string;
  subtitleColor?: string;
  button: {
    textColor: string;
    bgColor: string;
    hrefType: 'internal' | 'external';
  };
};
export type SlideContentData = {
  media?: string;
  bgColor?: string;
  overlayColor?: string;
  alignment?: Alignment;
  title?: string;
  titleColor?: string;
  subtitle?: string;
  subtitleColor?: string;
  button?: {
    text?: string;
    href?: string;
    hrefType?: 'internal' | 'external';
    textColor?: string;
    bgColor?: string;
  };
};
type Ratio = '20:9' | '16:9' | '3:1' | '4:1' | 'default';
type Layout = 'full_width' | 'fixed';
type Alignment = 'left' | 'center' | 'right';

type CategoryItem = { label: string; slug: string };
type HeaderLink = {
  label: string;
  type: 'internal' | 'external';
  value: string;
  newWindow: boolean;
};
