import {
  Actions,
  ColumnsTable,
  DataSource,
  TableStylesClasses,
  XlsReportsDto,
} from '../../shared/interface/ConfigGenericTable';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type TemplateData = {
  title: string;
  slug: string;

  dynamicApi?: DynamicApiModuleInterface;
  custom?: string;
  modules: (
    | CategoriesData
    | BannerData
    | ProductsData
    | CookiesData
    | FooterData
    | AccordionsData
    | ImagePlusTextData
    | ParagraphData
    | MidiaData
    | GridItemAreaData
    | GenericTableData
    | BannerVariantData
    | BannerWJJCData
    | PassBenefitData
  )[];
};

export type Theme = {
  internalMenu: InternalMenuInterface;
  configurations: MainModuleThemeInterface;
  header: MainModuleThemeInterface;
  categories: MainModuleThemeInterface;
  banner?: MainModuleThemeInterface;
  products?: MainModuleThemeInterface;
  cookies: CookiesData;
  footer: FooterData;
  accordions?: MainModuleThemeInterface;
  imagePlusText?: MainModuleThemeInterface;
  paragraph?: MainModuleThemeInterface;
  productPage: ProductPageData;
  midia?: MidiaData;
  GridItemArea?: GridItemAreaData;
  table?: GenericTableData;
  bannerVariant?: MainModuleThemeInterface;
  bannerWjjc?: MainModuleThemeInterface;
  passBenefit?: MainModuleThemeInterface;
};

export interface DynamicApiModuleInterface {
  regexp: any;
  matches: any;
  groups?: any;
  apis: {
    apiName: string;
    url: string;
    strapiLocalization?: boolean;
  }[];
}

export interface InternalMenuInterface {
  [key: string]: {
    customLabel?: string;
    hidden?: any;
  };
}

export interface MainModuleThemeInterface {
  name: string;
  type: ModulesType;
  id: string;
  styleData?: any;
  contentData?: any;
  deviceType?: 'none' | 'mobile' | 'desktop';
  languageType?: string;
  mobileStyleData?: any;
  mobileContentData?: any;
}

export enum FitImage {
  CONTAIN = 'contain',
  COVER = 'cover',
  FILL = 'fill',
}

export interface GridItemAreaData extends MainModuleThemeInterface {
  type: ModulesType.GRID_ITEM_AREA;
  styleData: {
    container?: Layout;
    backgroundColor?: string;
    backgroundImage?: AssetInterface;
    padding?: string;
    columnSizes?: string;
    rowSizes?: string;
    margin?: string;
    gridColumns?: string;
    gridRows?: string;
    gapX?: string;
    gapY?: string;
    dynamicGrid?: boolean;
    dynamicGridPath: string;
    dynamicMaxItens?: number;
    title?: string;
    titleColor?: string;
    titleSize?: string;
    titleWeight?: string;
    showHeight?: boolean;
    titlePadding?: string;
    Items?: {
      target?: '_self' | '_blank';
      quadrants?: number[];
      imageAlign?: AlignmentEnum;
      fit?: FitImage;
      link?: string;
      image: AssetInterface;
      module?: MainModuleThemeInterface;
    }[];
  };
  mobileStyleData: GridItemAreaData['styleData'];
}

export enum CoinsType {
  ETH = 'ETH',
  MATIC = 'MATIC',
  LOYALTY = 'LOYALTY',
}

export enum WalletsOptions {
  CUSTODY = 'custody',
  METAMASK = 'metamask',
  ALL = 'all',
}

export interface PageData extends MainModuleThemeInterface {
  type: ModulesType.CONFIGURATION;
  styleData: {
    padding?: string;
    textColor?: string;
    background?: boolean;
    backgroundColor?: string;
    backgroundImage?: string;
    overlay?: boolean;
    overlayColor?: string;
    mainCoin?: CoinsType;
    walletsAvaiable?: CoinsType[] | string[];
    onBoardingWalletsOptions: WalletsOptions;
  };
}

export interface AssetInterface {
  assetId: string;
  assetUrl: string;
  basePath?: string;
}
export interface HeaderData extends MainModuleThemeInterface {
  type: ModulesType.HEADER;
  styleData: {
    margin?: string;
    padding?: string;
    logoSrc?: AssetInterface;
    brandName?: string;
    tabs?: HeaderLink[];
    backgroundColor?: string;
    textColor?: string;
    hoverTextColor?: string;
    logoLink?: string;
  };
  mobileStyleData: HeaderData['styleData'];
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
  styleData: CategoriesDataStyleData;
  mobileStyleData: CategoriesDataStyleData;
}

export interface CategoriesDataStyleData {
  margin?: string;
  padding?: string;
  categories?: CategoryItem[];
  allCategories?: boolean;
  allCategoriesText?: string;
  alignment?: AlignmentEnum;
  background?: boolean;
  backgroundColor?: string;
  textColor?: string;
  hoverTextColor?: string;
}

export interface BannerData extends MainModuleThemeInterface {
  type: ModulesType.BANNER;
  styleData: {
    margin?: string;
    padding?: string;
    bannerDisposition?: Layout;
    bannerRatio?: Ratio;
    autoSlide?: boolean;
    dynamicBanner?: boolean;
    routeToDynamicBanner?: string;
    banners?: SpecificBannerInfo[];
    height?: string;
    heightUnity?: string;
  };
  mobileStyleData: BannerData['styleData'];
}
export interface BannerVariantData extends MainModuleThemeInterface {
  type: ModulesType.BANNER_VARIANT;
  styleData: {
    margin?: string;
    padding?: string;
    bannerDisposition?: Layout;
    bannerRatio?: Ratio;
    autoSlide?: boolean;
    dynamicBanner?: boolean;
    routeToDynamicBanner?: string;
    banners?: SpecificBannerInfo[];
    height?: string;
    heightUnity?: string;
  };
  mobileStyleData: BannerVariantData['styleData'];
}

export interface BannerWJJCData extends MainModuleThemeInterface {
  type: ModulesType.BANNER_WJJC;
  styleData: {
    margin?: string;
    padding?: string;
    bannerDisposition?: Layout;
    bannerRatio?: Ratio;
    autoSlide?: boolean;
    dynamicBanner?: boolean;
    routeToDynamicBanner?: string;
    banners?: SpecificBannerInfo;
    height?: string;
    heightUnity?: string;
  };
  mobileStyleData: BannerWJJCData['styleData'];
}

export interface SpecificBannerInfo {
  backgroundColor?: string;
  backgroundUrl?: AssetInterface;
  backgroundUrlMobile?: AssetInterface;
  sideImageUrl?: AssetInterface;
  imageCompression?: 'best' | 'good' | 'eco' | 'no-compression';
  sideImagePosition?:
    | 'left-center'
    | 'right-center'
    | 'center-center'
    | 'center-top'
    | 'center-bottom'
    | 'left-bottom'
    | 'right-bottom'
    | 'left-top'
    | 'right-top';
  sideImageHeight?: string;
  sideImageWidth?: string;
  overlay?: boolean;
  padding?: string;
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
  buttonBorderColor?: string;
  secondaryActionButton?: boolean;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  secondaryButtonTextColor?: string;
  secondaryButtonColor?: string;
  buttonSize?: '12px' | '14px' | '16px' | '18px' | '20px';
  secondaryButtonSize?: '12px' | '14px' | '16px' | '18px' | '20px';
  secondaryButtonBorderColor?: string;
  titleFontFamily?: string;
  titleFontSize?: string;
  titleFontBold?: boolean;
  titleFontItalic?: boolean;
  titleFontSizeType?: string;
  subtitleFontFamily?: string;
  subtitleFontSize?: string;
  subtitleFontBold?: boolean;
  subtitleFontItalic?: boolean;
  subtitleFontSizeType?: string;
  baseUrl?: string;
  titleTextShadow?: string;
  titleTextAlign?:
    | 'start'
    | 'end'
    | 'left'
    | 'right'
    | 'center'
    | 'justify'
    | 'match-parent';
  titleMaxWidth?: string;
  titleWidth?: string;
  imageRounded?: boolean;
  contentClass?: string;
  spacing?: string;
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
    margin?: string;
    padding?: string;
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
  mobileStyleData: CookiesData['styleData'];
  mobileContentData: CookiesData['contentData'];
}

export interface FooterData extends MainModuleThemeInterface {
  type: ModulesType.FOOTER;
  styleData: {
    margin?: string;
    padding?: string;
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
  mobileStyleData: FooterData['styleData'];
  mobileContentData: FooterData['contentData'];
}

type Link = {
  label: string;
  value: string;
};
export interface ProductsData extends MainModuleThemeInterface {
  type: ModulesType.CARDS;
  styleData: ProductsDataStyleData;
  contentData: {
    cardType?: CardTypesEnum;
    moduleTitle?: string;
    titleAlignment?: AlignmentEnum;
    cardSearch?: ComboBoxReturnInterface[];
    contentCards?: SpecificContentCard[];
    moduleTitleColor?: string;
    moduleFontFamily?: string;
    moduleFontSize?: string;
    moduleFontBold?: boolean;
    moduleFontItalic?: boolean;
    moduleFontSizeType?: string;
    dynamicCards?: boolean;
    dynamicCardsPath?: string;
    dynamicMaxItens?: number;
    allowSorting?: boolean;
    defaultSorting?: string;
    currencyId?: string;
  };
  mobileStyleData: ProductsDataStyleData;
  mobileContentData: ProductsData['contentData'];
}

export interface ProductsDataStyleData {
  hasSpaceBetween?: boolean;
  border?: string;
  margin?: string;
  padding?: string;
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
  format?: 'product' | 'square' | 'rounded' | 'rectHorizontal' | 'rectVertical';
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
  imageCompression?: 'best' | 'good' | 'eco' | 'no-compression';
  overlay?: boolean;
  overlayColor?: string;
  textOverImage?: boolean;
  titleFontFamily?: string;
  titleFontSize?: string;
  titleFontBold?: boolean;
  titleFontItalic?: boolean;
  titleFontSizeType?: string;
  descriptionFontFamily?: string;
  descriptionFontSize?: string;
  descriptionFontBold?: boolean;
  descriptionFontItalic?: boolean;
  descriptionFontSizeType?: string;
  categoryFontFamily?: string;
  categoryFontSize?: string;
  categoryFontBold?: boolean;
  categoryFontItalic?: boolean;
  categoryFontSizeType?: string;
  valueFontFamily?: string;
  valueFontSize?: string;
  valueFontBold?: boolean;
  valueFontItalic?: boolean;
  valueFontSizeType?: string;
  cardProductOverlay?: string;
  productOverlay?: boolean;
  textPadding?: string;
  containerRadius?: string;
  objectFit?: 'cover' | 'contain';
  imageCardCompression?: 'best' | 'good' | 'eco' | 'no-compression';
}

interface ComboBoxReturnInterface {
  label: string;
  value: string;
}
export interface SpecificContentCard {
  id?: string;
  title?: string;
  description?: string;
  image?: AssetInterface;
  category?: ComboBoxReturnInterface[];
  value?: string;
  hasLink?: boolean;
  link?: string;
  overlay?: boolean;
  cardOverlayColor?: string;
  basePath?: string;
  symbol?: string;
}

export interface ParagraphData extends MainModuleThemeInterface {
  type: ModulesType.PARAGRAPH;
  styleData: {
    margin?: string;
    padding?: string;
    alignment?: AlignmentEnum;
    titleColor?: string;
    textColor?: string;
    textSize?: string;
    textFontFamily?: string;
    textUnit?: string;
    titleSize?: string;
    titleFontFamily?: string;
    titleUnit?: string;
    image?: {
      assetUrl?: string;
    };
  };
  contentData: {
    titleInput?: string;
    textInput?: string;
  };
  mobileStyleData: ParagraphData['styleData'];
  mobileContentData: ParagraphData['contentData'];
}
export interface ProductPageData extends MainModuleThemeInterface {
  type: ModulesType.PRODUCT_PAGE;
  styleData: {
    margin?: string;
    padding?: string;
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
  mobileStyleData: ProductPageData['styleData'];
}
export interface MidiaData extends MainModuleThemeInterface {
  type: ModulesType.MIDIA;
  styleData: {
    margin?: string;
    padding?: string;
    mediaUrl: AssetInterface;
    imageCompression?: 'best' | 'good' | 'eco' | 'no-compression';
    mediaUrlMobile: AssetInterface;
    mediaLink: string;
    imageDisposition: string;
    imageRatio: string;
    imageAlignment: AlignmentEnum;
  };
  mobileStyleData: MidiaData['styleData'];
}
export interface ButtonData extends MainModuleThemeInterface {
  type: ModulesType.BUTTON;
  styleData: {
    title?: string;
    href?: string;
    width?: string;
    height?: string;
    bgColor?: string;
    onHoverColor?: string;
  };
  mobileStyleData: ButtonData['styleData'];
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
    margin?: string;
    padding?: string;
    titleAndArrowColor?: string;
    titleAndArrowHoverColor?: string;
    contentColor?: string;
    backgroundColor?: string;
  };
  contentData: {
    accordionsItems?: SpecificContentAccordion[];
  };
  mobileStyleData: AccordionsData['styleData'];
  mobileContentData: AccordionsData['contentData'];
}

export interface PassBenefitData extends MainModuleThemeInterface {
  type: ModulesType.PASS_BENEFIT;
  styleData: {
    benefitId?: string;
    collectionName?: boolean;
    passName?: boolean;
    passDescription?: boolean;
    passRules?: boolean;
    collectionImage?: boolean;
    benefitName?: boolean;
    benefitDescription?: boolean;
    benefitRules?: boolean;
    limitUsages?: boolean;
    eventValidity?: boolean;
    links?: boolean;
    avaliableTime?: boolean;
  };
}

export interface SpecificContentAccordion {
  title?: string;
  content?: string;
}

export interface ImagePlusTextData extends MainModuleThemeInterface {
  type: ModulesType.IMAGE_PLUS_TEXT;
  styleData: {
    margin?: string;
    padding?: string;
    image?: AssetInterface;
    imageCompression?: 'best' | 'good' | 'eco' | 'no-compression';
    textAlignment?: AlignmentEnum;
    titleColor?: string;
    contentColor?: string;
    imagePosition?: ImagePositionEnum;
    backgroundSession?: boolean;
    backgroundColor?: string;
    backgroundUrl?: AssetInterface;
    overlay?: boolean;
    overlayColor?: string;
    imageWidth?: number;
    imageHeight?: number;
    imageClass?: string;
    imageContainerClass?: string;
    containerClass?: string;
    imageSize?: string;
  };
  contentData: {
    title?: string;
    content?: string;
  };
  mobileStyleData: ImagePlusTextData['styleData'];
  mobileContentData: ImagePlusTextData['contentData'];
}

export interface GenericTableData extends MainModuleThemeInterface {
  type: ModulesType.TABLE;
  styleData: {
    classes?: {
      root?: string;
      grid?: string;
      rows?: string;
    };
  };
  contentData: {
    dataSource?: DataSource;
    xlsReports?: XlsReportsDto;
    columns: Array<ColumnsTable>;
    actions?: Array<Actions>;
    lineActions?: Actions;
    tableStyles?: TableStylesClasses;
    externalFilterClasses?: {
      root?: string;
    };
  };
}

enum ImagePositionEnum {
  LEFT = 'left',
  RIGHT = 'right',
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
  IMAGE_PLUS_TEXT = 'Imagem + Texto',
  PARAGRAPH = 'Paragraph',
  PRODUCT_PAGE = 'Product_page',
  MIDIA = 'Midia',
  GRID_ITEM_AREA = 'GridItemArea',
  DYNAMIC_API = 'DynamicApi',
  TABLE = 'Table',
  BANNER_VARIANT = 'BannerVariant',
  CONTENT_CARD = 'Content Card',
  BUTTON = 'Button',
  BANNER_WJJC = 'BannerWJJC',
  PASS_BENEFIT = 'Pass - Benefício',
}

export interface GetPageInfoInterface {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  projectId: string;
  routePattern: string;
  routePatternRegex: string;
  isRoutePatternRegex: boolean;
  data: any;
  name: string;
  isActive: boolean;
  auth: Auth;
}

export interface Auth {
  data: Data2;
  type: string;
  redirectUrl: string;
}

export interface Data2 {
  whitelists: any[];
}
