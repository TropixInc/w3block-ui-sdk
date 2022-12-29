export interface TemplateData {
  title: string;
  items: {
    type: keyof Template;
    props: HeaderData | BannerData | FooterData;
  }[];
}

export type DefaultDataProps = HeaderProps | BannerProps | FooterProps;

type HeaderProps = { data: HeaderData; defaultData: HeaderDefault };
type BannerProps = { data: BannerData; defaultData: BannerDefault };
type FooterProps = { data: FooterData; defaultData: FooterDefault };

export interface Template {
  header: HeaderDefault;
  banner: BannerDefault;
  footer: FooterDefault;
}

export type HeaderData = {
  brandText?: string;
  bgColor?: string;
  textColor?: string;
  links?: Link[];
};

export type HeaderDefault = {
  bgColor: string;
  textColor: string;
};

export type FooterData = {
  bgColor?: string;
  textColor?: string;
  description?: string;

  menuTextColor?: string;
  menuHoverColor?: string;
  menuLinks?: Link[];

  socialNetworkIconColor?: string;
  socialNetworkIconHoverColor?: string;
  socialNetworks?: SocialNetwork[];
};

export type FooterDefault = {
  footerBgColor: string;
  footerTextColor: string;
  menuTextColor: string;
  menuHoverColor: string;
  socialNetworkIconColor: string;
  socialNetworkIconHoverColor: string;
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

type Link = {
  label: string;
  type: 'internal' | 'external';
  value: string;
};

type SocialNetwork = { url: string; type: SocialNetworkType };

export type SocialNetworkType =
  | 'twitter'
  | 'telegram'
  | 'discord'
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'whatsapp'
  | 'website';
