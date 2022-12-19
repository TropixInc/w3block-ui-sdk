import { HeaderPixwaySDK } from '../../shared';
import { HeaderData, HeaderDefault } from '../interfaces';

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
