import { CSSProperties } from 'react';

import classNames from 'classnames';

import DisplayCardBase from '../DisplayCardBase';

interface GenericFieldValueDisplayFormatProps {
  className?: string;
  fieldKey: string;
  value: string;
}

interface Props {
  className?: string;
  category: string;
  subcategory: string;
  listClassName?: string;
  style?: CSSProperties;
}

const CategoryDisplayValue = ({
  className = '',
  fieldKey,
  value,
}: GenericFieldValueDisplayFormatProps) => (
  <div
    className={classNames(className, 'flex gap-x-2 text-base leading-[19px]')}
  >
    <h4 className="font-medium">{fieldKey}:</h4>
    <p>{value}</p>
  </div>
);

const CategoryDisplayCard = ({
  className = '',
  listClassName = '',
  category,
  subcategory,
  style,
}: Props) => {
  return (
    <DisplayCardBase
      className={classNames('!text-black !py-4', className)}
      style={style}
    >
      <ul
        className={classNames(
          'grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-y-8 gap-x-2.5',
          listClassName
        )}
      >
        <li>
          <CategoryDisplayValue fieldKey="Categoria" value={category} />
        </li>
        <li>
          <CategoryDisplayValue fieldKey="Subcategoria" value={subcategory} />
        </li>
      </ul>
    </DisplayCardBase>
  );
};

export default CategoryDisplayCard;
