interface Props {
  className?: string;
}

export const Spinner = ({ className = '' }: Props) => {
  return (
    <div
      className={`pw-w-10 pw-h-10 pw-rounded-full pw-bg-transparent pw-border-[5px] pw-border-[#5682C3] pw-border-t-[#E9F0FB] pw-animate-spin
        ${className}`}
    />
  );
};
