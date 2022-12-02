export interface TemplateData {
  title: string;
  items: {
    type: ComponentType;
    props: HeaderData | BannerData;
  }[];
}

export interface Template {
  header: HeaderDefault;
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

export type BannerData = {
  bgColor?: string;
  textColor?: string;
  categories?: CategoryItem[];
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

type ComponentType = 'header' | 'banner';
