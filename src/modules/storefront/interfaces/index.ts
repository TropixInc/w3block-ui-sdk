export interface TemplateData {
  title: string;
  items: {
    type: keyof Template;
    props: HeaderData | BannerData | HeroData | FooterData;
  }[];
}

export type DefaultDataProps =
  | HeaderProps
  | BannerProps
  | HeroProps
  | FooterProps;

type HeaderProps = { data: HeaderData; defaultData: HeaderDefault };
type BannerProps = { data: BannerData; defaultData: BannerDefault };
type FooterProps = { data: FooterData; defaultData: FooterDefault };
type HeroProps = { data: HeroData; defaultData: HeroDefault };

export interface Template {
  header: HeaderDefault;
  banner: BannerDefault;
  hero: HeroDefault;
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

export type HeroData = {
  data?: string;
};

export type HeroDefault = {
  data: string;
};

export type FooterData = {
  bgColor?: string;
  textColor?: string;
  links?: Link[];
  defaultSocialNetworks?: SocialNetwork[];
  description?: string;
};

export type FooterDefault = {
  bgColor: string;
  textColor: string;
};

type CategoryItem = { label: string; slug: string };
type Link = {
  label: string;
  type: 'internal' | 'external';
  value: string;
  newWindow: boolean;
};

type SocialNetwork = {
  id: string;
  url: string;
  type: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'whatsapp' | 'url';
};
