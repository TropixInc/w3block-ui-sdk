import { BannerData, BannerDefault } from '../components/Banner';
import { CookiesData, CookiesDefault } from '../components/Cookies';
import { HeaderData, HeaderDefault } from '../components/Header';
import { MenuData, MenuDefault } from '../components/Menu';
import { ProductsData, ProductsDefault } from '../components/Products';

export type TemplateData = {
  title: string;
  items: (HeaderData | MenuData | BannerData | ProductsData | CookiesData)[];
};

export type TemplateDefault = {
  header: HeaderDefault;
  menu: MenuDefault;
  banner: BannerDefault;
  products: ProductsDefault;
  cookies: CookiesDefault;
};
