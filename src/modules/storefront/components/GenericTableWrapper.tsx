import React from 'react';

import { GenericTable } from '../../shared/components/GenericTable/GenericTable';
import { GenericTableData } from '../interfaces';

export const GenericTableWrapper = ({ data }: { data: GenericTableData }) => {
  const { styleData, contentData } = data;
  return (
    <GenericTable
      config={contentData}
      classes={{
        grid: styleData?.classes?.grid,
        root: styleData?.classes?.root,
        rows: styleData?.classes?.rows,
      }}
    />
  );
};
