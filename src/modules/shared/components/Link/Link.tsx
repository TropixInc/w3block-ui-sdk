import { ReactNode } from 'react';

export interface LinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  disabled?: boolean;
  itemProp?: string;
}

export const Link = ({
  children,
  href,
  className = '',
  disabled = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  itemProp = '',
}: LinkProps) => {
  return disabled ? (
    <div className={className}>{children}</div>
  ) : (
    <a aria-disabled={disabled} href={href} className={className}>
      {children}
    </a>
  );
};
