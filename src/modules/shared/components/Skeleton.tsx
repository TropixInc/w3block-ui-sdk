import classNames from 'classnames';

interface Props {
  className?: string;
  rounded?: boolean;
}

const Skeleton = ({ className = '', rounded = false }: Props) => {
  return (
    <div
      className={classNames(
        className,
        rounded ? 'rounded-full' : '',
        'pw-animate-pulse pw-bg-[#C4C4C4]'
      )}
    />
  );
};

export default Skeleton;
