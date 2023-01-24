import { CookiesDefault } from '../components/Cookies';
import { FooterDefault } from '../components/Footer';
import { ProductsData, ProductsDefault } from '../components/Products';

export type TemplateData = {
  title: string;
  slug: string;
  modules: (CategoriesData | BannerData | ProductsData)[];
};

export type Theme = {
  configurations: MainModuleThemeInterface;
  header: MainModuleThemeInterface;
  categories: MainModuleThemeInterface;
  banner?: BannerData;
  products: ProductsDefault;
  cookies: CookiesDefault;
  footer: FooterDefault;
};

export interface MainModuleThemeInterface {
  name: string;
  type: ModulesType;
  id: string;
  styleData?: any;
  contentData?: any;
}

export interface PageData extends MainModuleThemeInterface {
  type: ModulesType.CONFIGURATION;
  styleData: {
    textColor?: string;
    background?: boolean;
    backgroundColor?: string;
    backgroundImage?: string;
    overlay?: boolean;
    overlayColor?: string;
  };
}

export interface HeaderData extends MainModuleThemeInterface {
  type: ModulesType.HEADER;
  styleData: {
    logoSrc?: string;
    brandName?: string;
    tabs?: HeaderLink[];
    backgroundColor?: string;
    textColor?: string;
    hoverTextColor?: string;
  };
}

type HeaderLink = {
  type: 'internal' | 'external';
  newWindow: boolean;
  label: string;
  value: string;
};

export enum AlignmentEnum {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

export interface CategoriesData extends MainModuleThemeInterface {
  type: ModulesType.CATEGORIES;
  styleData: {
    categories?: CategoryItem[];
    allCategories?: boolean;
    allCategoriesText?: string;
    alignment?: AlignmentEnum;
    background?: boolean;
    backgroundColor?: string;
    textColor?: string;
    hoverTextColor?: string;
  };
}

export interface BannerData extends MainModuleThemeInterface {
  type: ModulesType.BANNER;
  styleData: {
    bannerDisposition?: Layout;
    bannerRatio?: Ratio;
    autoSlide?: boolean;
    banners?: SpecificBannerInfo[];
  };
}

export interface SpecificBannerInfo {
  backgroundColor?: string;
  backgroundUrl?: string;
  overlay?: boolean;
  overlayColor?: string;
  textAligment?: AlignmentEnum;
  title?: string;
  titleColor?: string;
  subtitle?: string;
  subtitleColor?: string;
  actionButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
  buttonTextColor?: string;
  buttonColor?: string;
}

type CategoryItem = { name: string; slug: string };

export type Ratio = '20:9' | '16:9' | '3:1' | '4:1' | 'default';

export type Layout = 'fullWidth' | 'fixed';

export type MenuDefault = {
  bgColor: string;
  textColor: string;
};

export enum ModulesType {
  HEADER = 'Header',
  CONFIGURATION = 'Configuration',
  CATEGORIES = 'Categories',
  BANNER = 'Banner',
  CARDS = 'Cards',
  FOOTER = 'Footer',
  COOKIE = 'Cookie',
}
