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

export type BannerData = {
  bgColor?: string;
  textColor?: string;
  categories?: CategoryItem[];
};

export type BannerDefault = {
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
  bgColor: string;
  textColor: string;
  menuTextColor: string;
  menuHoverColor: string;
  socialNetworkIconColor: string;
  socialNetworkIconHoverColor: string;
};

type CategoryItem = { label: string; slug: string };

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
