export interface TemplateData {
  title: string;
  items: {
    type: ComponentType;
    props: HeaderData | BannerData | MenuData;
  }[];
}

export interface Template {
  header: HeaderDefault;
  banner: BannerDefault;
  menu: MenuDefault;
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
  brandText?: string;
  bgColor?: string;
  textColor?: string;
  links?: HeaderLink[];
};

export type MenuDefault = {
  bgColor: string;
  textColor: string;
};

export type BannerDefault = {
  bgColor: string;
  textColor: string;
};

type CategoryItem = { label: string; slug: string };
type HeaderLink = {
  label: string;
  type: 'internal' | 'external';
  value: string;
  newWindow: boolean;
};

type ComponentType = 'header' | 'banner' | 'menu';
