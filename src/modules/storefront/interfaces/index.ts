import { BannerData, BannerDefault } from '../components/Banner';
import { CookiesData, CookiesDefault } from '../components/Cookies';
import { HeaderData, HeaderDefault } from '../components/Header';
import { ProductsData, ProductsDefault } from '../components/Products';

export type TemplateData = {
  title: string;
  items: (HeaderData | BannerData | ProductsData | CookiesData)[];
};

export type TemplateDefault = {
  header: HeaderDefault;
  banner: BannerDefault;
  products: ProductsDefault;
  cookies: CookiesDefault;
};
