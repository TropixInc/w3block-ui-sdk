import { HeaderPixwaySDK } from '../../shared';
import {
  BannerData,
  BannerDefault,
  HeaderData,
  HeaderDefault,
  HeroData,
  HeroDefault,
} from '../interfaces';

export const Header = ({
  data,
  defaultData,
}: {
  data: HeaderData;
  defaultData: HeaderDefault;
}) => {
  const backgroundColor = data.bgColor || defaultData.bgColor;
  const color = data.textColor || defaultData.textColor;
  const brandText = data.brandText;

  return (
    <HeaderPixwaySDK
      bgColor={backgroundColor}
      textColor={color}
      brandText={brandText}
    />
  );
};

export const Banner = ({
  data,
  defaultData,
}: {
  data: BannerData;
  defaultData: BannerDefault;
}) => {
  return <>{JSON.stringify({ ...data, ...defaultData })}</>;
};

export const Hero = ({
  data,
  defaultData,
}: {
  data: HeroData;
  defaultData: HeroDefault;
}) => {
  return <>{JSON.stringify({ ...data, ...defaultData })}</>;
};
