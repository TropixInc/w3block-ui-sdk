export interface TemplateData {
  title: string;
  items: {
    type: keyof Template;
    props: HeaderData | BannerData | HeroData | MenuData;
  }[];
}

export type DefaultDataProps =
  | HeaderProps
  | BannerProps
  | HeroProps
  | MenuProps;

type HeaderProps = { data: HeaderData; defaultData: HeaderDefault };
type BannerProps = { data: BannerData; defaultData: BannerDefault };
type MenuProps = { data: MenuData; defaultData: MenuDefault };
type HeroProps = { data: HeroData; defaultData: HeroDefault };

export interface Template {
  header: HeaderDefault;
  banner: BannerDefault;
  menu: MenuDefault;
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
export type MenuData = {
  bgColor?: string;
  textColor?: string;
  categories?: CategoryItem[];
};

export type MenuDefault = {
  bgColor: string;
  textColor: string;
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
