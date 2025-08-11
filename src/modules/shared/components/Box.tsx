import { ReactNode } from 'react';

interface BoxProps {
  children: ReactNode;
  className?: string;
}

export const Box = ({ children, className }: BoxProps) => {
  return (
    <div
      className={`pw-bg-white pw-w-full pw-rounded-lg pw-px-[35px] pw-py-[40px] pw-shadow-brand-shadow pw-max-w-[520px] ${className}`}
    >
      {children}
    </div>
  );
};
