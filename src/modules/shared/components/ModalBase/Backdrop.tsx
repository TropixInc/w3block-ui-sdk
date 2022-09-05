interface Props {
  onClick?: () => void;
}

export const Backdrop = ({ onClick }: Props) => {
  return (
    <div
      className="fixed left-0 top-0 h-screen w-full bg-black opacity-50 z-40"
      onClick={onClick}
    />
  );
};
