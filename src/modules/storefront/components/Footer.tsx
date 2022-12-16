import React from 'react';

import { FooterData, FooterDefault } from '../interfaces';

export const Footer = ({
  data,
  defaultData,
}: {
  data: FooterData;
  defaultData: FooterDefault;
}) => {
  const color = data.bgColor || defaultData.textColor;

  return (
    <div
      style={{ backgroundColor: color }}
      className="pw-w-full pw-px-5 absolute pw-h-57"
    >
      teste
    </div>
  );
};
