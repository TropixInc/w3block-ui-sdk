export type TemplateData = {
  title: string;
  slug: string;
  modules: (
    | CategoriesData
    | BannerData
    | ProductsData
    | CookiesData
    | FooterData
    | AccordionsData
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
  accordions?: MainModuleThemeInterface;
  productPage: ProductPageData;
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

export interface AssetInterface {
  assetId: string;
  assetUrl: string;
}
export interface HeaderData extends MainModuleThemeInterface {
  type: ModulesType.HEADER;
  styleData: {
    logoSrc?: AssetInterface;
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
  backgroundUrl?: AssetInterface;
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
    showCardImage?: boolean;
    format?:
      | 'product'
      | 'square'
      | 'rounded'
      | 'rectHorizontal'
      | 'rectVertical';
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
    backgroundUrl?: AssetInterface;
    overlay?: boolean;
    overlayColor?: string;
    textOverImage?: boolean;
  };
  contentData: {
    cardType?: CardTypesEnum;
    moduleTitle?: string;
    cardSearch?: CardSearchEnum;
    contentCards?: SpecificContentCard[];
    moduleTitleColor?: string;
  };
}

export interface SpecificContentCard {
  id?: string;
  title?: string;
  description?: string;
  image?: AssetInterface;
  category?: string;
  value?: string;
  hasLink?: boolean;
  link?: string;
  overlay?: boolean;
  cardOverlayColor?: string;
}

export interface ProductPageData extends MainModuleThemeInterface {
  type: ModulesType.PRODUCT_PAGE;
  styleData: {
    backTextColor?: string;
    backBackgroundColor?: string;
    backgroundColor?: string;
    textColor?: string;
    categoriesTagBackgroundColor?: string;
    categoriesTagTextColor?: string;
    categoriesTextColor?: string;
    descriptionTextColor?: string;
    priceTextColor?: string;
    nameTextColor?: string;
    actionButton?: boolean;
    buttonText?: string;
    buttonTextColor?: string;
    buttonColor?: string;
    showBlockchainInfo?: boolean;
    showValue?: boolean;
    showDescription?: boolean;
    showCategory?: boolean;
    showProductName?: boolean;
    blockchainInfoBackgroundColor?: string;
    blockchainInfoTextColor?: string;
  };
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

export interface AccordionsData extends MainModuleThemeInterface {
  type: ModulesType.ACCORDIONS;
  styleData: {
    titleAndArrowColor?: string;
    titleAndArrowHoverColor?: string;
    contentColor?: string;
    backgroundColor?: string;
  };
  contentData: {
    accordionsItems?: SpecificContentAccordion[];
  };
}

export interface SpecificContentAccordion {
  title?: string;
  content?: string;
}

export enum ModulesType {
  HEADER = 'Header',
  CONFIGURATION = 'Configuration',
  CATEGORIES = 'Categories',
  BANNER = 'Banner',
  CARDS = 'Cards',
  FOOTER = 'Footer',
  COOKIE = 'Cookie',
  ACCORDIONS = 'Accordions',
  PRODUCT_PAGE = 'Product_page',
}
