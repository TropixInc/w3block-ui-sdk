interface Props {
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Backdrop = ({ onClick, className, style }: Props) => {
  const baseClasses = 'pw-fixed pw-left-0 pw-top-0 pw-h-screen pw-w-full pw-z-40';
  const defaultClasses = !style ? 'pw-bg-black pw-opacity-50' : '';
  
  return (
    <div
      className={`${baseClasses} ${defaultClasses} ${className || ''}`}
      style={style}
      onClick={onClick}
    />
  );
};
