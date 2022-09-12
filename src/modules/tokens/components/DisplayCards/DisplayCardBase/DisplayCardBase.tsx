import { CSSProperties, ReactNode } from 'react';

import classNames from 'classnames';

interface DisplayContainerProps {
  children?: ReactNode;
  className?: string;
  onEdit?: () => void;
  style?: CSSProperties;
}

export const DisplayCardBase = ({
  children,
  className = '',
  onEdit,
  style,
}: DisplayContainerProps) => (
  <ul
    style={style}
    className={classNames(
      className,
      'pw-px-[35px] sm:pw-pl-6 sm:pw-pr-[75px] pw-py-6 pw-bg-[#FFFFFF] pw-relative pw-rounded-lg'
    )}
  >
    {onEdit ? (
      <button
        className="pw-text-[#B09C60] pw-underline pw-absolute pw-right-6 pw-top-6"
        onClick={onEdit}
      >
        Editar
      </button>
    ) : null}
    {children}
  </ul>
);
