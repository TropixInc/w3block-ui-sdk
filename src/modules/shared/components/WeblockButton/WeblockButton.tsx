import { ReactNode, SyntheticEvent } from 'react';

interface WeblocButtonProps {
  children: ReactNode;
  fullWidth?: boolean;
  tailwindBgColor?: string;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: SyntheticEvent) => void;
}

export const WeblockButton = ({
  children,
  fullWidth = false,
  tailwindBgColor = 'pw-bg-brand-primary',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
}: WeblocButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${
        fullWidth ? 'pw-w-full' : ''
      } !${tailwindBgColor} font-montserrat pw-cursor-pointer pw-text-xs pw-rounded-full pw-border-b pw-border-white pw-flex pw-justify-center pw-items-center pw-py-3 pw-px-[30px] pw-shadow-[0px_2px_4px_rgba(0,0,0,0.26)] ${className}`}
    >
      {children}
    </button>
  );
};
