import { BannerData, BannerDefault } from '../components/Banner';
import { CookiesData, CookiesDefault } from '../components/Cookies';
import { FooterData, FooterDefault } from '../components/Footer';
import { HeaderData, HeaderDefault } from '../components/Header';
import { MenuData, MenuDefault } from '../components/Menu';
import { ProductsData, ProductsDefault } from '../components/Products';

export type TemplateData = {
  title: string;
  items: (
    | PageData
    | HeaderData
    | MenuData
    | BannerData
    | ProductsData
    | CookiesData
    | FooterData
  )[];
};

export type TemplateDefault = {
  page: PageDefault;
  header: HeaderDefault;
  menu: MenuDefault;
  banner: BannerDefault;
  products: ProductsDefault;
  cookies: CookiesDefault;
  footer: FooterDefault;
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
