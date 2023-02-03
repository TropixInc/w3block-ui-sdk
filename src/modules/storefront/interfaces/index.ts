export type TemplateData = {
  title: string;
  slug: string;
  modules: (
    | CategoriesData
    | BannerData
    | ProductsData
    | CookiesData
    | FooterData
  )[];
};

export type Theme = {
  configurations: MainModuleThemeInterface;
  header: MainModuleThemeInterface;
  categories: MainModuleThemeInterface;
  banner?: MainModuleThemeInterface;
  products?: MainModuleThemeInterface;
  cookies: CookiesData;
  footer: FooterData;
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

export interface CookiesData extends MainModuleThemeInterface {
  type: ModulesType.COOKIE;
  styleData: {
    backgroundColor?: string;
    textColor?: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
    privacyPolicy?: boolean;
    privacyPolicyLinkColor?: string;
    privacyPolicyLink?: string;
  };
  contentData: {
    disclaimer?: string;
  };
}

export interface FooterData extends MainModuleThemeInterface {
  type: ModulesType.FOOTER;
  styleData: {
    backgroundColor?: string;
    w3blockSignature?: boolean;
    textColor?: string;
    menuLinks?: Link[];
    menuLinksColor?: string;
    menuLinksHoverColor?: string;
    socialNetworks?: boolean;
    socialNetworksIconColor?: string;
    socialNetworksIconHoverColor?: string;
  };
  contentData: {
    twitter?: string;
    telegram?: string;
    discord?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    whatsapp?: string;
    website?: string;
    description?: string;
  };
}

type Link = {
  name: string;
  type: 'internal' | 'external';
  slug: string;
};
export interface ProductsData extends MainModuleThemeInterface {
  type: ModulesType.CARDS;
  styleData: {
    layoutDisposition?: CardLayoutDisposition;
    autoSlide?: boolean;
    numberOfLines?: number;
    itensPerLine?: number;
    ordering?: CardsOrderingEnum;
    showCardTitle?: boolean;
    showCardCategory?: boolean;
    showCardDescription?: boolean;
    showCardValue?: boolean;
    totalRows?: number;
    cardBackgroundColor?: string;
    cardHoverColor?: string;
    cardProductNameColor?: string;
    cardCategoryColor?: string;
    cardDescriptionColor?: string;
    cardValueColor?: string;
    cardActionButton?: boolean;
    cardButtonText?: string;
    cardButtonTextColor?: string;
    cardButtonColor?: string;
    cardButtonHoverColor?: string;
    sessionButton?: boolean;
    sessionAlignment?: AlignmentEnum;
    sessionButtonText?: string;
    sessionButtonTextColor?: string;
    sessionButtonColor?: string;
    sessionHoverColor?: string;
    sessionLink?: string;
    backgroundSession?: boolean;
    backgroundColor?: string;
    backgroundUrl?: string;
    overlay?: boolean;
    overlayColor?: string;
  };
  contentData: {
    cardType?: CardTypesEnum;
    moduleTitle?: string;
    cardSearch?: CardSearchEnum;
    contentCards?: SpecificContentCard[];
  };
}

export interface SpecificContentCard {
  title?: string;
  description?: string;
  image?: string;
  category?: string;
  value?: string;
  hasLink?: boolean;
  link?: string;
}

export enum CardSearchEnum {
  FEATURED = 'featured',
  MOST_SEEN = 'mostSeen',
  CHEAPER = 'cheaper',
}

export enum CardTypesEnum {
  DYNAMIC = 'dynamic',
  CONTENT = 'content',
}

export enum CardsOrderingEnum {
  NAME = 'name',
  VALUE = 'value',
  RELEVANCE = 'relevance',
}

export enum CardLayoutDisposition {
  CARROUSEL = 'carrousel',
  GRID = 'grid',
}

export enum ModulesType {
  HEADER = 'Header',
  CONFIGURATION = 'Configuration',
  CATEGORIES = 'Categories',
  BANNER = 'Banner',
  CARDS = 'Cards',
  FOOTER = 'Footer',
  COOKIE = 'Cookie',
}
