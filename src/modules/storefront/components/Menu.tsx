import React from 'react';

import { MenuData, MenuDefault } from '../interfaces';

export const Menu = ({
  data,
  defaultData,
}: {
  data: MenuData;
  defaultData: MenuDefault;
}) => {
  const color = data.textColor || defaultData.textColor;

  return (
    <>
      <div color={color}></div>
    </>
  );
};
