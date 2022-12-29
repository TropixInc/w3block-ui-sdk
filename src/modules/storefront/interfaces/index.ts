export interface TemplateData {
  title: string;
  items: {
    type: keyof Template;
    props: HeaderData | FooterData;
  }[];
}

export type DefaultDataProps = HeaderProps | FooterProps;

type HeaderProps = { data: HeaderData; defaultData: HeaderDefault };
type FooterProps = { data: FooterData; defaultData: FooterDefault };

export interface Template {
  header: HeaderDefault;
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
