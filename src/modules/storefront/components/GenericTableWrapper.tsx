import React from 'react';

import { GenericTable } from '../../shared/components/GenericTable/GenericTable';
import { GenericTableData } from '../interfaces';

export const GenericTableWrapper = ({ data }: { data: GenericTableData }) => {
  const { styleData, contentData, id } = data;
  return (
    <div
      className="pw-container pw-mx-auto pw-pb-10 pw-px-2 sm:!pw-px-0"
      id={`sf-${id}`}
    >
      <GenericTable
        config={contentData}
        classes={{
          grid: styleData?.classes?.grid,
          root: styleData?.classes?.root,
          rows: styleData?.classes?.rows,
        }}
      />
    </div>
  );
};
