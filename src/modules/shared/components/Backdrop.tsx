interface Props {
  onClick?: () => void;
  className?: string;
}

export const Backdrop = ({ onClick, className }: Props) => {
  return (
    <div
      className={`pw-fixed pw-left-0 pw-top-0 pw-h-screen pw-w-full pw-bg-black pw-opacity-50 pw-z-40 ${className}`}
      onClick={onClick}
    />
  );
};
