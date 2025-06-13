interface ShimmerProps {
  className?: string;
}
export const Shimmer = ({ className }: ShimmerProps) => {
  return (
    <div
      className={`pw-h-4 pw-w-[50px] pw-animate-pulse pw-bg-[rgba(0,0,0,0.1)] ${className}`}
    ></div>
  );
};
