import classNames from 'classnames';

import PixwayIcon from '../../assets/icons/pixwayIconFilled.svg?react';

interface Props {
  className?: string;
}

export const FallbackImage = ({ className = '' }: Props) => {
  return (
    <div
      className={classNames(
        className,
        'pw-bg-[rgb(230,232,236)] pw-flex pw-items-center pw-justify-center pw-overflow-hidden'
      )}
    >
      <PixwayIcon className="pw-w-17 pw-h-17 pw-fill-white" />
    </div>
  );
};
