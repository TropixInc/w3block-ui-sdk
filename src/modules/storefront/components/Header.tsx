import { HeaderPixwaySDK } from '../../shared';

export const Header = (props: { data: HeaderProps }) => {
  const { bgColor, textColor, brandText, links } = props.data;

  return (
    <HeaderPixwaySDK
      bgColor={bgColor}
      textColor={textColor}
      brandText={brandText}
      tabs={links?.map((l) => ({ name: l.label, router: l.value }))}
    />
  );
};

export type HeaderData = {
  type: 'header';
  brandText?: string;
  links?: HeaderLink[];
} & Partial<HeaderDefault>;

export type HeaderDefault = {
  bgColor: string;
  textColor: string;
};

type HeaderProps = Omit<HeaderData & HeaderDefault, 'type'>;

type HeaderLink = {
  type: 'internal' | 'external';
  newWindow: boolean;
  label: string;
  value: string;
};
