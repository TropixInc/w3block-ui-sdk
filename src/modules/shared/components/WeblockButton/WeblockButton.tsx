import { ReactNode, SyntheticEvent } from 'react';

interface WeblocButtonProps {
  children: ReactNode;
  fullWidth?: boolean;
  tailwindBgColor?: string;
  className?: string;
  disabled?: boolean;
  onClick?: (event: SyntheticEvent) => void;
}

export const WeblockButton = ({
  children,
  fullWidth = false,
  tailwindBgColor = 'pw-bg-brand-primary',
  className = '',
  disabled = false,
  onClick,
}: WeblocButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${
        fullWidth ? 'pw-full' : ''
      } ${tailwindBgColor} font-montserrat pw-cursor-pointer pw-text-xs pw-rounded-full pw-border-b pw-border-white pw-flex pw-justify-center pw-items-center pw-py-3 pw-px-[30px] shadow-[0px_2px_4px_rgba(0,0,0,0.26)] ${className}`}
    >
      {children}
    </button>
  );
};
