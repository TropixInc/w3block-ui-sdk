interface ButtonProps {
  children: React.ReactNode;
  style?: string;
  onClick?: () => void;
}

export const Button = ({ children, style, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`pw-bg-brand-primary pw-py-[10px] pw-px-[24px] pw-font-poppins pw-font-medium pw-text-xs pw-text-white pw-shadow-md pw-rounded-[48px] ${style}`}
    >
      {children}
    </button>
  );
};
