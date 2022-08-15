import classNames from 'classnames';

interface Props {
  className?: string;
}

const Spinner = ({ className = '' }: Props) => {
  return (
    <div
      className={classNames(
        className,
        'w-10 h-10 rounded-full bg-transparent border-[5px] border-[#5682C3] border-t-[#E9F0FB] animate-spin'
      )}
    />
  );
};

export default Spinner;
