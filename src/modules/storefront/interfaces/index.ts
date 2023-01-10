import { BannerData, BannerDefault } from '../components/Banner';
import { CookiesData, CookiesDefault } from '../components/Cookies';
import { HeaderData, HeaderDefault } from '../components/Header';
import { ProductsData, ProductsDefault } from '../components/Products';

export type TemplateData = {
  title: string;
  items: (PageData | HeaderData | BannerData | ProductsData | CookiesData)[];
};

export type TemplateDefault = {
  page: PageDefault;
  header: HeaderDefault;
  banner: BannerDefault;
  products: ProductsDefault;
  cookies: CookiesDefault;
};

export type PageData = {
  type: 'page';
  media?: string;
} & Partial<PageDefault>;

export type PageDefault = {
  bgColor: string;
  textColor: string;
  overlayColor: string;
};
