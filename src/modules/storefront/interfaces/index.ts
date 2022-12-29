export interface TemplateData {
  title: string;
  items: {
    type: keyof Template;
    props: HeaderData | MenuData;
  }[];
}

export type DefaultDataProps = HeaderProps | MenuProps;

type HeaderProps = { data: HeaderData; defaultData: HeaderDefault };
type MenuProps = { data: MenuData; defaultData: MenuDefault };

export interface Template {
  header: HeaderDefault;
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

export type MenuData = {
  bgColor?: string;
  textColor?: string;
  categories?: CategoryItem[];
};

export type MenuDefault = {
  menuBgColor: string;
  menuTextColor: string;
};

type CategoryItem = { label: string; slug: string };
type HeaderLink = {
  label: string;
  type: 'internal' | 'external';
  value: string;
  newWindow: boolean;
};
