export interface TemplateData {
  title: string;
  items: {
    type: keyof Template;
    props: HeaderData | CategoryData | BannerData;
  }[];
}

export type DefaultDataProps = HeaderProps | CategoryProps | BannerProps;

type HeaderProps = { data: HeaderData; defaultData: HeaderDefault };
type CategoryProps = { data: CategoryData; defaultData: CategoryDefault };
type BannerProps = { data: BannerData; defaultData: BannerDefault };

export interface Template {
  header: HeaderDefault;
  categories: CategoryDefault;
  banner: BannerDefault;
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

export type SlideContentDefault = {
  bgColor: string;
  overlayColor: string;
  alignment: Alignment;
  titleColor: string;
  subtitleColor?: string;
  button: {
    textColor: string;
    bgColor: string;
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
