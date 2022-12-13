export interface TemplateData {
  title: string;
  items: {
    type: keyof Template;
    props: HeaderData | BannerData | HeroData;
  }[];
}

export type DefaultDataProps = HeaderProps | BannerProps | HeroProps;

type HeaderProps = { data: HeaderData; defaultData: HeaderDefault };
type BannerProps = { data: BannerData; defaultData: BannerDefault };
type HeroProps = { data: HeroData; defaultData: HeroDefault };

export interface Template {
  header: HeaderDefault;
  banner: BannerDefault;
  hero: HeroDefault;
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

type CategoryItem = { label: string; slug: string };
type HeaderLink = {
  label: string;
  type: 'internal' | 'external';
  value: string;
  newWindow: boolean;
};
