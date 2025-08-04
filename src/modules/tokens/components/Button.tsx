interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const primaryVariant = 'pw-bg-brand-primary pw-text-white pw-shadow-md';

const secondaryVariant =
  'pw-border-2 pw-border-brand-primary pw-bg-[#EFEFEF] pw-text-[#383857]';

export const Button = ({
  children,
  variant = 'primary',
  onClick,
  className = '',
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${
        variant == 'primary' ? primaryVariant : secondaryVariant
      } ${className} pw-py-[10px] active:pw-scale-90 pw-px-[24px] sm:pw-min-w-[118px] pw-font-poppins pw-font-medium pw-text-xs pw-rounded-[48px]`}
    >
      {children}
    </button>
  );
};
